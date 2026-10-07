import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionFont } from "../load-font";

// Brand palette: white text, turquoise gradient for highlighted words
const TURQUOISE_TOP = "#36B3C6";
const TURQUOISE_BOTTOM = "#82E3EC";

const NORMAL_FONT_SIZE = 66;
const HIGHLIGHT_FONT_SIZE = 124;

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 480,
  height: 300,
  paddingLeft: 60,
  paddingRight: 60,
};

const textShadow = "0 4px 18px rgba(0, 0, 0, 0.45)";

const normalize = (word: string) =>
  word
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, "");

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
  readonly highlights: string[];
}> = ({ enterProgress, page, highlights }) => {
  const highlightSet = new Set(highlights.map(normalize));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  // Words appear one at a time as they are spoken. Words not yet spoken are
  // laid out but invisible, so the line doesn't shift when they appear.
  const wordStyle = (fromMs: number): React.CSSProperties => {
    const msSinceStart = timeInMs - (fromMs - page.startMs);
    const progress = interpolate(msSinceStart, [0, 120], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      opacity: progress,
      transform: makeTransform([
        scale(interpolate(progress, [0, 1], [0.85, 1])),
      ]),
    };
  };

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontFamily: CaptionFont,
          fontWeight: 700,
          fontSize: NORMAL_FONT_SIZE,
          lineHeight: 1.05,
          color: "white",
          textAlign: "center",
          textShadow,
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.85, 1])),
            translateY(interpolate(enterProgress, [0, 1], [30, 0])),
          ]),
        }}
      >
        {page.tokens.map((t, index) => {
          const isHighlight = highlightSet.has(normalize(t.text));
          if (!isHighlight) {
            return (
              <span
                key={`${t.fromMs}-${index}`}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  ...wordStyle(t.fromMs),
                }}
              >
                {t.text}
              </span>
            );
          }

          // Highlighted word sits on its own line, bigger, with the turquoise gradient
          return (
            <span
              key={`${t.fromMs}-${index}`}
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: HIGHLIGHT_FONT_SIZE,
                lineHeight: 1,
                letterSpacing: -2,
                backgroundImage: `linear-gradient(180deg, ${TURQUOISE_TOP}, ${TURQUOISE_BOTTOM})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "none",
                filter: `drop-shadow(0 0 14px rgba(54, 179, 198, 0.55)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))`,
                ...wordStyle(t.fromMs),
              }}
            >
              {t.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
