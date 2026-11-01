import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Snippet = {
  font: string;
  weight: number;
  above: string[];
  before: string;
  after: string;
  below: string[];
};

// Cada corte mostra a mesma palavra no mesmo lugar, com um trecho de notícia diferente ao redor.
const SNIPPETS: Snippet[] = [
  {
    font: "'Courier New', monospace",
    weight: 700,
    above: ["te final antes do", "ça. Agências está", "ensando o que é o"],
    before: "a: ",
    after: " fa",
    below: ["primeiros usuários", "aram estranho, dep", "ossível de largar."],
  },
  {
    font: "Georgia, serif",
    weight: 700,
    above: [
      "entregam o bruto e",
      "em o corte final antes",
      "ço. Agências estão",
    ],
    before: "no ",
    after: " int",
    below: [
      "imeiros usuários achar",
      "nho, depois impossível",
      "r. A ferramenta lê cada",
    ],
  },
  {
    font: "Georgia, serif",
    weight: 700,
    above: [
      "regam o bruto e recei",
      "te final antes do almo",
      "ências estão repensan",
    ],
    before: "lo ",
    after: " ar",
    below: [
      "primeiros usuários ac",
      "ranho, depois impos",
      "gar. A ferramenta lê c",
    ],
  },
  {
    font: "'Courier New', monospace",
    weight: 700,
    above: [
      "o bruto e recebem o",
      "final antes do almoço.",
      "ncias estão repensando",
    ],
    before: "o ",
    after: " ed",
    below: [
      "imeiros usuários achara",
      "nho, depois impossível",
      ". A ferramenta lê cada",
    ],
  },
  {
    font: "Georgia, serif",
    weight: 800,
    above: [
      "bruto e recebem o corte",
      "e final antes do almoço.",
      "ncias estão repensando o",
    ],
    before: "no ",
    after: " int",
    below: [
      "primeiros usuários ach",
      "ranho, depois impossí",
      "ar. A ferramenta lê ca",
    ],
  },
];

const CUT = 6;
const INTRO = 4;

export const CorteNaPalavra: React.FC<{ word: string }> = ({ word }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const idx = Math.max(
    0,
    Math.min(SNIPPETS.length - 1, Math.floor((frame - INTRO) / CUT)),
  );
  const sn = SNIPPETS[idx];
  const local = Math.max(0, frame - INTRO - idx * CUT);

  // A tarja fica travada no centro e vai crescendo a cada corte.
  const grow = interpolate(frame, [INTRO, durationInFrames - 6], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 260 },
  });
  const tilt = ((idx % 3) - 1) * 0.8;

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 4, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    },
  );

  // Introdução: trama de pontos (halftone) antes de revelar o texto.
  if (frame < INTRO) {
    return (
      <AbsoluteFill
        style={{
          background: "#1b1618",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.55) 2px, transparent 2.5px)",
          backgroundSize: "8px 8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#c0392b",
            color: "#fff",
            fontFamily: "'Courier New', monospace",
            fontWeight: 800,
            fontSize: 150,
            padding: "0 24px",
            filter: "blur(1px)",
          }}
        >
          {word}
        </div>
      </AbsoluteFill>
    );
  }

  const lineStyle = (dist: number, i: number): React.CSSProperties => ({
    filter: `blur(${dist * 4}px)`,
    opacity: 1 - dist * 0.1,
    whiteSpace: "nowrap",
    lineHeight: 1.25,
    textAlign: "center",
    transform: `translateX(${((i * 53 + idx * 37) % 160) - 80}px)`,
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, #f7f3ea 20%, #dcd4c1 100%)",
        opacity: fadeOut,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sn.font,
        fontWeight: sn.weight,
        color: "#2b2623",
        fontSize: 150,
      }}
    >
      <div style={{ transform: `scale(${grow})`, width: "100%" }}>
        {[...sn.above].reverse().map((l, i, arr) => (
          <div key={"a" + i} style={lineStyle(arr.length - i, i)}>
            {l}
          </div>
        ))}
        <div style={{ position: "relative", height: 230, margin: "6px 0" }}>
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              whiteSpace: "nowrap",
              background: "#c0392b",
              color: "#fff",
              fontSize: 220,
              lineHeight: 1.1,
              padding: "0 36px",
              transform: `translate(-50%,-50%) scale(${interpolate(pop, [0, 1], [1.1, 1])}) rotate(${tilt}deg)`,
              boxShadow: "0 10px 0 rgba(0,0,0,.28)",
              textShadow: "0 4px 0 rgba(0,0,0,.2)",
              zIndex: 2,
            }}
          >
            {word}
          </span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              right: "50%",
              marginRight: 330,
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
              filter: "blur(1.5px)",
            }}
          >
            {sn.before}
          </span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: 330,
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
              filter: "blur(1.5px)",
            }}
          >
            {sn.after}
          </span>
        </div>
        {sn.below.map((l, i) => (
          <div key={"b" + i} style={lineStyle(i + 1, i + 5)}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
