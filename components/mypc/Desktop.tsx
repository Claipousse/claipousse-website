//the desktop of claipousseos, the icons grid, open windows, taskbar, appears when the bootscreen is done

"use client";
//more import than bonnie blue's total sexual partner in her entire life
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@/utils/navigation";
import { useDeviceTier } from "@/utils/deviceCapabilities";
import { useBackgroundMusic } from "@/utils/backgroundMusic";
import { useT } from "@/utils/traductions";
import type { Dict } from "@/utils/traductions/en";
import { LOGIN_DURATION } from "./Boot";
import { BOOT_DELAY, CLOSE_FADE_DURATION } from "@/utils/transitionTiming";
import AppWindow from "./Window";
import AboutMeWindow from "./windows/AboutMeWindow";
import VideogamesWindow from "./windows/VideogamesWindow";
import MusicWindow from "./windows/MusicWindow";
import ManganimeWindow from "./windows/ManganimeWindow";
import DrawWindow from "./windows/DrawWindow";
import ContactWindow from "./windows/ContactWindow";
import MeowlWindow from "./windows/MeowlWindow";
import TodoWindow from "./windows/TodoWindow";
import CreditsWindow from "./windows/CreditsWindow";
import HelpWindow from "./windows/HelpWindow";
import styles from "./css/Desktop.module.css";

interface DesktopIcon {
  id: string;
  labelKey: keyof Dict["mypc"]["icon"];
  Window?: () => React.ReactNode;
  width?: string;
  maxHeight?: string;
}

const ICONS: DesktopIcon[] = [ //all the icons list, responsive in vh rather than px because i found it simpler
  { id: "aboutme", labelKey: "aboutme", Window: AboutMeWindow, width: "calc(var(--icon-size) * 5)", maxHeight: "80vh" },
  { id: "game", labelKey: "videogames", Window: VideogamesWindow, width: "calc(var(--icon-size) * 5.625)", maxHeight: "72vh" },
  { id: "music", labelKey: "music", Window: MusicWindow, width: "calc(var(--icon-size) * 4.25)", maxHeight: "60vh" },
  { id: "manganime", labelKey: "manganime", Window: ManganimeWindow, width: "calc(var(--icon-size) * 5.625)", maxHeight: "72vh" },
  { id: "draw", labelKey: "draw", Window: DrawWindow, width: "calc(var(--icon-size) * 4.5)", maxHeight: "70vh" },
  { id: "contact", labelKey: "contact", Window: ContactWindow, width: "calc(var(--icon-size) * 2.8)", maxHeight: "64vh" },
  { id: "meowl", labelKey: "meowl", Window: MeowlWindow, width: "calc(var(--icon-size) * 2.25)", maxHeight: "56vh" },
  { id: "todo", labelKey: "todo", Window: TodoWindow, width: "calc(var(--icon-size) * 4.5)", maxHeight: "72vh" },
  { id: "credits", labelKey: "credits", Window: CreditsWindow, width: "calc(var(--icon-size) * 4.5)", maxHeight: "72vh" },
  { id: "help", labelKey: "help", Window: HelpWindow, width: "calc(var(--icon-size) * 3.15)", maxHeight: "72vh" }
];
const ICON_BY_ID = new Map(ICONS.map((icon) => [icon.id, icon]));
interface OpenWindow {id: string;label: string;spawnIndex: number;zIndex: number;}

// the desktop itself, and the taskbar associated
export default function Desktop() {
  const { cameraTarget, closeMyPc } = useNavigation();
  const { playing, loading, failed, toggle } = useBackgroundMusic(); //depending on if its on/off on the main menu, both are connected
  const t = useT();
  const tier = useDeviceTier();
  const mobile = tier === "mobile";
  const [visible, setVisible] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [lastMobile, setLastMobile] = useState(mobile);
  const [seenTarget, setSeenTarget] = useState(cameraTarget);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const [taskbarHeight, setTaskbarHeight] = useState(84);
  const topZ = useRef(50);
  const closing = cameraTarget === "mypc-closing";
  if (seenTarget !== cameraTarget) {
    setSeenTarget(cameraTarget);
    if (!closing && cameraTarget !== "mypc") {
      setVisible(false);
      setOpenWindows([]);
    }
  }

  // appears after the loggin screen based on its delay, empty after the black fade when shutdown
  useEffect(() => {
    if (cameraTarget === "mypc") {
      const t = setTimeout(
        () => setVisible(true),
        (BOOT_DELAY + LOGIN_DURATION) * 1000,
      );
      return () => clearTimeout(t);
    }
    if (cameraTarget === "mypc-closing") {
      const t = setTimeout(() => {
        setVisible(false);
        setOpenWindows([]);
      }, CLOSE_FADE_DURATION * 1000);
      return () => clearTimeout(t);
    }
  }, [cameraTarget]);

  //taskbar
  useEffect(() => {
    const el = taskbarRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setTaskbarHeight(el.getBoundingClientRect().height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  //in mobile, windows are fullscreen so different behaviour and we need to detect that
  if (lastMobile !== mobile) {
    setLastMobile(mobile);
    setOpenWindows([]);
  }

  const focusWindow = useCallback((id: string) => {
    topZ.current += 1;
    const z = topZ.current;
    setOpenWindows((wins) => wins.map((w) => (w.id === id ? { ...w, zIndex: z } : w)));
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((wins) => wins.filter((w) => w.id !== id));
  }, []);

  const openWindow = useCallback((id: string, label: string) => {
    // one window at a time on mobile as i said before
    if (mobile) {
      setOpenWindows([{ id, label, spawnIndex: 0, zIndex: 50 }]);
      return;
    }
    setOpenWindows((wins) => {
      //if window already opened if we click its icon again we simply put it foreground just like a real OS
      if (wins.some((w) => w.id === id)) {
        topZ.current += 1;
        const z = topZ.current;
        return wins.map((w) => (w.id === id ? { ...w, zIndex: z } : w));
      }
      topZ.current += 1;
      return [...wins, { id, label, spawnIndex: wins.length, zIndex: topZ.current }];
    });
  }, [mobile]);

  if (!visible) return null;

  //one listener for all the sound for clicking buttons, links, etc rather than everyone having their own, only closing is exception
  const playClickSfx = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a[href]")) {
      new Audio("/sound/mypc/click.mp3").play().catch(() => {});
    }
  };

  return (
    <div
      className={`${styles.desktop} ${mobile ? styles.mobile : ""} ${closing ? styles.closing : ""}`}
      onClick={playClickSfx}
    >
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      <div className={styles.iconGrid}>
        {ICONS.map(({ id, labelKey }) => {
          const label = t.mypc.icon[labelKey];
          return (
            <button
              key={id}
              type="button"
              className={styles.icon}
              onClick={() => openWindow(id, label)}
            >
              <img src={`/mypc/icons/${id}.webp`} alt="" className={styles.iconImg} draggable={false} />
              <span className={styles.iconLabel}>{label}</span>
            </button>
          );
        })}
      </div>

      {openWindows.map((w) => {
        const icon = ICON_BY_ID.get(w.id);
        const Window = icon?.Window;
        return (
          <AppWindow
            key={w.id}
            label={w.label}
            spawnIndex={w.spawnIndex}
            zIndex={w.zIndex}
            taskbarHeight={taskbarHeight}
            fullscreen={mobile}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            width={mobile ? undefined : icon?.width}
            maxHeight={mobile ? undefined : icon?.maxHeight}
          >
            {Window ? <Window /> : undefined}
          </AppWindow>
        );
      })}

      <div className={styles.taskbar} ref={taskbarRef}>
        <button
          type="button"
          className={styles.shutdown}
          onClick={(e) => {
            e.stopPropagation();
            closeMyPc();
          }}
        >
          <img src="/mypc/icons/shutdown.webp" alt="" className={styles.powerIcon} draggable={false} />
          {t.mypc.shutdown}
        </button>

        {!failed && (
          <button
            type="button"
            className={styles.music}
            onClick={toggle}
            disabled={loading}
            aria-label={playing ? "off" : "on"}
            aria-pressed={playing}
          >
            <img src="/mypc/icons/music_on.webp" alt="" className={styles.musicIcon} data-active={playing} draggable={false} />
            <img src="/mypc/icons/music_off.webp" alt="" className={styles.musicIcon} data-active={!playing} draggable={false} />
          </button>
        )}
      </div>
    </div>
  );
}