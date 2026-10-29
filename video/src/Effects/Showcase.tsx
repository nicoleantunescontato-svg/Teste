import { Series } from "remotion";
import { loadFont } from "../load-font";
import { ChuvaDeParticulas } from "./ChuvaDeParticulas";
import { CliqueDeFotos } from "./CliqueDeFotos";
import { CorteNaPalavra } from "./CorteNaPalavra";
import { GraficoDeVidro } from "./GraficoDeVidro";
import { LetreiroDigital } from "./LetreiroDigital";
import { ZoomSobreOOmbro } from "./ZoomSobreOOmbro";

export const Showcase: React.FC = () => {
  loadFont();
  return (
    <Series>
      <Series.Sequence durationInFrames={60}>
        <CorteNaPalavra word="Claude" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <CliqueDeFotos />
      </Series.Sequence>
      <Series.Sequence durationInFrames={75}>
        <LetreiroDigital
          words={["Cada", "efeito", "foi", "feito", "com", "um", "prompt."]}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={75}>
        <GraficoDeVidro value={376} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <ChuvaDeParticulas caption="com apenas um prompt" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={75}>
        <ZoomSobreOOmbro
          value="697 mil"
          label="OUTUBRO"
          sub="views em 3 dias"
        />
      </Series.Sequence>
    </Series>
  );
};
