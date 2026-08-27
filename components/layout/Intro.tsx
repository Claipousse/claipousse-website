//visual of the intro with the white screen with the text and the bubble who expand on click revealing the scene
"use client";
import { useCallback, useRef, useState } from "react";
import { useIntro } from "@/utils/intro";
import { useBackgroundMusic } from "@/utils/backgroundMusic";
import { isCoarsePointer } from "@/utils/deviceCapabilities";
import { BUBBLE_DURATION } from "@/utils/introTiming";
import { useT } from "@/utils/traductions";
import styles from "./css/Intro.module.css";

const easeOut = (t: number) => 1 - (1 - t) ** 3;

//with mobile, the bubble open where we touched it, but on desktop on the center
//i decided it this way because since the screen is much larger on desktop but the speed of revealing is the same if i clicked on a corner we could have animation masked by the white screen still here on the opposite corner
function originOf(e: React.MouseEvent) {
  if (e.detail !== 0 && isCoarsePointer()) return { x: e.clientX, y: e.clientY };
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export default function Intro() {
  const { entered, enter } = useIntro();
  const { enterFromGate } = useBackgroundMusic();
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (entered) return;

      enterFromGate();

      const root = rootRef.current;
      if (!root) {
        enter();
        setGone(true);
        return;
      }
      const { x, y } = originOf(e);
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--x", `${x}px`);
      root.style.setProperty("--y", `${y}px`);
      enter();
      const started = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / (BUBBLE_DURATION * 1000));
        root.style.setProperty("--r", `${radius * easeOut(t)}px`);
        if (t < 1) requestAnimationFrame(step);
        else setGone(true);
      };
      requestAnimationFrame(step);
    },
    [entered, enter, enterFromGate],
  );

  if (gone) return null;

  return (
    <div ref={rootRef} className={`${styles.root} ${entered ? styles.opening : ""}`} onClick={handleClick}>
      {!entered && (
        <p className={styles.message}>
          {t.entergate.prefix}{" "}
          <span className={styles.fine}>{t.entergate.verbFine}</span>
          <span className={styles.coarse}>{t.entergate.verbCoarse}</span> {t.entergate.suffix}
        </p>
      )}
    </div>
  );
}