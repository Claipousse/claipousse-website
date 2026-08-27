import { Fragment, ReactNode } from "react";
import { useT } from "@/utils/traductions";
import type { Dict } from "@/utils/traductions/en";
import styles from "./css/CreditsWindow.module.css";

const CC_BY = "https://creativecommons.org/licenses/by/3.0/"; //used by poly.pizza

function withLinks(template: string, parts: Record<string, ReactNode>): ReactNode {
  const pieces = template.split(/\{([^}]+)\}/g);
  return pieces.map((piece, i) =>
    i % 2 === 0 ? piece : <Fragment key={i}>{parts[piece] ?? piece}</Fragment>,
  );
}
//each 3d model label
const USE_LABEL: Record<string, (t: Dict) => string> = {
  "my pc": (t) => t.menu.item.mypc,
  gallery: (t) => t.menu.item.gallery,
  "my room": (t) => t.menu.item.myroom,
  links: (t) => t.menu.item.links,
  "my cats": (t) => t.gallery.category.cats,
  cooking: (t) => t.gallery.category.cooking,
  gardening: (t) => t.gallery.category.gardening,
  "computer science": (t) => t.gallery.category.cs,
  other: (t) => t.gallery.category.other,
  back: (t) => t.gallery.back,
};

interface Model {
  use: string; // whats the use of the model on the website (where it is)
  title: string; //name of the 3D model on polypizza
  author: string;
  url: string; // poly.pizza page of the model
  ccBy?: boolean; // the CC-BY models must tell the license, CC0 ones no
  hasNote?: boolean; //only for links because i did it myself but was inspired by an other one
}

const MODELS: Model[] = [
  { use: "my pc", title: "CRT Monitor", author: "Jarlan Perez", url: "https://poly.pizza/m/8jVB0zIXKCv", ccBy: true },
  { use: "gallery", title: "Instant Camera", author: "Nick Slough", url: "https://poly.pizza/m/AYBr4bMYvS", ccBy: true },
  { use: "my room", title: "Key", author: "Quaternius", url: "https://poly.pizza/m/dZzratHeeG" },
  { use: "links", title: "Cork Board", author: "Jarlan Perez", url: "https://poly.pizza/m/5Ql0Sdq6fmy", ccBy: true, hasNote: true },
  { use: "my cats", title: "Marsey", author: "marsey", url: "https://poly.pizza/m/50sLsNkFOa", ccBy: true },
  { use: "cooking", title: "Hamburger", author: "jeremy", url: "https://poly.pizza/m/fNdEHvI86Hu", ccBy: true },
  { use: "gardening", title: "House plant", author: "Poly by Google", url: "https://poly.pizza/m/3qh9saogdJd", ccBy: true },
  { use: "computer science", title: "Gaming Computer", author: "Alex Safayan", url: "https://poly.pizza/m/5cN7W4ufoII", ccBy: true },
  { use: "other", title: "Box", author: "Kenney", url: "https://poly.pizza/m/HvjissDrdr" },
  { use: "back", title: "Arrow", author: "Vanessa Cao", url: "https://poly.pizza/m/bC3FokNqTpi", ccBy: true },
];

// we open links in new tabs
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.link}>
      {children}
    </a>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <ul className={styles.list}>{children}</ul>
    </section>
  );
}

function ModelEntry({ use, hasNote, title, author, url, ccBy }: Model) {
  const t = useT();
  const credit = ccBy ? (
    <>{title} by {author} <Ext href={CC_BY}>[CC-BY]</Ext> via <Ext href={url}>Poly Pizza</Ext></>
  ) : (
    <>{title} by <Ext href={url}>{author}</Ext></>
  );
  return (
    <li>
      <span className={styles.use}>{USE_LABEL[use]?.(t) ?? use}</span>: {hasNote ? <>{t.credits.linksNote} </> : null}
      {credit}
    </li>
  );
}

export default function CreditsWindow() {
  const t = useT();
  return (
    <div className={styles.root}>
      <Section title={t.credits.section.models}>
        {MODELS.map((model) => (
          <ModelEntry key={model.use} {...model} />
        ))}
      </Section>

      <Section title={t.credits.section.fonts}>
        <li>
          {withLinks(t.credits.fontsText, {
            Bestime: <Ext href="https://www.dafont.com/bestime.font">Bestime</Ext>,
            "Grape Soda": <Ext href="https://www.dafont.com/grapesoda-2.font">Grape Soda</Ext>,
          })}
        </li>
      </Section>

      <Section title={t.credits.section.musics}>
        <li>
          <span className={styles.use}>{t.credits.mainMenu}</span>:{" "}
          <Ext href="https://www.youtube.com/watch?v=oTu4WcpB9Iw">Mii Maker (Wii U) Music</Ext>
        </li>
        <li>
          <span className={styles.use}>{t.menu.item.mypc}</span>:{" "}
          <Ext href="https://www.youtube.com/watch?v=tjlvmb8SGEs">Lease - Takeshi Abo</Ext>
        </li>
      </Section>

      <Section title={t.credits.section.icons}>
        <li>
          {withLinks(t.credits.iconsText, {
            "icons8.com": <Ext href="https://icons8.com">icons8.com</Ext>,
          })}
        </li>
      </Section>

      <Section title={t.credits.section.cursors}>
        <li>
          {withLinks(t.credits.cursorsText, {
            "Retro Cursor": <Ext href="https://jeelh.itch.io/retro-cursor">Retro Cursor</Ext>,
            Jeelh: "Jeelh",
          })}
        </li>
      </Section>

      <Section title={t.credits.section.background}>
        <li>{t.credits.backgroundText}</li>
      </Section>
    </div>
  );
}