import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FullVideo } from "./common";

const pts = Array.from({ length: 24 }, (_, i) => {
  const t = i / 23;
  return 1 - (t * t * 0.7 + t * 0.25 + Math.sin(i * 2.1) * 0.02);
});

export const GraficoDeVidro: React.FC<{ value: number }> = ({ value }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [8, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enter = spring({ frame, fps, config: { damping: 15 } });
  const W = 860;
  const H = 300;
  const path = pts
    .map((y, i) => `${i ? "L" : "M"}${(i / 23) * W},${y * H}`)
    .join(" ");
  const len = 1800;
  const n = Math.round(p * (pts.length - 1));
  const tip = { x: (n / 23) * W, y: pts[n] * H };
  return (
    <>
      <FullVideo scale={1.05} />
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          bottom: "20%",
          borderRadius: 36,
          padding: 40,
          background:
            "linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.04))",
          backdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,.22)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 60}px)`,
          color: "#fff",
          fontFamily: "Montserrat",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.3em",
              opacity: 0.55,
              fontFamily: "monospace",
            }}
          >
            SEGUIDORES
          </span>
          <span style={{ fontSize: 96, fontWeight: 800 }}>
            {Math.round(p * value)}
            <span style={{ fontSize: 44 }}> mil</span>
          </span>
        </div>
        <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(34,197,94,.35)" />
              <stop offset="1" stopColor="rgba(34,197,94,0)" />
            </linearGradient>
            <clipPath id="c">
              <rect x="0" y="0" width={tip.x} height={H + 20} />
            </clipPath>
          </defs>
          <path
            d={`${path} L${W},${H} L0,${H} Z`}
            fill="url(#g)"
            clipPath="url(#c)"
          />
          <path
            d={path}
            fill="none"
            stroke="#22c55e"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
          <circle
            cx={tip.x}
            cy={tip.y}
            r={10}
            fill="#4ade80"
            style={{ filter: "drop-shadow(0 0 10px #22c55e)" }}
          />
        </svg>
      </div>
    </>
  );
};
