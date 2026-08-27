"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./css/DrawWindow.module.css";

const CANVAS_RES = 96; //canva true res
const PREVIEW_RES = 18; //preview of brush at right
const MAX_HISTORY = 20; //maximum of actions stored by the back

const COLORS = [
  "#12141a",
  "#f2f2f2",
  "#8a8a8a",
  "#7a4b2a",
  "#e5484d",
  "#f3883e",
  "#f5d90a",
  "#4caf50",
  "#14b8a6",
  "#38bdf8",
  "#2563eb",
  "#7c3aed",
  "#ec4899",
  "#f4a26a",
  "#86e3ce",
  "#a5b4fc",
];

//differents sizes of the pencil
const RADII = [0.7, 1, 2, 3.5, 5];
const DEFAULT_SIZE_INDEX = 2;

interface Point {
  x: number;
  y: number;
}

//stamps a filled circle on the canva pixel by pixel for the brush tip
function stampPixelCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string) {
  const cxI = Math.round(cx);
  const cyI = Math.round(cy);
  const bound = Math.ceil(radius);
  const radiusSq = radius * radius;
  ctx.fillStyle = color;
  for (let x = -bound; x <= bound; x++) {
    for (let y = -bound; y <= bound; y++) {
      if (x * x + y * y <= radiusSq) {
        ctx.fillRect(cxI + x, cyI + y, 1, 1);
      }
    }
  }
}

// fill the holes made if the mouse is moved really fast when you draw
function stampPixelLine(ctx: CanvasRenderingContext2D, from: Point, to: Point, radius: number, color: string) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.max(Math.abs(dx), Math.abs(dy));
  const steps = Math.max(1, Math.ceil(dist / Math.max(1, radius / 2)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    stampPixelCircle(ctx, from.x + dx * t, from.y + dy * t, radius, color);
  }
}

//all the draw windows behaviour and whats at the right (color, size, rubber, undo, clear, ...)
export default function DrawWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  const [color, setColor] = useState(COLORS[0]);
  const [sizeIndex, setSizeIndex] = useState(DEFAULT_SIZE_INDEX);
  const [erasing, setErasing] = useState(false);

  // the rubber simply draw white cause the background is by default white, it doesnt erase whatever
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxRef.current = ctx;
  }, []);

  const strokeColor = erasing ? "#ffffff" : color;

  //the preview of the rubber have a lil black outline to still be visible (because white on white is not pretty visible try at home)
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = canvas.width / 2;
    stampPixelCircle(ctx, c, c, RADII[sizeIndex] + 1, "#12141a");
    stampPixelCircle(ctx, c, c, RADII[sizeIndex], strokeColor);
  }, [sizeIndex, strokeColor]);

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
  }, []);
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // one cancel = one entire movement erased not just a frame of movement or whatever
    pushHistory();
    drawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;
    stampPixelCircle(ctx, point.x, point.y, RADII[sizeIndex], strokeColor);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    const last = lastPointRef.current;
    if (!ctx || !last) return;
    const point = getPoint(e);
    stampPixelLine(ctx, last, point, RADII[sizeIndex], strokeColor);
    lastPointRef.current = point;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleUndo = () => {
    const ctx = ctxRef.current;
    const prev = historyRef.current.pop();
    if (ctx && prev) ctx.putImageData(prev, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    pushHistory();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const changeSize = (delta: number) => {
    setSizeIndex((i) => Math.min(RADII.length - 1, Math.max(0, i + delta)));
  };

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} width={CANVAS_RES} height={CANVAS_RES} className={styles.canvas} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} />

      <div className={styles.sidebar}>
        <div className={styles.palette}>
          {COLORS.map((c) => (
            <button key={c} type="button" className={`${styles.swatch} ${!erasing && c === color ? styles.swatchSelected : ""}`} style={{ background: c }} aria-label={c} onClick={() => { setColor(c); setErasing(false); }} />
          ))}
        </div>

        <div className={styles.sizePicker}>
          <button type="button" className={styles.sizeArrow} onClick={() => changeSize(-1)} disabled={sizeIndex === 0} aria-label="smaller">&lt;</button>
          <div className={styles.sizePreview}>
            <canvas ref={previewCanvasRef} width={PREVIEW_RES} height={PREVIEW_RES} className={styles.sizeDot} />
          </div>
          <button type="button" className={styles.sizeArrow} onClick={() => changeSize(1)} disabled={sizeIndex === RADII.length - 1} aria-label="bigger">&gt;</button>
        </div>

        <div className={styles.tools}>
          <button type="button" className={`${styles.toolButton} ${erasing ? styles.toolButtonActive : ""}`} onClick={() => setErasing((v) => !v)} aria-label="eraser">
            <img src="/mypc/draw/eraser.gif" alt="" className={`${styles.toolIcon} ${styles.toolIconEraser}`} draggable={false} />
          </button>
          <button type="button" className={styles.toolButton} onClick={handleUndo} aria-label="undo">
            <img src="/mypc/draw/undo.gif" alt="" className={`${styles.toolIcon} ${styles.toolIconUndo}`} draggable={false} />
          </button>
          <button type="button" className={styles.toolButton} onClick={handleClear} aria-label="clear">
            <img src="/mypc/draw/destroy.gif" alt="" className={`${styles.toolIcon} ${styles.toolIconClear}`} draggable={false} />
          </button>
        </div>
      </div>
    </div>
  );
}