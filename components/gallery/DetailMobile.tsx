//mobile version of a full section detail on gallery
//notice how its way smaller in code than desktop because there is not the mega spinning animation with the 3d tilt and all that shit its just a classic zoom with black background

"use client";
import { useState } from "react";
import Image from "next/image";
import { useT } from "@/utils/traductions";
import styles from "./css/Detail.module.css";

type Photo = { filename: string; rot: number };

type Props = {
  title: string;
  folder: string;
  photos: Photo[];
  onClose: () => void;
};

export default function DetailMobile({ title, folder, photos, onClose }: Props) {
  const t = useT();
  const [opened, setOpened] = useState<Photo | null>(null);

  return (
    <>
      <div className={styles.mobilePane}>
        <div className={styles.mobileHeader}>
          <button className={styles.mobileBack} onClick={onClose} aria-label={t.gallery.back}>
            <span className={styles.mobileBackArrow}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5 L7 12 L15 19" stroke="#5136f0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 5 L7 12 L15 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={styles.mobileTitle}>{title}</span>
          </button>
        </div>
        <div className={styles.mobileGrid}>
          {photos.map((photo, i) => (
            <div key={photo.filename} className={styles.mobilePolaroid} style={{ "--rot": `${photo.rot}deg` } as React.CSSProperties} onClick={() => setOpened(photo)}>
              <Image src={`/gallery/${folder}/${photo.filename}`} alt="photo" width={300} height={300} sizes="46vw" loading={i < 4 ? "eager" : "lazy"} className={styles.mobileImg} draggable={false} />
            </div>
          ))}
        </div>
      </div>
      {opened && (
        <div className={styles.mobileDetail} onClick={() => setOpened(null)}>
          <Image src={`/gallery/${folder}/${opened.filename}`} alt="photo" width={640} height={640} sizes="88vw" loading="eager" className={styles.mobileDetailImg} draggable={false} />
        </div>
      )}
    </>
  );
}