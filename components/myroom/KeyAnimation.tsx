//the animation of the key, which spin when the camera is centered on it and zooming and disappearing after, my room page comes after this

"use client";
import { RefObject, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Model3D from "../three/3DModel";
import { useNavigation } from "@/utils/navigation";
import { useIntro } from "@/utils/intro";
import { easeInOut } from "@/utils/animation";
import { MYROOM_SPIN_DELAY, MYROOM_SPIN_DURATION, MYROOM_CLOSE_DURATION } from "@/utils/transitionTiming";
import { isSfxOn } from "@/utils/sfx";

const SFX_SRC = "/sound/myroom/spin.mp3";

const LEAN_ANGLE = (50 * Math.PI) / 180; //opposite clockwise taken while camera is going on the key to give momentum illusion
const TURNS = 6; // 6 turn clockwise
const ACCELERATION = 1.8; //accelleration while doing the speed
const GROWTH = 1.45; // growth while spining
const VANISH_FROM = 0.78; //when it start to disappear

function spinAngle(p: number): number {
  return LEAN_ANGLE - (LEAN_ANGLE + TURNS * 2 * Math.PI) * p ** ACCELERATION;
}

function spinScale(p: number): number {
  const grown = 1 + (GROWTH - 1) * easeInOut(p);
  if (p < VANISH_FROM) return grown;
  return grown * (1 - easeInOut((p - VANISH_FROM) / (1 - VANISH_FROM)));
}

interface Props {
  path: string;
  rotation?: [number, number, number];
  scaleMult: number;
  phaseOffset: number;
  hoverBounce: RefObject<{ value: number }>;
  coarse: boolean;
  onHoverStart?: () => void;
}

export default function KeyAnimation({ path, rotation, scaleMult, phaseOffset, hoverBounce, coarse, onHoverStart }: Props) {
  const { view, cameraTarget, goToMyRoom } = useNavigation();
  const { interactive } = useIntro();
  const open = cameraTarget === "myroom";
  const busy = open || cameraTarget === "myroom-closing";
  const groupRef = useRef<THREE.Group>(null);
  const changedAt = useRef(-MYROOM_CLOSE_DURATION);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open || !isSfxOn()) return;
    const sound = new Audio(SFX_SRC);
    sound.volume = 0.55;
    let started: Promise<void> | undefined;
    const timer = setTimeout(() => {
      started = sound.play().catch(() => {});
    }, MYROOM_SPIN_DELAY * 1000);
    return () => {
      clearTimeout(timer);
      started?.then(() => sound.pause());
    };
  }, [open]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    if (open !== wasOpen.current) {
      wasOpen.current = open;
      changedAt.current = now;
    }
    const group = groupRef.current;
    if (!group) return;

    if (open) {
      const t = now - changedAt.current;
      if (t < MYROOM_SPIN_DELAY) {
        group.rotation.z = LEAN_ANGLE * easeInOut(t / MYROOM_SPIN_DELAY);
        group.scale.setScalar(1);
      } else {
        const p = Math.min((t - MYROOM_SPIN_DELAY) / MYROOM_SPIN_DURATION, 1);
        group.rotation.z = spinAngle(p);
        group.scale.setScalar(spinScale(p));
      }
    } else {
      group.rotation.z = 0;
      group.scale.setScalar(easeInOut(Math.min((now - changedAt.current) / MYROOM_CLOSE_DURATION, 1)));
    }
  });

  return (
    <group ref={groupRef}>
      <Model3D path={path} position={[0, 0, 0]} rotation={rotation} scaleMult={scaleMult} phaseOffset={phaseOffset} onClick={view === "menu" && interactive ? goToMyRoom : undefined} frozen={busy} noHoverEffect={!interactive || coarse || busy} holdHover={open && !coarse} bounceHover hoverBounce={hoverBounce} onHoverStart={onHoverStart} />
    </group>
  );
}