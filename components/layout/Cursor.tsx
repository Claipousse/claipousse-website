//custom cursor : circle default and a ? on hover who spin when showing then stabilized, and also on mypc there is retro custom cursor

"use client";
import { useEffect, useRef, useState } from "react";
import { useMyPcScreenShowing } from "@/utils/mypcScreen";
import { isCoarsePointer } from "@/utils/deviceCapabilities";
import { useIntro } from "@/utils/intro";
import styles from "./css/Cursor.module.css";

export default function Cursor() {
  //before intro its the default system cursor
  const { entered, interactive } = useIntro();
  const osCursor = useMyPcScreenShowing();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coarse, setCoarse] = useState(false);
  useEffect(() => setCoarse(isCoarsePointer()), []);
  useEffect(() => {
    if (coarse || !entered) return;
    document.body.style.cursor = osCursor ? "var(--mypc-cursor-default, default)" : "none";
    return () => {
      document.body.style.cursor = "none";
    };
  }, [osCursor, coarse, entered]);

  useEffect(() => {
    if (coarse) return;
    const move = (e: MouseEvent) => {
      if (rootRef.current) {
        rootRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        if (!visible) setVisible(true);
      }
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("cursor-enter", onEnter);
    window.addEventListener("cursor-leave", onLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("cursor-enter", onEnter);
      window.removeEventListener("cursor-leave", onLeave);
    };
  }, [visible, coarse]);

  if (coarse) return null;
  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${visible && interactive && !osCursor ? styles.visible : ""} ${hovered ? styles.hovered : ""}`}
    >
      <div className={styles.circle} />
      <span className={styles.mark}>?</span>
    </div>
  );
}