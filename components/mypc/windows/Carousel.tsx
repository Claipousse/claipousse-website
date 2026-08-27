"use client";

import { useState } from "react";
import ArrowIcon from "./ArrowIcon";
import styles from "./css/Carousel.module.css";

export interface CarouselItem {
  filename: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  folder: string;
  large?: boolean;
}

export default function Carousel({ items, folder, large }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const item = items[index];

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        <button type="button" className={styles.arrow} onClick={goPrev} aria-label="previous">
          <ArrowIcon direction="left" />
        </button>
        <img
          src={`/mypc/${folder}/${item.filename}`}
          alt={item.title}
          className={`${styles.cover} ${large ? styles.coverLarge : ""}`}
          draggable={false}
        />
        <button type="button" className={styles.arrow} onClick={goNext} aria-label="next">
          <ArrowIcon direction="right" />
        </button>
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{item.title}</span>
        {item.description && <span className={styles.description}>{item.description}</span>}
        <span className={styles.counter}>{index + 1}/{items.length}</span>
      </div>
    </div>
  );
}
