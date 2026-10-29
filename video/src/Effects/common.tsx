import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const SRC = staticFile("sample-video.mp4");

export const FullVideo: React.FC<{ scale?: number; origin?: string }> = ({
  scale = 1,
  origin = "50% 35%",
}) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <OffthreadVideo
      src={SRC}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
        transformOrigin: origin,
      }}
    />
  </AbsoluteFill>
);

export const SplitLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ background: "#e9eaec" }}>
    <div
      style={{
        position: "absolute",
        inset: "0 0 55% 0",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
    <div
      style={{ position: "absolute", inset: "45% 0 0 0", overflow: "hidden" }}
    >
      <OffthreadVideo
        src={SRC}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.15)",
        }}
      />
    </div>
  </AbsoluteFill>
);
