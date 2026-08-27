"use client";
//handle the way 3d models disappear when we transition
//its not about the black fade transition we see on my pc
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { menuChromeScale, cameraZRatio } from "./Camera";

interface Props {children: React.ReactNode;forceVisible?: boolean;compensateDistance?: boolean;}

export default function FadeTransition({ children, forceVisible = false, compensateDistance = false }: Props) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const scale = forceVisible ? (compensateDistance ? cameraZRatio.value : 1) : menuChromeScale.value;
    ref.current?.scale.setScalar(scale);
  });
  return <group ref={ref}>{children}</group>;
}