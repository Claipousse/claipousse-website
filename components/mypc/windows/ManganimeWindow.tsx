"use client";
import { useEffect, useState } from "react";
import manganimeData from "@/data/mypc/manganime.json";
import { fetchManganimeOnce, AnimeEntry, ManganimeResponse } from "../preload";
import { useT } from "@/utils/traductions";
import Carousel from "./Carousel";
import styles from "./css/ManganimeWindow.module.css";

function AnimeGrid({ entries }: { entries: AnimeEntry[] }) {
  return (
    <div className={styles.grid}>
      {entries.map((entry) => (
        <a key={entry.url} href={entry.url} target="_blank" rel="noreferrer" className={styles.gridItem}>
          <img src={entry.image} alt={entry.title} className={styles.gridImg} draggable={false} />
          <span className={styles.gridTitle}>{entry.title}</span>
        </a>
      ))}
    </div>
  );
}

export default function ManganimeWindow() {
  const t = useT();
  const [data, setData] = useState<ManganimeResponse | null>(null);
  const [error, setError] = useState(false);

  //fetchManganimeOnce share a single request with the boot screen/preloading, if it already successfull we dont do it again and we show it immediatly
  useEffect(() => {
    let cancelled = false;
    fetchManganimeOnce()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.root}>
      <section>
        <h3 className={styles.sectionTitle}>{t.manganime.favorites}</h3>
        <Carousel items={manganimeData.top10} folder="manganime" large />
      </section>
      <section>
        <h3 className={styles.sectionTitle}>{t.manganime.currentlyWatching}</h3>
        {error && <p className={styles.status}>{t.manganime.loadError}</p>}
        {!error && !data && <p className={styles.status}>{t.manganime.loading}</p>}
        {data && data.watching.length === 0 && (
          <p className={styles.status}>{t.manganime.nothingRightNow}</p>
        )}
        {data && data.watching.length > 0 && <AnimeGrid entries={data.watching} />}
      </section>
      <section>
        <h3 className={styles.sectionTitle}>{t.manganime.everythingElse}</h3>
        <p className={styles.disclaimer}>{t.manganime.disclaimer}</p>
        {!error && !data && <p className={styles.status}>{t.manganime.loading}</p>}
        {data && <AnimeGrid entries={data.rest} />}
      </section>
    </div>
  );
}