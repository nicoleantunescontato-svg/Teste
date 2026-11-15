from pathlib import Path
import numpy as np
import trimesh as tm
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

OUT=Path(__file__).parent
def box(x,y,z,w,d,h):
    m=tm.creation.box([w,d,h]);m.apply_translation([x+w/2,y+d/2,z+h/2]);return m
def rounded(x,y,z,w,d,h,r=4):
    pts=[]
    for cx,cy in [(x+r,y+r),(x+w-r,y+r),(x+r,y+d-r),(x+w-r,y+d-r)]:
        c=tm.creation.cylinder(r,h,sections=24);c.apply_translation([cx,cy,z+h/2]);pts.extend(c.vertices)
    return tm.convex.convex_hull(np.array(pts))
def union(ms):return tm.boolean.union(ms,engine='manifold')
def diff(m,ms):return tm.boolean.difference([m]+ms,engine='manifold')

# All geometry in millimetres. Each STL rests at z=0 for printing.
# Medidas da bancada (fotos): profundidade ~100 mm (parede ate a borda da pia), comprimento livre >= 260 mm.
W,D=244,90            # suporte
TW,TD=W+6,D+6         # bandeja = 250 x 96
X1,X2=95,165          # zonas: sabao 0-95 | esponja 95-165 | escova 165-244
t=3
plate=rounded(0,0,0,W,D,3)
rim=diff(rounded(0,0,0,W,D,15),[rounded(t,t,-1,W-2*t,D-2*t,18,2)])
def walls(x0,x1,h):
    return [box(x0,0,0,x1-x0,t,h),box(x0,D-t,0,x1-x0,t,h),box(x0,0,0,t,D,h),box(x1-t,0,0,t,D,h)]
parts=[plate,rim]+walls(X1,X2,40)+walls(X2,W,70)
# Nervuras: sabao fica afastado do piso, agua escorre por baixo.
for y in [14,30,46,62,76]:parts.append(box(3,y,2,X1-6,2.4,3.4))
body=union(parts)
holes=[]
for y in [8,22,38,54,69,82]:
    for x in [8,29,50,71]:holes.append(rounded(x,y,-1,18,3.4,5,1.5))
for x,ys in [(X1+35,[20,45,70]),(X2+37,[20,45,70])]:
    for y in ys:
        c=tm.creation.cylinder(2.5,6,sections=24);c.apply_translation([x,y,1]);holes.append(c)
body=diff(body,holes)
# Bandeja: folga lateral 0,6 mm; apoios deixam 4 mm de espaco para drenagem.
tray=diff(rounded(0,0,0,TW,TD,9,6),[rounded(2.4,2.4,2,TW-4.8,TD-4.8,9,3.6)])
pads=[box(x,y,1.5,8,8,4.5) for x in [5,TW/2-4,TW-13] for y in [5,TD-13]]
tray=union([tray]+pads)
for name,m in [('Suporte',body),('Bandeja',tray)]:
    assert m.is_watertight and m.is_volume
    assert len(m.split())==1
    m.export(OUT/(name+'.stl'))
    print(name,'dimensões mm',m.extents,'volume cm³',round(m.volume/1000,1),'malha fechada',m.is_watertight)
# Orthographic z-buffer rendering of exact STL geometry.
from PIL import Image

def render(exploded):
    b=body.copy();b.apply_translation([3,3,30 if exploded else 6])
    eye=np.array([1.,-1.8,1.7]);eye/=np.linalg.norm(eye)
    right=np.cross([0,0,1],eye);right/=np.linalg.norm(right)
    up=np.cross(eye,right);R=np.array([right,up,eye]).T
    W,H=850,700;img=np.ones((H,W,3))*np.array([245,243,239]);depth=np.full((H,W),-np.inf)
    light=np.array([-0.5,-0.7,1.]);light/=np.linalg.norm(light)
    for mesh,color in [(tray,[38,39,40]),(b,[38,39,40])]:
        v=(mesh.vertices-np.array([125,48,35]))@R
        v[:,:2]*=2.5;v[:,0]+=W/2;v[:,1]=H/2-v[:,1]
        for face,n in zip(mesh.faces,mesh.face_normals):
            t=v[face];xmin=max(0,int(np.floor(t[:,0].min())));xmax=min(W-1,int(np.ceil(t[:,0].max())))
            ymin=max(0,int(np.floor(t[:,1].min())));ymax=min(H-1,int(np.ceil(t[:,1].max())))
            if xmin>xmax or ymin>ymax:continue
            X,Y=np.meshgrid(np.arange(xmin,xmax+1)+.5,np.arange(ymin,ymax+1)+.5)
            a,c,d=t;den=(c[1]-d[1])*(a[0]-d[0])+(d[0]-c[0])*(a[1]-d[1])
            if abs(den)<1e-9:continue
            u=((c[1]-d[1])*(X-d[0])+(d[0]-c[0])*(Y-d[1]))/den
            w=((d[1]-a[1])*(X-d[0])+(a[0]-d[0])*(Y-d[1]))/den;q=1-u-w
            z=u*a[2]+w*c[2]+q*d[2];region=depth[ymin:ymax+1,xmin:xmax+1]
            mask=(u>=-1e-8)&(w>=-1e-8)&(q>=-1e-8)&(z>region)
            region[mask]=z[mask];img[ymin:ymax+1,xmin:xmax+1][mask]=np.array(color)*(.65+.35*max(0,np.dot(n,light)))
    return img.astype('uint8')
fig,axs=plt.subplots(1,2,figsize=(12,6),facecolor='#f5f3ef')
for ax,title,ex in zip(axs,['Montado · 25 × 9,6 × 7,6 cm','Suporte e bandeja separados'],[False,True]):
    ax.imshow(render(ex));ax.axis('off');ax.set_title(title,fontsize=13)
fig.suptitle('Organizador de lavanderia',fontsize=22)
fig.text(.5,.08,'Sabão à esquerda · Esponja no meio · Escova à direita',ha='center',fontsize=12)
plt.savefig(OUT/'Previa.png',dpi=160,bbox_inches='tight')
