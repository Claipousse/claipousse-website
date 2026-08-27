//the banner who shows up after the intro on mobile warning the pc version is much better
//next time i do a website i fucking do a mobile first development

"use client";
import { useEffect, useState } from "react";
import { useIntro } from "@/utils/intro";
import { useDeviceTier } from "@/utils/deviceCapabilities";
import { MUSIC_ICON_DELAY } from "@/utils/introTiming";
import { useT } from "@/utils/traductions";
import styles from "./css/WarningMobile.module.css";

export default function WarningMobile() {
  const { entered } = useIntro();
  const t = useT();
  const tier = useDeviceTier();
  const [revealed, setRevealed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setRevealed(true), MUSIC_ICON_DELAY * 1000); //only showed after the intro
    return () => clearTimeout(t);
  }, [entered]);

  if (tier !== "mobile" || dismissed || !entered) return null; //if not on mobile or we said ok or we havent entered wet we dont show

  return (
    <div className={`${styles.root} ${revealed ? "" : styles.hidden}`} role="status">
      <div className={styles.text}>
        <p className={styles.title}>{t.mobilewarning.title}</p>
        <p className={styles.body}>{t.mobilewarning.body}</p>
      </div>
      <button type="button" className={styles.button} onClick={() => setDismissed(true)}>
        {t.mobilewarning.button}
      </button>
    </div>
  );
}