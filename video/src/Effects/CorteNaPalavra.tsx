import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CorteNaPalavra: React.FC<{ word: string }> = ({ word }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const blur = interpolate(frame, [0, 6], [12, 6], {
    extrapolateRight: "clamp",
  });
  const shake = frame < 6 ? Math.sin(frame * 3) * 8 : 0;
  const s = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const fade = interpolate(
    frame,
    [durationInFrames - 4, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    },
  );
  const lines = [
    "As agências estão repensando o trabalho e reconstruindo",
    "a rotina antes do almoço, depois da reunião final em volta",
    "dos primeiros usuários, que acharam estranho, depois impos-",
    "sível ficar sem. A ferramenta lê cada palavra e acompanha",
  ];
  return (
    <AbsoluteFill
      style={{ background: "#efe6d6", opacity: fade, overflow: "hidden" }}
    >
      <div
        style={{
          filter: `blur(${blur}px)`,
          transform: `scale(1.15) translateX(${shake}px)`,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 78,
          color: "#2a2a2a",
          lineHeight: 1.25,
          padding: 40,
          marginTop: 120,
        }}
      >
        {[...lines, ...lines].map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            background: "#c0392b",
            color: "#fff",
            fontFamily: "Georgia, serif",
            fontWeight: 800,
            fontSize: 230,
            padding: "0 36px",
            transform: `scale(${interpolate(s, [0, 1], [1.25, 1])}) rotate(-1deg)`,
            boxShadow: "0 8px 0 rgba(0,0,0,.25)",
          }}
        >
          {word}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
