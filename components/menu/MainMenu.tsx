//main menu : handle 3d models & text spawn, etc
"use client";
import { RefObject, useRef } from "react";
import * as THREE from "three";
import Claipousse from "../three/Claipousse";
import FadeTransition from "../scene/FadeTransition";
import Model3D, { Model3DHandle } from "../three/3DModel";
import TextAnimation from "../three/TextAnimation";
import HoverText from "../three/HoverText";
import Spawn from "../three/Spawn";
import Setup from "../links/Setup";
import KeyAnimation from "../myroom/KeyAnimation";
import { LINKS_MODEL_PATH } from "../links/layout";
import { useNavigation } from "@/utils/navigation";
import { useIntro } from "@/utils/intro";
import { useT } from "@/utils/traductions";
import { playMenuSpawnNote, playMenuHoverNote } from "@/utils/menuNoteSound";
import { isCoarsePointer } from "@/utils/deviceCapabilities";
import { HOVER_REST } from "@/utils/animation";
import { CENTER_DELAY, CORNER_DELAY, CORNER_STAGGER } from "@/utils/introTiming";
import { useMenuLayout } from "./layout";

const CENTER_SFX_SRC = "/sound/claipousse/spawn.mp3";

const MENU_ICONS: {
  id: "gallery" | "links" | "myroom" | "mypc";
  path: string;
  rotation?: [number, number, number];
  textOffset: [number, number, number];
  spawnIndex: number; //order of the spawn in clockwise, starting with mypc
}[] = [
  {
    id: "mypc",
    path: "/3d/main/mypc.glb",
    rotation: [Math.PI / 18, Math.PI, 0],
    textOffset: [0, -0.78, 0.1],
    spawnIndex: 0,
  },
  {
    id: "gallery",
    path: "/3d/main/gallery.glb",
    rotation: [Math.PI / 18, Math.PI, 0],
    textOffset: [0, -0.78, 0.1],
    spawnIndex: 1,
  },
  {
    id: "links",
    path: LINKS_MODEL_PATH,
    textOffset: [0, -0.82, 0.1],
    spawnIndex: 2,
  },
  {
    id: "myroom",
    path: "/3d/main/myroom.glb",
    rotation: [-Math.PI / 18, 0, -Math.PI / 2],
    textOffset: [0, -0.85, 0.1],
    spawnIndex: 3,
  },
];

const LABEL_HOVER_DROP = 0.15; //on hover the text need to be taken down to not overlap with the 3d model getting bigger

interface Props {mypcCapturedQuaternion: RefObject<THREE.Quaternion>;}

export default function MainMenu({ mypcCapturedQuaternion }: Props) {
  const { view, cameraTarget, goToGallery, goToMyPc } = useNavigation();
  const { interactive } = useIntro();
  const t = useT();
  const mypcIconRef = useRef<Model3DHandle>(null);
  const layout = useMenuLayout();
  const coarse = isCoarsePointer();
  const hoverBounces = useRef<Record<string, RefObject<{ value: number }>>>({});
  const hoverBounce = (id: string) =>
    (hoverBounces.current[id] ??= { current: { value: HOVER_REST } });

  const handleMyPcClick = () => {
    mypcIconRef.current?.getWorldQuaternion(mypcCapturedQuaternion.current);
    goToMyPc();
  };

  return (
    <>
      <group position={[0, layout.avatarY, 0]}>
        <FadeTransition>
          <Spawn delay={CENTER_DELAY} spin onSpawn={() => new Audio(CENTER_SFX_SRC).play().catch(() => {})}>
            <group scale={layout.avatarScale}>
              <Claipousse />
            </group>
          </Spawn>
        </FadeTransition>
      </group>
      <group position={[0, layout.greetingY, 0]}>
        <FadeTransition>
          <Spawn delay={CENTER_DELAY}>
            <TextAnimation
              text={layout.greetingText}
              position={[0, 0, 0]}
              phase={2.5}
              fontSize={layout.greetingFontSize}
              curvatureFactor={layout.greetingCurvature}
              tiltFactor={1.3}
            />
          </Spawn>
        </FadeTransition>
      </group>
      {MENU_ICONS.map(({ id, path, rotation, textOffset, spawnIndex }) => {
        const label = t.menu.item[id];
        const position = layout.corners[id];
        const spawnDelay = CORNER_DELAY + spawnIndex * CORNER_STAGGER;
        const icon = (
          <group position={position}>
            <Spawn delay={spawnDelay} spin onSpawn={() => playMenuSpawnNote(spawnIndex)}>
              {id === "links" ? (
                <Setup phaseOffset={spawnIndex * 1.3} hoverBounce={hoverBounce(id)} onHoverStart={playMenuHoverNote} />
              ) : id === "myroom" ? (
                <FadeTransition forceVisible={cameraTarget === "myroom" || cameraTarget === "myroom-closing"}>
                  <KeyAnimation
                    path={path}
                    rotation={rotation}
                    scaleMult={layout.iconScale}
                    phaseOffset={spawnIndex * 1.3}
                    hoverBounce={hoverBounce(id)}
                    coarse={coarse}
                    onHoverStart={playMenuHoverNote}
                  />
                </FadeTransition>
              ) : (
                <FadeTransition
                  forceVisible={id === "gallery" && (cameraTarget === "gallery" || cameraTarget === "gallery-closing")}
                  compensateDistance={id === "gallery"}
                >
                  <Model3D
                    ref={id === "mypc" ? mypcIconRef : undefined}
                    path={path}
                    position={[0, 0, 0]}
                    rotation={rotation}
                    scaleMult={layout.iconScale}
                    phaseOffset={spawnIndex * 1.3}
                    onClick={
                      !interactive ? undefined
                        : id === "gallery" ? (view === "menu" ? goToGallery : undefined)
                        : id === "mypc" ? handleMyPcClick
                        : undefined
                    }
                    bounceHover
                    noHoverEffect={!interactive || coarse || (id === "gallery" && view !== "menu")}
                    hoverBounce={hoverBounce(id)}
                    onHoverStart={playMenuHoverNote}
                  />
                </FadeTransition>
              )}
            </Spawn>
          </group>
        );
        return (
          <group key={id}>
            {!(id === "mypc" && (cameraTarget === "mypc" || cameraTarget === "mypc-closing")) && icon}
            <group
              position={[
                position[0] + textOffset[0] * layout.scale,
                position[1] + textOffset[1] * layout.scale,
                position[2] + textOffset[2],
              ]}
            >
              <Spawn delay={spawnDelay}>
                <FadeTransition>
                  <HoverText
                    lines={[label]}
                    phase={spawnIndex * 1.7}
                    fontSize={layout.labelFontSize}
                    hoverBounce={hoverBounce(id)}
                    drop={LABEL_HOVER_DROP * layout.scale}
                  />
                </FadeTransition>
              </Spawn>
            </group>
          </group>
        );
      })}
    </>
  );
}
