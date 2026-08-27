//button on/off for the music, share its state with the one on claipousse-os
//its the button in the main menu not the one on mypc

"use client";
import { useBackgroundMusic } from "@/utils/backgroundMusic";
import { useMyPcScreenShowing } from "@/utils/mypcScreen";
import { useIntro } from "@/utils/intro";
import styles from "./css/Music.module.css";

export default function Music() {
  const { playing, loading, failed, toggle } = useBackgroundMusic();
  const screenShowing = useMyPcScreenShowing(); //if on mypc we don't want it to be there
  const { entered, interactive } = useIntro();

  if (screenShowing || failed || !entered) return null;

  const label = playing ? "off" : "on";

  return (
    <button type="button" className={`${styles.root} ${interactive ? "" : styles.hidden}`} onClick={toggle} disabled={loading} aria-label={label} aria-pressed={playing} title={label}>
      <span className={`${styles.note} ${styles.on}`} data-active={playing} aria-hidden="true"/>
      <span className={`${styles.note} ${styles.off}`} data-active={!playing} aria-hidden="true"/>
    </button>
  );
}