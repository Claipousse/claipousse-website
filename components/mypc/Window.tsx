"use client";

/*
 * A claipousse-os window: draggable titlebar, close button, and a fully
 * DOM-driven retro scrollbar. On mobile it goes fullscreen and is no
 * longer draggable.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isSfxOn } from "@/utils/sfx";
import styles from "./css/Window.module.css";

const EDGE_MARGIN = 8;
// each new window steps down-right from the centered spawn point, wrapping
// after CASCADE_MAX so it never drifts off-screen
const CASCADE_STEP = 32;
const CASCADE_MAX = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

interface AppWindowProps {
  label: string;
  spawnIndex: number;
  zIndex: number;
  // measured by Desktop: the taskbar is fluid, so it can't be assumed
  taskbarHeight: number;
  onClose: () => void;
  onFocus: () => void;
  children?: React.ReactNode;
  width?: string;
  maxHeight?: string;
  fullscreen?: boolean;
}

export default function Window({
  label,
  spawnIndex,
  zIndex,
  taskbarHeight,
  onClose,
  onFocus,
  children,
  width,
  maxHeight,
  fullscreen,
}: AppWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  // gates the re-center below to before the user has touched the window
  const draggedRef = useRef(false);

  // the ResizeObserver below is mounted once on purpose (re-creating it
  // resets its first-firing re-center and makes windows jump), so it reads
  // the height from a ref rather than closing over a stale one
  const taskbarHeightRef = useRef(taskbarHeight);
  useEffect(() => {
    taskbarHeightRef.current = taskbarHeight;
  }, [taskbarHeight]);

  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // chromium ignores ::-webkit-scrollbar-* sizing once scrollbar-color is
  // set, so the retro scrollbar is a real DOM thumb synced to scroll position
  useEffect(() => {
    const el = contentRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el || !thumb || !track) return;

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = el!;
      // +1 tolerance: a subpixel rounding would otherwise be enough to show
      // the bar on content that actually fits on screen
      if (scrollHeight <= clientHeight + 1) {
        track!.style.display = "none";
        return;
      }
      track!.style.display = "block";
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(40, clientHeight * ratio);
      const maxTop = clientHeight - thumbHeight;
      const maxScroll = scrollHeight - clientHeight;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0;
      thumb!.style.height = `${thumbHeight}px`;
      thumb!.style.transform = `translateY(${top}px)`;
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  // dragging the scrollbar thumb: mouse movement is converted into scroll
  // movement, based on measurements taken at the moment of the click
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = contentRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;

    const startY = e.clientY;
    const startScrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;
    const maxScroll = el.scrollHeight - clientHeight;
    const maxTop = clientHeight - thumb.getBoundingClientRect().height;

    function onMove(ev: MouseEvent) {
      const deltaScroll = maxTop > 0 ? ((ev.clientY - startY) / maxTop) * maxScroll : 0;
      el!.scrollTop = Math.min(maxScroll, Math.max(0, startScrollTop + deltaScroll));
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // shared by the synchronous measurement below and the ResizeObserver's
  // first firing, which sometimes has to redo this exact math
  function centeredPos(rect: { width: number; height: number }) {
    const step = spawnIndex % CASCADE_MAX;
    const offset = step * CASCADE_STEP;
    const maxX = window.innerWidth - rect.width - EDGE_MARGIN;
    const maxY = window.innerHeight - taskbarHeightRef.current - rect.height - EDGE_MARGIN;
    return {
      // whole pixels: a fractional offset lands the titlebar and content a
      // subpixel apart, leaving a hairline gap between them
      x: Math.round(clamp((window.innerWidth - rect.width) / 2 + offset, EDGE_MARGIN, maxX)),
      y: Math.round(clamp((window.innerHeight - taskbarHeightRef.current - rect.height) / 2 + offset, EDGE_MARGIN, maxY)),
    };
  }

  // measured before paint so the window never flashes at (0,0) first
  useLayoutEffect(() => {
    if (fullscreen) return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(centeredPos(rect));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Content sized asynchronously (meowl is one tall image sized off
  // max-height) is still mid-layout at the measurement above, so the window
  // centers on a phantom height then grows past it. The observer's first
  // firing always reports the settled size, so redo the centering against
  // that rather than clamping a stale position. First firing only, and only
  // if the window hasn't been grabbed — later resizes re-clamp, so a window
  // the user dragged never jumps back to center under them.
  useEffect(() => {
    if (fullscreen) return;
    const el = windowRef.current;
    if (!el) return;
    let first = true;
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      if (first) {
        first = false;
        if (!draggedRef.current) {
          setPos(centeredPos(rect));
          return;
        }
      }
      const maxX = window.innerWidth - rect.width - EDGE_MARGIN;
      const maxY = window.innerHeight - taskbarHeightRef.current - rect.height - EDGE_MARGIN;
      setPos((prev) => ({
        x: Math.round(clamp(prev.x, EDGE_MARGIN, maxX)),
        y: Math.round(clamp(prev.y, EDGE_MARGIN, maxY)),
      }));
    });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    onFocus();
    draggedRef.current = true;
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    // pointer capture keeps events on the titlebar if the cursor leaves it
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const rect = windowRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 0;
    const h = rect?.height ?? 0;
    const maxX = window.innerWidth - w - EDGE_MARGIN;
    const maxY = window.innerHeight - taskbarHeightRef.current - h - EDGE_MARGIN;
    setPos({
      x: Math.round(clamp(e.clientX - drag.offsetX, EDGE_MARGIN, maxX)),
      y: Math.round(clamp(e.clientY - drag.offsetY, EDGE_MARGIN, maxY)),
    });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const dragHandlers = fullscreen
    ? {}
    : {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
      };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${fullscreen ? styles.fullscreen : ""}`}
      style={
        fullscreen
          ? { zIndex }
          : {
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              zIndex,
              ...(width ? { width } : {}),
              ...(maxHeight ? { maxHeight } : {}),
            }
      }
      onMouseDown={onFocus}
    >
      <div className={styles.titlebar} {...dragHandlers}>
        <span className={styles.title}>{label}</span>
        <button
          type="button"
          className={styles.close}
          onClick={(e) => {
            e.stopPropagation();
            if (isSfxOn()) new Audio("/sound/mypc/click.mp3").play().catch(() => {});
            onClose();
          }}
        >
          X
        </button>
      </div>
      <div className={styles.contentArea}>
        <div className={styles.content} ref={contentRef}>
          {children ?? <span className={styles.placeholder}>naviguez, ya rien à voir.</span>}
        </div>
        <div ref={trackRef} className={styles.scrollTrack}>
          <div ref={thumbRef} className={styles.scrollThumb} onMouseDown={handleThumbMouseDown} />
        </div>
      </div>
    </div>
  );
}
