//deals with the spawn animation when entering gallery of the 6 models

"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Model3D from "../three/3DModel";
import HoverText from "../three/HoverText";
import { integrateSpring, BOUNCE_STIFFNESS, BOUNCE_DAMPING, HOVER_REST } from "@/utils/animation";
import { playGallerySpawnNote, playGalleryHoverNote } from "@/utils/galleryNoteSound";

export const GALLERY_SPAWN_STAGGER = 0.18; //time between 2 spawn
const SPIN_TURNS = 1;
const LABEL_HOVER_DROP = 0.09; //text lowed when onhover cause the model is getting bigger

interface Props {
  path: string;
  wx: number;
  wy: number;
  wz: number;
  rotation: [number, number, number];
  scaleMult?: number;
  textOffset: [number, number, number];
  label: string | string[];
  fontSize?: number;
  phaseOffset: number;
  labelPhase: number;
  spawnIndex: number;
  visible: boolean;
  closing?: boolean;
  onClick?: () => void;
  bounceStrength?: number;
}

export default function GallerySpawn({ path, wx, wy, wz, rotation, scaleMult, textOffset, label, fontSize, phaseOffset, labelPhase, spawnIndex, visible, closing = false, onClick, bounceStrength }: Props) {
  const modelSpawnRef = useRef<THREE.Group>(null);
  const labelSpawnRef = useRef<THREE.Group>(null);
  const spawn = useRef({ delay: spawnIndex * GALLERY_SPAWN_STAGGER, value: 0, velocity: 0 });
  const hoverBounce = useRef({ value: HOVER_REST });
  const notePlayed = useRef(false); //1 note per mount, right when the stagger delay runs out

  useFrame((_, delta) => {
    if (!visible) {
      modelSpawnRef.current?.scale.setScalar(0);
      labelSpawnRef.current?.scale.setScalar(0);
      return;
    }
    const s = spawn.current;
    if (!closing && s.delay > 0) {
      s.delay -= delta;
      modelSpawnRef.current?.scale.setScalar(0);
      labelSpawnRef.current?.scale.setScalar(0);
      return;
    }
    if (!closing && !notePlayed.current) {
      playGallerySpawnNote(spawnIndex);
      notePlayed.current = true;
    }
    integrateSpring(s, closing ? 0 : 1, BOUNCE_STIFFNESS, BOUNCE_DAMPING, delta);
    if (closing && s.value <= 0.02) {
      s.value = 0;
      s.velocity = 0;
    }
    const scale = Math.max(0, s.value);
    const spin = (1 - s.value) * SPIN_TURNS * Math.PI * 2;
    if (modelSpawnRef.current) {
      modelSpawnRef.current.scale.setScalar(scale);
      modelSpawnRef.current.rotation.y = spin;
    }
    if (labelSpawnRef.current) {
      labelSpawnRef.current.scale.setScalar(scale);
    }
  });

  const labelLines = Array.isArray(label) ? label : [label];

  return (
    <>
      <group position={[wx, wy, wz]}>
        <group ref={modelSpawnRef} scale={0}>
          <group rotation={rotation}>
            <Model3D path={path} position={[0, 0, 0]} scaleMult={scaleMult} phaseOffset={phaseOffset} onClick={onClick} bounceHover bounceStrength={bounceStrength} hoverBounce={hoverBounce} onHoverStart={playGalleryHoverNote} />
          </group>
        </group>
      </group>
      <group position={[wx + textOffset[0], wy + textOffset[1], textOffset[2]]}>
        <group ref={labelSpawnRef} scale={0}>
          <HoverText lines={labelLines} phase={labelPhase} fontSize={fontSize} hoverBounce={hoverBounce} bounceStrength={bounceStrength} drop={LABEL_HOVER_DROP} />
        </group>
      </group>
    </>
  );
}