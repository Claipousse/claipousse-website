"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/utils/traductions";
import styles from "./css/AboutMeWindow.module.css";

const SPIN_DURATION = 1500;
const SPIN_COOLDOWN = 1000; //1sec cooldown between each spin

export default function AboutMeWindow() {
  const t = useT();
  const FACTS = [t.aboutme.fact1, t.aboutme.fact2, t.aboutme.fact3];
  const HOBBIES = [
    t.aboutme.hobby1,
    t.aboutme.hobby2,
    t.aboutme.hobby3,
    t.aboutme.hobby4,
    t.aboutme.hobby5,
    t.aboutme.hobby6,
  ];
  const [spinning, setSpinning] = useState(false);
  const locked = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  //we dont want the spin sfx & click sfx to be played together, only spin.sfx, so we stop the click propagation for this case
  const spin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (locked.current) return;
    locked.current = true;
    setSpinning(true);
    new Audio("/mypc/aboutme/click.mp3").play().catch(() => {});
    timers.current = [
      window.setTimeout(() => setSpinning(false), SPIN_DURATION),
      window.setTimeout(() => {
        locked.current = false;
      }, SPIN_DURATION + SPIN_COOLDOWN),
    ];
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.photoSlot}>
          <button type="button" className={`${styles.photo} ${spinning ? styles.spinning : ""}`} onClick={spin} aria-label="spin">
            <span className={styles.photoBar} aria-hidden="true">
              <span>me.jpg</span>
              <span>X</span>
            </span>
            <img src="/mypc/aboutme/me.webp" alt="claipousse" draggable={false} />
          </button>
        </div>
        <div className={styles.identity}>
          <h3 className={styles.name}>
            <span>{t.aboutme.name.line1}</span>
            <span>{t.aboutme.name.line2}</span>
          </h3>
        </div>
      </div>
      <hr className={styles.divider} />
      <p className={styles.text}>{t.aboutme.intro}</p>
      <ul className={styles.list}>{FACTS.map((fact) => (
          <li key={fact}>{fact}</li>))}
      </ul>
      <h4 className={styles.sectionTitle}>{t.aboutme.hobbiesTitle}</h4>
      <ul className={styles.list}>{HOBBIES.map((hobby) => (
          <li key={hobby}>{hobby}</li>))}
      </ul>
      <h4 className={styles.sectionTitle}>{t.aboutme.languagesTitle}</h4>
      <p className={`${styles.text} ${styles.sectionText}`}>{t.aboutme.languagesText}</p>
    </div>
  );
}