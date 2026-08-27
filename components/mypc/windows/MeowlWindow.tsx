"use client";
import { useEffect, useRef } from "react";
import styles from "./css/MeowlWindow.module.css";

export default function MeowlWindow() {
  const audioRef = useRef<HTMLAudioElement>(null);
  // since we need to click to open a window and so play a song there is no need to worry about autoplay
  useEffect(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className={styles.root}>
      <img src="/mypc/meowl/meowl.webp" alt="meowl" width={640} height={872} className={styles.img} draggable={false} />
      <audio ref={audioRef} src="/mypc/meowl/meowl.mp3" loop />
    </div>
  );
}
//i'm a new soul came into this strange world hopping to learn about give & take meowl i love you i love you i love you so much meowl pls be real pls