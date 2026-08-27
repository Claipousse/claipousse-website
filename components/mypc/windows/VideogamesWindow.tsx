"use client";
import videogamesData from "@/data/mypc/videogames.json";
import { useT } from "@/utils/traductions";
import Carousel from "./Carousel";
import styles from "./css/VideogamesWindow.module.css";

// description depend of the language used unlike titles of games, only those 2 have it because didn't have inspiration for the others
const DESCRIPTION_OVERRIDE = (t: ReturnType<typeof useT>): Record<string, string> => ({
  "Persona 4 Golden": t.videogames.descriptionP4G,
  "League of Legends": t.videogames.descriptionLol
});

export default function VideogamesWindow() {
  const t = useT();
  const overrides = DESCRIPTION_OVERRIDE(t);
  const currentlyPlaying = videogamesData.currently_playing.map((game) => ({
    ...game, //spread ope
    description: overrides[game.title] || game.description,
  }));
  return (
    <div className={styles.root}>
      <section>
        <h3 className={styles.sectionTitle}>{t.videogames.favorites}</h3>
        <Carousel items={videogamesData.top_games} folder="videogames/top_games" />
      </section>
      <section>
        <h3 className={styles.sectionTitle}>{t.videogames.currentlyPlaying}</h3>
        <Carousel items={currentlyPlaying} folder="videogames/currently_playing" />
      </section>
      <section>
        <h3 className={styles.sectionTitle}>{t.videogames.other}</h3>
        <div className={styles.grid}>
          {videogamesData.other.map((game) => (
            <div key={game.filename} className={styles.gridItem}>
              <img src={`/mypc/videogames/other/${game.filename}`} alt={game.title} className={styles.gridImg} draggable={false}/>
              <span className={styles.gridTitle}>{game.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}