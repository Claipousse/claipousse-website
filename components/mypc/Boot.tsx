"use client";
//deals with the bootscreen, the animation with the user/password writing
// disappear at end of the login_duration const
import { useEffect, useState } from "react";
import { useNavigation } from "@/utils/navigation";
import { BOOT_DELAY } from "@/utils/transitionTiming";
import { useT } from "@/utils/traductions";
import { playMyPcBootSound, playMyPcShutdownSound } from "@/utils/mypcBootSound";
import styles from "./css/Boot.module.css";

const USERNAME = "guest";
const PASSWORD_LENGTH = 9; //9 chars for the password

// timing for each event, step = delay between each input
const USER_START = 0.15;
const USER_STEP = 0.125;
const PASSWORD_START = 0.95;
const PASSWORD_STEP = 0.105;

export const LOGIN_DURATION = PASSWORD_START + (PASSWORD_LENGTH + 1) * PASSWORD_STEP;

function LoginFields() {
  const t = useT();
  const [userTyped, setUserTyped] = useState(0);
  const [passwordTyped, setPasswordTyped] = useState(0);
  const [focus, setFocus] = useState<"user" | "password">("user");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (seconds: number, run: () => void) => timers.push(setTimeout(run, seconds * 1000));

    for (let i = 1; i <= USERNAME.length; i++) {
      at(USER_START + i * USER_STEP, () => setUserTyped(i));
    }
    at(PASSWORD_START, () => setFocus("password"));
    for (let i = 1; i <= PASSWORD_LENGTH; i++) {
      at(PASSWORD_START + i * PASSWORD_STEP, () => setPasswordTyped(i));
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.fields}>
      <div className={styles.field}>
        <span className={styles.label}>{t.mypc.boot.user}</span>
        <div className={styles.box}>
          <span className={styles.value}>{USERNAME.slice(0, userTyped)}</span>
          {focus === "user" && <span className={styles.cursor} />}
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>{t.mypc.boot.password}</span>
        <div className={styles.box}>
          {Array.from({ length: passwordTyped }, (_, i) => (
            <span key={i} className={styles.dot} />
          ))}
          {focus === "password" && <span className={styles.cursor} />}
        </div>
      </div>
    </div>
  );
}

// when the black fade is full we can reveal the bootscreen
export default function Boot() {
  const { cameraTarget } = useNavigation();
  const t = useT();
  const [visible, setVisible] = useState(false);

  //deals with the sfx of the bootscreen, more detail in utils/mypcBootSound.ts
  useEffect(() => {
    if (cameraTarget === "mypc") return playMyPcBootSound();
    if (cameraTarget === "mypc-closing") playMyPcShutdownSound();
  }, [cameraTarget]);

  useEffect(() => {
    if (cameraTarget === "mypc") {
      //spawn and despawn are prefixed
      const showTimer = setTimeout(() => setVisible(true), BOOT_DELAY * 1000);
      const hideTimer = setTimeout(() => setVisible(false), (BOOT_DELAY + LOGIN_DURATION) * 1000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    setVisible(false);
  }, [cameraTarget]);

  if (!visible) return null;

  return (
    <div className={styles.screen}>
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src="/mypc/icons/claipousse.webp" alt="" className={styles.icon} draggable={false} />
          <h1 className={styles.title}>{t.mypc.boot.title}</h1>
        </div>
        <LoginFields />
      </div>
    </div>
  );
}