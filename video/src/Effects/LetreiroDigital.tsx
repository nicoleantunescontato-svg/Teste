import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LetreiroDigital: React.FC<{ words: string[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shift = interpolate(frame, [0, durationInFrames], [150, -250]);
  const dots = "radial-gradient(circle, #000 2.4px, transparent 3px)";
  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1.5px)",
        backgroundSize: "6px 6px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translateX(${shift}px)`,
          fontFamily: "Montserrat",
          fontWeight: 800,
          fontSize: 300,
          letterSpacing: -6,
          color: "#f5f5f5",
          textShadow: "0 0 14px rgba(255,255,255,.35)",
          WebkitMaskImage: dots,
          maskImage: dots,
          WebkitMaskSize: "6px 6px",
          maskSize: "6px 6px",
        }}
      >
        {words.map((w, i) => {
          const f = frame - i * 8;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 40,
                opacity: interpolate(f, [0, 4], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateX(${interpolate(f, [0, 4], [40, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
