//preload the gallery photos as soon as we click on gallery in the main menu, thumbs first section by section then the zoomed ones after, so the detail view doesnt flash white when a photo gets picked

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useNavigation } from "@/utils/navigation";
import { useDeviceTier } from "@/utils/deviceCapabilities";

import catsData from "@/data/gallery/cats.json";
import cookingData from "@/data/gallery/cooking.json";
import csData from "@/data/gallery/computer-science.json";
import gardeningData from "@/data/gallery/gardening.json";
import otherData from "@/data/gallery/other.json";

const SECTIONS: { folder: string; photos: { filename: string }[] }[] = [
  { folder: "cats", photos: catsData.photos },
  { folder: "cooking", photos: cookingData.photos },
  { folder: "computer-science", photos: csData.photos },
  { folder: "gardening", photos: gardeningData.photos },
  { folder: "other", photos: otherData.photos },
];

const ZOOMED_DELAY_MS = 600;

export default function GalleryPreload() {
  const { cameraTarget } = useNavigation();
  const tier = useDeviceTier();
  const mobile = tier === "mobile";
  const [zoomedReady, setZoomedReady] = useState(false);

  useEffect(() => {
    if (cameraTarget !== "gallery") return;
    const t = setTimeout(() => setZoomedReady(true), ZOOMED_DELAY_MS);
    return () => clearTimeout(t);
  }, [cameraTarget]);

  if (cameraTarget !== "gallery") return null;

  return (
    <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }}>
      {SECTIONS.map(({ folder, photos }) =>
        photos.map((photo) => (
          <Image key={`thumb-${folder}-${photo.filename}`} src={`/gallery/${folder}/${photo.filename}`} alt="" width={300} height={300} sizes={mobile ? "46vw" : "300px"} loading="eager" />
        )),
      )}
      {zoomedReady &&
        SECTIONS.map(({ folder, photos }) =>
          photos.map((photo) => (
            <Image key={`zoom-${folder}-${photo.filename}`} src={`/gallery/${folder}/${photo.filename}`} alt="" width={640} height={640} sizes={mobile ? "88vw" : "640px"} loading="eager" />
          )),
        )}
    </div>
  );
}
