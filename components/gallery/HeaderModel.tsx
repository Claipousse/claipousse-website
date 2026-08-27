//its the little shit at the top left corner, same 3d model as the category we explore,and with a little < floating at the left like a testicle
"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model3D from "../three/3DModel";
import { Category } from "@/utils/navigation";

const ICON_PATH: Record<Category, string> = {
  cats: "/3d/gallery/cats.glb",
  cooking: "/3d/gallery/cooking.glb",
  cs: "/3d/gallery/computer-science.glb",
  gardening: "/3d/gallery/gardening.glb",
  other: "/3d/gallery/other.glb",
};

//in order to face well the camera, and to have a good angle at the 3d model, these 2 are some sort of box i want to have an angle on a corner which shows 3 faces at a time and blablatungtungsahur
const ICON_ROTATION_Y: Record<Category, number> = {
  cats: 0,
  cooking: 0,
  cs: Math.PI - Math.PI / 6,
  gardening: 0,
  other: Math.PI + Math.PI / 6,
};

const TILT_DOWN = Math.PI / 18; //tilted down because they are a the top of the screen so otherwise we would see them from top just like a 10 feet chad
const ICON_SCALE_MULT = 1.3;
const RENDER_SIZE = 170;

export default function HeaderModel({ category }: { category: Category }) {
  return (
    <div style={{ width: RENDER_SIZE, height: RENDER_SIZE, position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 1.85], fov: 45 }} gl={{ alpha: true }} dpr={2} style={{ width: RENDER_SIZE, height: RENDER_SIZE, background: "transparent" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, 3]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model3D path={ICON_PATH[category]} position={[0, 0, 0]} rotation={[TILT_DOWN, ICON_ROTATION_Y[category], 0]} scaleMult={ICON_SCALE_MULT} fitRotated noHoverEffect />
        </Suspense>
      </Canvas>
    </div>
  );
}