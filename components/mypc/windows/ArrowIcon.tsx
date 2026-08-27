interface ArrowIconProps {
  direction: "left" | "right"; //the arrow can be both, its for the carousel
}
//B = black (outline), W = white (transparent), then pixelated in carousel
// i wanted a pixel art one fully customised to look good, the other ones imported or only werent good for m
const PATTERN = [
  "BBBBB.......",
  "BWWWB.......",
  ".BWWWB......",
  "..BWWWB.....",
  "...BWWWB....",
  "....BWWWB...",
  ".....BWWWB..",
  "......BWWWB.",
  ".......BWWWB",
  "......BWWWB.",
  ".....BWWWB..",
  "....BWWWB...",
  "...BWWWB....",
  "..BWWWB.....",
  ".BWWWB......",
  "BWWWB.......",
  "BBBBB.......",
];

const COLS = 12;
const ROWS = PATTERN.length;

export default function ArrowIcon({ direction }: ArrowIconProps) {
  return (
    <svg width="58" height="82" viewBox={`0 0 ${COLS} ${ROWS}`} shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" style={{ transform: direction === "left" ? "scaleX(-1)" : undefined }}>
      {PATTERN.flatMap((row, y) =>
        [...row].map((cell, x) => {
          if (cell === ".") return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cell === "B" ? "#12141a" : "#f2f2f2"} />;
        })
      )}
    </svg>
  );
}