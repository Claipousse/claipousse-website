//settings button (top-right of the main menu, replaces the old standalone music button) opening a centered modal with music/sfx/language toggles

"use client";
import { useEffect, useState } from "react";
import { useBackgroundMusic } from "@/utils/backgroundMusic";
import { useSfx } from "@/utils/sfx";
import { useLocale, useT } from "@/utils/traductions";
import { useMyPcScreenShowing } from "@/utils/mypcScreen";
import { useIntro } from "@/utils/intro";
import { preloadSettingsIcons } from "./settingsPreload";
import styles from "./css/Settings.module.css";

export default function Settings() {
  const { playing, failed, toggle: toggleMusic } = useBackgroundMusic();
  const { on: sfxOn, toggle: toggleSfx } = useSfx();
  const { locale, setLocale } = useLocale();
  const t = useT();
  const screenShowing = useMyPcScreenShowing(); //if on mypc we don't want it to be there
  const { entered, interactive } = useIntro();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (interactive) preloadSettingsIcons();
  }, [interactive]);

  if (screenShowing || !entered) return null;

  const handleClose = () => setClosing(true);
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (closing) {
      setClosing(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${interactive ? "" : styles.hidden}`}
        onClick={() => setOpen(true)}
        aria-label="settings"
      >
        <span className={`${styles.icon} ${styles.settings}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          className={`${styles.overlay} ${closing ? styles.closing : ""}`}
          onClick={handleClose}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={toggleMusic}
              disabled={failed}
              aria-pressed={playing}
            >
              <span className={`${styles.iconWrap} ${styles.music}`}>
                <span className={`${styles.icon} ${styles.toggle} ${styles.musicOn}`} data-active={playing} />
                <span className={`${styles.icon} ${styles.toggle} ${styles.musicOff}`} data-active={!playing} />
              </span>
              <span className={styles.label}>{t.settings.music}</span>
            </button>
            <button type="button" className={styles.row} onClick={toggleSfx} aria-pressed={sfxOn}>
              <span className={`${styles.iconWrap} ${styles.sound}`}>
                <span className={`${styles.icon} ${styles.toggle} ${styles.soundOn}`} data-active={sfxOn} />
                <span className={`${styles.icon} ${styles.toggle} ${styles.soundOff}`} data-active={!sfxOn} />
              </span>
              <span className={styles.label}>{t.settings.sfx}</span>
            </button>
            <button type="button" className={styles.row} onClick={() => setLocale(locale === "fr" ? "en" : "fr")}>
              <span className={`${styles.iconWrap} ${styles.flag}`}>
                <span className={`${styles.icon} ${styles.toggle} ${styles.langFr}`} data-active={locale === "fr"} />
                <span className={`${styles.icon} ${styles.toggle} ${styles.langEn}`} data-active={locale === "en"} />
              </span>
              <span className={styles.label}>{t.settings.language}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
