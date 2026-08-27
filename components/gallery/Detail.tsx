//detail = when you click a category on the gallery hub and you have the list of images so cool of me
//desktop and mobile are slightly different specially when you click on a image
"use client";
import { useState } from "react";
import { useNavigation, Category } from "@/utils/navigation";
import { useDeviceTier } from "@/utils/deviceCapabilities";
import { useT } from "@/utils/traductions";
import { backdropTransform } from "@/components/layout/BackgroundVideo";
import DetailDesktop from "./DetailDesktop";
import DetailMobile from "./DetailMobile";
import styles from "./css/Detail.module.css";

import catsData from "@/data/gallery/cats.json";
import cookingData from "@/data/gallery/cooking.json";
import csData from "@/data/gallery/computer-science.json";
import gardeningData from "@/data/gallery/gardening.json";
import otherData from "@/data/gallery/other.json";

const FOLDER: Record<Category, string> = { //categories
  cats: "cats",
  cooking: "cooking",
  cs: "computer-science",
  gardening: "gardening",
  other: "other",
};

const DATA: Record<Category, { photos: { filename: string }[] }> = { //whats inside of them
  cats: catsData,
  cooking: cookingData,
  cs: csData,
  gardening: gardeningData,
  other: otherData,
};

//every polaroid have a pseudo-random tilt based on the index, they keep the same everytime we go check them
function seededRot(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; //top10 einstein moment
  return ((x - Math.floor(x)) - 0.5) * 20;
}

export default function Detail() {
  const { category, closeCategory, cameraTarget } = useNavigation();
  const tier = useDeviceTier();
  const t = useT();
  const [closing, setClosing] = useState(false);
  if (!category) return null;
  const folder = FOLDER[category];
  const photos = DATA[category].photos.map((photo, i) => ({
    filename: photo.filename,
    rot: seededRot(i),
  }));
  const handleClose = () => setClosing(true);
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (closing) {
      setClosing(false);
      closeCategory();
    }
  };

  //we play the background video, and we are chosing if we need mobile or desktop based on ternary operation
  return (
    <div className={`${styles.overlay} ${closing ? styles.closing : ""}`} onAnimationEnd={handleAnimationEnd}>
      <video autoPlay loop muted playsInline className={styles.bg} style={{ transform: backdropTransform(cameraTarget) }}>
        <source src="/background.webm" type="video/webm" />
      </video>
      {tier === "mobile" ? (
        <DetailMobile title={t.gallery.category[category]} folder={folder} photos={photos} onClose={handleClose}/>) : (
        <DetailDesktop category={category} folder={folder} photos={photos} onClose={handleClose}/>
      )}
    </div>
  );
}