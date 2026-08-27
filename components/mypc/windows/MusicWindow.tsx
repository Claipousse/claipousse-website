"use client";
import musicData from "@/data/mypc/music.json";
import { useT } from "@/utils/traductions";
import styles from "./css/MusicWindow.module.css";

export default function MusicWindow() {
  const t = useT();
  return (
    <div className={styles.root}>
      <section>
        <h3 className={styles.sectionTitle}>{t.music.albums}</h3>
        <div className={styles.grid}>
          {musicData.albums.map((album) => (
            <div key={album.filename} className={styles.gridItem}>
              <img src={`/mypc/music/${album.filename}`} alt={album.title} className={styles.gridImg} draggable={false} />
              <span className={styles.gridTitle}>{album.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}