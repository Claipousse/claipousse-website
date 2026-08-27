//the main 3d model at the center of the main menu, has different idle animation, behaviour on hover and when clicked is launched and play a random sound

"use client";
import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { isCoarsePointer } from "@/utils/deviceCapabilities";
import { useIntro } from "@/utils/intro";

const SOUND_COUNT = 14; //14 different sound possible when clicking
const BACK_SPEED_BIAS = 0.7; //extra speed fraction when facing away, 0 when facing the camera

const sounds = Array.from(
  { length: SOUND_COUNT },
  (_, i) => `/sound/claipousse/click${String(i + 1).padStart(2, "0")}.mp3` //array with the sfx
);

export default function Claipousse() {
  const { scene } = useGLTF("/3d/main/claipousse.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const coarse = isCoarsePointer();
  const { entered, interactive } = useIntro();

  const hitRadius = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    return Math.max(size.x, size.y, size.z) * 0.4;
  }, [scene]);
  const vel = useRef({ x: 0, y: 0.5, z: 0 });
  const impulse = useRef({ x: 0, y: 0, z: 0 });
  const scaleVec = useRef(new THREE.Vector3());
  const lastSoundIndex = useRef<number>(-1);

  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = -Math.PI / 2;
  }, []);

  function handleClick() {
    let index: number;
    do {
      index = Math.floor(Math.random() * SOUND_COUNT);
    } while (index === lastSoundIndex.current);
    lastSoundIndex.current = index;

    const audio = new Audio(sounds[index]);
    audio.volume = 0.8;
    audio.play().catch(() => {});
    //we go in the same direction of rotation, otherwise two opposite forces cancel
    const dir = vel.current.y + impulse.current.y >= 0 ? 1 : -1;
    impulse.current.y += dir * (18 + Math.random() * 6);
    impulse.current.x += (Math.random() - 0.5) * 16;
    impulse.current.z += (Math.random() - 0.5) * 6;
  }
  // when clicking the modele, the idle force (reorienting the modele to the center doing 180° horizontaly) is disables temporarily to let impulsion force happening
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!entered) return;
    const t = state.clock.elapsedTime;
    const rot = groupRef.current.rotation;

    const impFriction = Math.pow(0.15, delta); //friction = reduce the speed of the model after each frame when clicking it just like real life speed decelerate after time
    impulse.current.x *= impFriction;
    impulse.current.y *= impFriction;
    impulse.current.z *= impFriction;

    // 0 = impulsion at fullest, 1 = idle
    const impulseMag = Math.abs(impulse.current.x) + Math.abs(impulse.current.y) + Math.abs(impulse.current.z);
    const calm = 1 - Math.min(1, impulseMag / 5);

    // irregular movement when idle up and right
    vel.current.y += 0.2 * Math.sin(t * 0.31) * delta;
    vel.current.x += 0.5 * Math.sin(t * 0.47 + 1.2) * delta;
    vel.current.z += 0.25 * Math.sin(t * 0.39 + 0.7) * delta;

    // gravity thing: stable at 0° but instable at 180°, in other word we dont want the model to be upside down
    vel.current.x -= 1.5 * calm * Math.sin(rot.x) * delta;
    vel.current.z -= 1.5 * calm * Math.sin(rot.z) * delta;

    const tiltDamp = Math.pow(0.4, delta * calm);
    vel.current.x *= tiltDamp;
    vel.current.z *= tiltDamp;

    const targetY = 0.4 + 0.15 * Math.sin(t * 0.2);
    vel.current.y += (targetY - vel.current.y) * 2.0 * calm * delta;
    vel.current.y *= Math.pow(0.85, delta);

    const speedFactor = 1 + BACK_SPEED_BIAS * Math.max(0, -Math.cos(rot.y));
    rot.y += (vel.current.y * speedFactor + impulse.current.y) * delta;
    rot.x += (vel.current.x + impulse.current.x) * delta;
    rot.z += (vel.current.z + impulse.current.z) * delta;

    const s = hovered ? 1.10 : 1;
    groupRef.current.scale.lerp(scaleVec.current.set(s, s, s), 0.08);
  });

  return (
    <group ref={groupRef}>
      <mesh
        onClick={interactive ? handleClick : undefined}
        onPointerEnter={coarse || !interactive ? undefined : () => setHovered(true)}
        onPointerLeave={coarse || !interactive ? undefined : () => setHovered(false)}
      >
        <sphereGeometry args={[hitRadius, 8, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/3d/main/claipousse.glb");