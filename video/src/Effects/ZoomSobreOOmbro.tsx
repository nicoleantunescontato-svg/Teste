import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FullVideo } from "./common";

export const ZoomSobreOOmbro: React.FC<{
  value: string;
  label: string;
  sub: string;
}> = ({ value, label, sub }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const sp = spring({ frame: frame - 12, fps, config: { damping: 13 } });
  const out = interpolate(
    frame,
    [durationInFrames - 5, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    },
  );
  return (
    <>
      <FullVideo scale={zoom} />
      <div
        style={{
          position: "absolute",
          top: "22%",
          right: "4%",
          background: "#fff",
          borderRadius: 20,
          padding: "20px 28px",
          boxShadow: "0 16px 40px rgba(0,0,0,.25)",
          fontFamily: "Montserrat",
          opacity: Math.min(sp, 1) * out,
          transform: `translateY(${(1 - sp) * 80}px) scale(${0.8 + 0.2 * sp}) rotate(${4 + (1 - sp) * 10}deg)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 2,
            color: "#c0392b",
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#c0392b",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 20, color: "#777" }}>{sub}</div>
      </div>
    </>
  );
};
