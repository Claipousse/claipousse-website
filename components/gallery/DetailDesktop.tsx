
//desktop version of gallery detail of a category, polaroid grid + photo spinning to the right zoomed when clicked
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Category } from "@/utils/navigation";
import { useT } from "@/utils/traductions";
import HeaderModel from "./HeaderModel";
import styles from "./css/Detail.module.css";
import { easeInOut } from "@/utils/animation";

//idle animation of wobble for the back icon (which is the model of the category with a little <) works the same as the other animations
function useWobbleRef<T extends HTMLElement>(ampX: number, ampY: number, ampRotDeg: number = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const el = ref.current;
      if (el) {
        const x = Math.sin(t * 0.47) * ampX * 0.6 + Math.sin(t * 0.71 + 1.4) * ampX * 0.4;
        const y = Math.sin(t * 0.51 + 0.8) * ampY * 0.6 + Math.sin(t * 0.83 + 2.1) * ampY * 0.4;
        const rot = Math.sin(t * 0.37 + 1.1) * ampRotDeg * 0.6 + Math.sin(t * 0.62 + 0.3) * ampRotDeg * 0.4;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ampX, ampY, ampRotDeg]);
  return ref;
}

type Photo = { filename: string; rot: number }; //rot for rotation
type Rect = { left: number; top: number; width: number; height: number };
function toRect(r: DOMRect): Rect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

type FlightPhase = "idle" | "opening" | "open" | "closing";

// infos for the animation when clicking a photo
const FLIGHT_MS = 650;
const ARC_HEIGHT = 160;
const SPIN_TURNS = 2;
const DETAIL_ROT = -10;

// 3d tilt of the photo with the mouse
const TILT_MAX_DEG = 30;
const TILT_PERSPECTIVE = 900;
const TILT_SCALE = 1.08;
const TILT_MOVE_MS = 100; // move along with the mouse
const TILT_LEAVE_MS = 500; // slow back to no 3d tilt when mouse leave
const SCALE_MOVE_MS = 150;
const SCALE_LEAVE_MS = 150;

const GRID_SIZES = "300px";
const DETAIL_SIZES = "640px";

//proportion used to generate the frame based on the photo size
const FRAME_SIDE_RATIO = 14 / 366;
const FRAME_BOTTOM_RATIO = 52 / 366;

//lot of maths, not gonna lie made with AI on this part
function flyArc(from: Rect,to: Rect,fromRot: number,toRot: number,spinDeg: number,flyRef: React.RefObject<HTMLDivElement | null>,rafRef: React.RefObject<number | null>,onDone: () => void) {
  const start = performance.now();
  const fromCx = from.left + from.width / 2;
  const fromCy = from.top + from.height / 2;
  const toCx = to.left + to.width / 2;
  const toCy = to.top + to.height / 2;

  function frame(now: number) {
    const t = Math.min(1, (now - start) / FLIGHT_MS);
    const e = easeInOut(t);
    const cx = fromCx + (toCx - fromCx) * e;
    const cy = fromCy + (toCy - fromCy) * e - Math.sin(Math.PI * t) * ARC_HEIGHT;
    const w = from.width + (to.width - from.width) * e;
    const h = from.height + (to.height - from.height) * e;
    const rot = fromRot + (toRot - fromRot + spinDeg) * e;

    const el = flyRef.current;
    if (el) {
      el.style.left = `${cx - w / 2}px`;
      el.style.top = `${cy - h / 2}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      const side = h * FRAME_SIDE_RATIO;
      el.style.padding = `${side}px ${side}px ${h * FRAME_BOTTOM_RATIO}px`;
      el.style.transform = `rotate(${rot}deg)`;
    }

    if (t < 1) {
      rafRef.current = requestAnimationFrame(frame);
    } else {
      rafRef.current = null;
      onDone();
    }
  }
  rafRef.current = requestAnimationFrame(frame);
}

type Props = {
  category: Category;
  folder: string;
  photos: Photo[];
  onClose: () => void;
};

export default function DetailDesktop({ category, folder, photos, onClose }: Props) {
  const t = useT();
  const arrowRef = useWobbleRef<HTMLSpanElement>(10, 12, 3);

  const [selected, setSelected] = useState<Photo | null>(null);
  const [phase, setPhase] = useState<FlightPhase>("idle");

  const gridImgRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const detailSlotRef = useRef<HTMLDivElement>(null);
  const detailImgRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const backHoveredRef = useRef(false);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);
  useEffect(() => () => {
    if (backHoveredRef.current) window.dispatchEvent(new Event("cursor-leave"));
  }, []);

  const handleBackEnter = () => {
    backHoveredRef.current = true;
    window.dispatchEvent(new Event("cursor-enter"));
  };

  const handleBackLeave = () => {
    backHoveredRef.current = false;
    window.dispatchEvent(new Event("cursor-leave"));
  };

  const handlePhotoClick = (photo: Photo) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "idle") return;
    const gridRect = e.currentTarget.getBoundingClientRect();
    const slotRect = detailSlotRef.current?.getBoundingClientRect();
    if (!slotRect) return;

    const from = toRect(gridRect);
    const to: Rect = {
      left: slotRect.left - window.innerWidth,
      top: slotRect.top,
      width: slotRect.width,
      height: slotRect.height,
    };

    setSelected(photo);
    setPhase("opening");
    flyArc(from, to, photo.rot, DETAIL_ROT, SPIN_TURNS * 360, flyRef, rafRef, () => setPhase("open"));
  };

  const handleDetailClick = () => {
    if (phase !== "open" || !selected) return;
    const detailRect = detailImgRef.current?.getBoundingClientRect();
    const gridRect = gridImgRefs.current[selected.filename]?.getBoundingClientRect();
    if (!detailRect || !gridRect) return;

    const from = toRect(detailRect);
    const to: Rect = {
      left: gridRect.left + window.innerWidth,
      top: gridRect.top,
      width: gridRect.width,
      height: gridRect.height,
    };

    setPhase("closing");
    flyArc(from, to, DETAIL_ROT, selected.rot, -SPIN_TURNS * 360, flyRef, rafRef, () => {
      setPhase("idle");
      setSelected(null);
    });
  };

  const handleDetailMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const tiltEl = tiltRef.current;
    const scaleEl = scaleRef.current;
    if (!tiltEl || !scaleEl) return;
    const rect = tiltEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = -py * TILT_MAX_DEG;
    const tiltY = px * TILT_MAX_DEG;
    tiltEl.style.transition = `transform ${TILT_MOVE_MS}ms ease-out`;
    tiltEl.style.transform = `rotate(${DETAIL_ROT}deg) perspective(${TILT_PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    scaleEl.style.transition = `transform ${SCALE_MOVE_MS}ms ease-out`;
    scaleEl.style.transform = `scale(${TILT_SCALE})`;
  };

  const handleDetailMouseLeave = () => {
    const tiltEl = tiltRef.current;
    const scaleEl = scaleRef.current;
    if (!tiltEl || !scaleEl) return;
    tiltEl.style.transition = `transform ${TILT_LEAVE_MS}ms ease-out`;
    tiltEl.style.transform = `rotate(${DETAIL_ROT}deg)`;
    scaleEl.style.transition = `transform ${SCALE_LEAVE_MS}ms ease-out`;
    scaleEl.style.transform = `scale(1)`;
  };

  const panned = phase === "opening" || phase === "open";
  const flying = phase === "opening" || phase === "closing";

  return (
    <>
      <div className={`${styles.stage} ${panned ? styles.panned : ""}`}>
        <div className={styles.gridPaneWrap}>
          <div className={`${styles.gridPane} ${phase !== "idle" ? styles.scrollbarHidden : ""}`}>
            <div className={styles.header}>
              <button className={styles.back} onClick={onClose} onMouseEnter={handleBackEnter} onMouseLeave={handleBackLeave} aria-label={t.gallery.back}>
                <span ref={arrowRef} className={styles.arrowWobble}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5 L7.5 12 L15 19" stroke="#5136f0" strokeWidth="8.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 5 L7.5 12 L15 19" stroke="white" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.title} role="img" aria-label={t.gallery.category[category]}>
                  <HeaderModel category={category} />
                </span>
              </button>
            </div>
            <div className={styles.grid}>
              {photos.map((photo) => (
                <div key={photo.filename} ref={(el) => { gridImgRefs.current[photo.filename] = el; }} className={styles.polaroid} style={{ "--rot": `${photo.rot}deg`, opacity: selected?.filename === photo.filename ? 0 : 1 } as React.CSSProperties} onClick={handlePhotoClick(photo)}>
                  <Image src={`/gallery/${folder}/${photo.filename}`} alt="photo" width={300} height={300} sizes={GRID_SIZES} className={styles.img} draggable={false}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.detailPane}>
          <div ref={detailSlotRef} className={styles.detailSlot}>
            {phase === "open" && selected && (
              <div ref={detailImgRef} className={styles.detailImgHit} onClick={handleDetailClick} onMouseMove={handleDetailMouseMove} onMouseLeave={handleDetailMouseLeave}>
                <div ref={tiltRef} className={styles.detailTiltLayer} style={{ transform: `rotate(${DETAIL_ROT}deg)` }}>
                  <div ref={scaleRef} className={styles.detailImgWrap}>
                    <Image src={`/gallery/${folder}/${selected.filename}`} alt="photo" width={640} height={640} sizes={DETAIL_SIZES} className={styles.detailImg} draggable={false} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {flying && selected && (
        <div ref={flyRef} className={styles.flyingWrap}>
          <Image src={`/gallery/${folder}/${selected.filename}`} alt="photo" width={640} height={640} sizes={DETAIL_SIZES} className={styles.flyingImg} draggable={false} />
        </div>
      )}
    </>
  );
}