import { continueRender, delayRender, staticFile } from "remotion";

export const CaptionFont = `Montserrat`;

let loaded = false;

export const loadFont = async (): Promise<void> => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  loaded = true;

  const fonts = [700, 800].map(
    (weight) =>
      new FontFace(
        CaptionFont,
        `url('${staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`)}') format('woff2')`,
        { weight: String(weight) },
      ),
  );

  await Promise.all(fonts.map((f) => f.load()));
  fonts.forEach((f) => document.fonts.add(f));

  continueRender(waitForFont);
};
