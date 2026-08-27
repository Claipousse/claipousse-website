"use client";
//behavior of the text when hovered by mouse
//it follows the same movement as the 3d model above it, both zooming in the same way
//it also move down when zooming in order for the model above not to be hided by the text when zooming
import { RefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TextAnimation, { DEFAULT_FONT_SIZE } from "./TextAnimation";
import { HOVER_REST, HOVER_PLATEAU } from "@/utils/animation";

// gap between two lines of the same text (ex: computer / science)
const LINE_HEIGHT = 1.25;

interface Props {
  lines: string[]; //one by lines, the second is placed under the first
  phase: number;
  fontSize?: number;
  hoverBounce: RefObject<{ value: number }>;
  bounceStrength?: number;
  drop: number;
  curvatureFactor?: number;
}

export default function HoverText({lines,phase,fontSize = DEFAULT_FONT_SIZE,hoverBounce,bounceStrength = 1,drop,curvatureFactor,}: Props) {const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const value = hoverBounce.current.value;
    groupRef.current.scale.setScalar(value);
    //the descent is calculated by the same growth of the text its proportional, the bigger the lower we go
    const swing = (HOVER_PLATEAU - HOVER_REST) * bounceStrength;
    groupRef.current.position.y = swing > 0 ? -((value - HOVER_REST) / swing) * drop : 0;
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <TextAnimation
          key={i}
          text={line}
          position={[0, -i * LINE_HEIGHT * fontSize, 0]}
          phase={phase}
          fontSize={fontSize}
          curvatureFactor={curvatureFactor}
          onTop
        />
      ))}
    </group>
  );
}