"use client";
import { useEffect, useState } from "react";
import { useT } from "@/utils/traductions";
import styles from "./css/ContactWindow.module.css";

const FACE_FRAMES = ["/mypc/contact/frame1.gif", "/mypc/contact/frame2.gif"];
const FACE_SWITCH_INTERVAL = 1000; //2frame animation cycle, 1sec between each frame change

export default function ContactWindow() {
  const t = useT();
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFaceIndex((i) => (i + 1) % FACE_FRAMES.length);
    }, FACE_SWITCH_INTERVAL);
    return () => clearInterval(id);
  }, []);
  const isFrame1 = faceIndex === 0;

  return (
    <div className={styles.root}>
      <div className={styles.illustration}>
        <img src="/mypc/contact/mail.gif" alt="" className={`${styles.mail} ${isFrame1 ? styles.tiltLeft : styles.tiltRight}`} draggable={false}/>
        <img src={FACE_FRAMES[faceIndex]} alt="" className={`${styles.face} ${isFrame1 ? styles.tiltRight : styles.tiltLeft}`} draggable={false}/>
      </div>
      <a href="mailto:contact@claipousse.fr" className={styles.mailLink}>
        contact@claipousse.fr
      </a>
      <p className={styles.text}>{t.contact.text}</p>
    </div>
  );
}