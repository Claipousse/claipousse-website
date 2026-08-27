//deals with the spawning animation of a model, used in the intro or with gallery hub, both in the same way (kinda)

"use client";
import { ReactNode, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { integrateSpring, BOUNCE_STIFFNESS, BOUNCE_DAMPING } from "@/utils/animation";
import { useIntro } from "@/utils/intro";
import { SPAWN_SETTLE } from "@/utils/introTiming";

const SPIN_TURNS = 1;

interface Props {delay?: number;spin?: boolean;onSpawn?: () => void;children: ReactNode;}
interface SpawnState {delay: number;value: number;velocity: number;settled: boolean;}

//we need to distinguish when a component is mounted for the first time and need to have a spawn animation (ex at the intro), and when we dont want (ex: when we come back to the main menu after being somewhere else)
function spawnStateFor(delay: number, enteredAt: number | null): SpawnState {
  const elapsed = enteredAt === null ? 0 : (performance.now() - enteredAt) / 1000;
  return elapsed > delay + SPAWN_SETTLE
    ? { delay: 0, value: 1, velocity: 0, settled: true }
    : { delay: Math.max(0, delay - elapsed), value: 0, velocity: 0, settled: false };
}

export default function Spawn({ delay = 0, spin = false, onSpawn, children }: Props) {
  const { entered, enteredAt } = useIntro();
  const ref = useRef<THREE.Group>(null);
  const spawn = useRef<SpawnState>(spawnStateFor(delay, enteredAt));
  const spawnedRef = useRef(false);
  const attach = useCallback((group: THREE.Group | null) => {
    ref.current = group;
    if (group) group.scale.setScalar(spawn.current.settled ? 1 : 0);
  }, []);

  useFrame((_, delta) => {
    const group = ref.current;
    const s = spawn.current;
    if (!group || s.settled) return;
    if (!entered) {
      group.scale.setScalar(0);
      return;
    }
    if (s.delay > 0) {
      s.delay -= delta;
      group.scale.setScalar(0);
      return;
    }
    if (!spawnedRef.current) {
      spawnedRef.current = true;
      onSpawn?.();
    }
    integrateSpring(s, 1, BOUNCE_STIFFNESS, BOUNCE_DAMPING, delta);
    group.scale.setScalar(Math.max(0, s.value));
    if (spin) group.rotation.y = (1 - s.value) * SPIN_TURNS * Math.PI * 2;
    if (Math.abs(1 - s.value) < 0.001 && Math.abs(s.velocity) < 0.01) {
      group.scale.setScalar(1);
      group.rotation.y = 0;
      s.settled = true;
    }
  });

  return <group ref={attach}>{children}</group>;
}