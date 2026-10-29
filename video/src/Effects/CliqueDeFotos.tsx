import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SplitLayout } from "./common";

const cards = [
  { t: "Setembro 2026", s: "Um mês atrás", bg: "#d6efd4" },
  { t: "16.981", s: "curtidas", bg: "#fff" },
  { t: "Tudo que você precisa", s: "Claude · ChatGPT", bg: "#d6efd4" },
];

export const CliqueDeFotos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
    },
  );
  return (
    <SplitLayout>
      {cards.map((c, i) => {
        const f = frame - i * 24;
        const sp = spring({
          frame: f,
          fps,
          config: { damping: 12, stiffness: 220 },
        });
        const rot = (random("c" + i) - 0.5) * 16;
        const flash = f >= 0 && f < 2 ? 0.5 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 120 + i * 230,
              top: 90 + (i % 2) * 70,
              width: 400,
              height: 500,
              borderRadius: 24,
              border: "6px solid #fff",
              background: c.bg,
              boxShadow: "0 20px 40px rgba(0,0,0,.18)",
              padding: 28,
              fontFamily: "Montserrat",
              fontWeight: 800,
              fontSize: 44,
              opacity: sp,
              transform: `translateX(${exit * 1200}px) translateY(${(1 - sp) * 120}px) scale(${0.6 + 0.4 * sp}) rotate(${rot}deg)`,
              outline: flash ? "8px solid white" : "none",
            }}
          >
            {c.t}
            <div style={{ fontSize: 24, opacity: 0.6, marginTop: 12 }}>
              {c.s}
            </div>
          </div>
        );
      })}
    </SplitLayout>
  );
};
