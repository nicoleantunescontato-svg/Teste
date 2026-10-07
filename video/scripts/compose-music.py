# Soft piano + pad background track, synthesized (no third-party audio).
import numpy as np, wave, sys
SR=44100; BPM=72; beat=60/BPM; DUR=float(sys.argv[2]); out=sys.argv[1]
N=int(SR*(DUR+3)); L=np.zeros(N); R=np.zeros(N)
def f(m): return 440*2**((m-69)/12)
def piano(m,t0,dur,vel,pan):
    n=int(SR*min(dur+1.5,6)); t=np.arange(n)/SR; fr=f(m)
    env=np.exp(-t*(1.6+fr/900))*(1-np.exp(-t*300))
    s=sum(a*np.sin(2*np.pi*fr*k*t*(1+0.0004*k*k)) for k,a in [(1,1),(2,.35),(3,.12),(4,.05)])
    s*=env*vel; i=int(t0*SR); e=min(N,i+n); s=s[:e-i]
    L[i:e]+=s*(1-pan); R[i:e]+=s*pan
def pad(ms,t0,dur,vel):
    n=int(SR*(dur+1)); t=np.arange(n)/SR
    env=np.minimum(1,t/1.2)*np.minimum(1,np.maximum(0,(dur+1-t)/1.2))
    s=np.zeros(n)
    for m in ms:
        for d in (-0.08,0.08):
            s+=np.sin(2*np.pi*f(m)*(1+d/100)*t)+0.2*np.sin(2*np.pi*2*f(m)*t)
    s*=env*vel/len(ms); i=int(t0*SR); e=min(N,i+n)
    L[i:e]+=s[:e-i]; R[i:e]+=s[:e-i]
# I - vi - IV - V in C (Cmaj9, Am7, Fmaj7, G6sus), 2 bars each (4/4)
prog=[([48,55,59,62,64],[60,64,67,71]),([45,52,55,60,64],[57,60,64,67]),
      ([41,48,52,55,60],[53,57,60,64]),([43,50,55,57,62],[55,59,62,64])]
rng=np.random.default_rng(7); bar=4*beat; t=0; ci=0
while t<DUR:
    low,up=prog[ci%4]; seg=2*bar
    pad(up,t,seg,0.05)
    piano(low[0],t,seg,0.30,0.45); piano(low[0]+12,t+bar,bar,0.16,0.45)
    arp=[low[1],low[2],low[3],low[4],low[3],low[2]]
    for b in range(8):  # gentle arpeggio, 1 note per beat
        m=arp[b%len(arp)]+12; piano(m,t+b*beat+rng.uniform(0,.015),beat,0.13+0.03*(b%2==0),0.35+0.3*rng.random())
    t+=seg; ci+=1
st=np.stack([L,R],1)[:int(SR*DUR)]
fi,fo=int(SR*2),int(SR*3)
st[:fi]*=np.linspace(0,1,fi)[:,None]; st[-fo:]*=np.linspace(1,0,fo)[:,None]
st/=np.abs(st).max()*1.12
w=wave.open(out,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype('<i2').tobytes()); w.close()
