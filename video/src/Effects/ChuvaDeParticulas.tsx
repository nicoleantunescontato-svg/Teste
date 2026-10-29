import { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import { SplitLayout } from "./common";

const R = 7;
const BOX_W = 280;
const BOX_H = 330;
const COLS = Math.floor(BOX_W / (R * 2));

export const ChuvaDeParticulas: React.FC<{
  count?: number;
  caption: string;
}> = ({ count = 400, caption }) => {
  const frame = useCurrentFrame();
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const layer = Math.floor(i / COLS);
        const col = i % COLS;
        const start = i * 0.15;
        const fall = 22 + random("f" + i) * 8;
        return {
          i,
          start,
          fall,
          x: col * R * 2 + R + (layer % 2) * R * 0.5,
          yEnd: BOX_H - R - layer * R * 1.75,
          escape: i % 20 === 0,
          ex: (random("e" + i) - 0.5) * 520,
          tone: 0.92 + random("t" + i) * 0.16,
        };
      }),
    [count],
  );
  return (
    <SplitLayout>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 110,
          marginLeft: -BOX_W / 2,
        }}
      >
        <svg width={BOX_W} height={BOX_H + 20} style={{ overflow: "visible" }}>
          {parts.map((p) => {
            const t = (frame - p.start) / p.fall;
            if (t < 0) return null;
            const k = Math.min(t, 1);
            const bounce =
              t >= 1
                ? Math.abs(Math.sin((t - 1) * 9)) *
                  Math.max(0, 6 - (t - 1) * 20)
                : 0;
            const y = -R * 2 + (p.yEnd + R * 2) * k * k - bounce;
            const x = p.escape ? p.x + p.ex * k : p.x;
            const yy = p.escape
              ? y - (1 - k) * 0 + (k > 0.5 ? (k - 0.5) * 300 : 0)
              : y;
            return (
              <circle
                key={p.i}
                cx={x}
                cy={yy}
                r={R}
                fill={`hsl(5 ${70 * p.tone}% ${50 * p.tone}%)`}
              />
            );
          })}
          <rect
            x={0}
            y={0}
            width={BOX_W}
            height={BOX_H}
            fill="none"
            stroke="#2b2b2b"
            strokeWidth={3}
            strokeDasharray={`${BOX_H} ${BOX_W} ${BOX_H + BOX_W} 0`}
          />
          <path
            d={`M0,0 V${BOX_H} H${BOX_W} V0`}
            fill="none"
            stroke="#2b2b2b"
            strokeWidth={3}
          />
        </svg>
        {["01", "02", "03"].map((l, i) => (
          <span
            key={l}
            style={{
              position: "absolute",
              fontFamily: "monospace",
              fontSize: 14,
              left: i === 0 ? -34 : i === 2 ? BOX_W + 12 : BOX_W / 2 - 8,
              top: i === 1 ? BOX_H + 12 : BOX_H / 2,
            }}
          >
            {l}
          </span>
        ))}
        <div
          style={{
            position: "absolute",
            top: BOX_H + 30,
            width: BOX_W,
            textAlign: "center",
            fontFamily: "Montserrat",
            fontWeight: 800,
            fontSize: 34,
            color: "#c0392b",
          }}
        >
          {caption}
        </div>
      </div>
    </SplitLayout>
  );
};
