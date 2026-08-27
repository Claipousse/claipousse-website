"use client";
// hub of gallery with the 6 icons in hexagon (described in layout.ts)
import GallerySpawn from "./GallerySpawn";
import { useGalleryHubLayout, hubSlotOffset } from "./layout";
import { useNavigation, Category } from "@/utils/navigation";
import { playGalleryClickSound } from "@/utils/gallerySound";
import { useT } from "@/utils/traductions";
import { DEFAULT_FONT_SIZE } from "../three/TextAnimation";

const TILT = Math.PI / 18;

const GAL_ICONS: {
  id: "cats" | "cooking" | "gardening" | "cs" | "other" | "back";
  path: string;
  slot: number;
  pitch?: number;
  yaw?: number;
  scaleMult?: number;
  onClick?: "goToMenu";
  spawnIndex: number;
}[] = [ //spawn order starting by cats, clockwise
  {
    id: "cats",
    path: "/3d/gallery/cats.glb",
    slot: 0,
    spawnIndex: 0,
  },
  {
    id: "cooking",
    path: "/3d/gallery/cooking.glb",
    slot: 1,
    spawnIndex: 1,
  },
  {
    id: "gardening",
    path: "/3d/gallery/gardening.glb",
    slot: 2,
    spawnIndex: 2,
  },
  {
    id: "cs",
    path: "/3d/gallery/computer-science.glb",
    slot: 3,
    yaw: Math.PI - Math.PI / 6,
    spawnIndex: 3,
  },
  {
    id: "other",
    path: "/3d/gallery/other.glb",
    slot: 4,
    yaw: Math.PI + Math.PI / 6,
    scaleMult: 0.7,
    spawnIndex: 4,
  },
  {
    id: "back",
    path: "/3d/back.glb",
    slot: 5,
    pitch: Math.PI / 2,
    yaw: -Math.PI / 2.7,
    onClick: "goToMenu" as const, //behaviour =gtfo
    spawnIndex: 5,
  },
];

export default function Hub() {
  const { view, cameraTarget, closeGallery, goToCategory } = useNavigation();
  const hub = useGalleryHubLayout();
  const t = useT();

  return (
    <>
      {GAL_ICONS.map(({ id, path, slot, pitch, yaw, scaleMult, onClick, spawnIndex }, i) => {
        //in english "computer science" is on 2 lines but in fr "informatique" is in 1 ligne but big, we need to handle this case
        const label = id === "cs" ? t.gallery.category.cs.split(" ") : id === "back" ? t.gallery.back : t.gallery.category[id];
        const [ox, oy] = hubSlotOffset(slot, hub);
        const rotation: [number, number, number] = [
          pitch ?? (oy > 0 ? TILT : oy < 0 ? -TILT : 0),
          yaw ?? 0,
          0,
        ];
        return (
          <GallerySpawn
            //entering/exiting hub = remount = animation replayed
            key={`${id}-${view === "gallery" ? 1 : 0}`}
            path={path}
            wx={hub.x + ox}
            wy={hub.y + oy}
            wz={0}
            rotation={rotation}
            scaleMult={(scaleMult ?? 1) * hub.iconScale}
            textOffset={[0, -0.62 * hub.iconScale, 0.1]}
            label={label}
            fontSize={DEFAULT_FONT_SIZE * hub.iconScale}
            phaseOffset={i * 1.3 + 4.2}
            labelPhase={i * 1.7 + 5.1}
            spawnIndex={spawnIndex}
            visible={view === "gallery"}
            closing={cameraTarget === "gallery-closing"}
            onClick={
              onClick === "goToMenu"
                ? closeGallery
                : id !== "back"
                ? () => {
                    playGalleryClickSound();
                    goToCategory(id as Category);
                  }
                : undefined
            }
            bounceStrength={0.7}
          />
        );
      })}
    </>
  );
}