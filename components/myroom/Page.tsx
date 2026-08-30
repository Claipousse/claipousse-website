"use client";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import TextAnimation from "../three/TextAnimation";
import Model3D from "../three/3DModel";
import HoverText from "../three/HoverText";
import { useMenuLayout } from "../menu/layout";
import { useNavigation } from "@/utils/navigation";
import { easeInOut, HOVER_REST } from "@/utils/animation";
import { MYROOM_SPIN_DELAY, MYROOM_SPIN_DURATION } from "@/utils/transitionTiming";
import { useMyRoomLayout, worldToPixels, TITLE_CURVATURE, BODY_CURVATURE, BACK_FONT, GIF_SRC, GIF_ASPECT, SFX_SRC, FART_SFX_SRC, TITLE_TEXT, WIP_IMAGE_ALT, BACK_TEXT } from "./layout";
import { isSfxOn } from "@/utils/sfx";
import styles from "./css/Page.module.css";

const SCALE_DURATION = 0.25; // exit = entry played backwards, all at once rather than spread over the whole camera move
const BACK_ROTATION: [number, number, number] = [Math.PI / 2, -Math.PI / 2.7, 0]; // same arrow/angle as the gallery hub's back tile
const BUTT_HITZONE = { left: "13%", top: "67%", width: "30%", height: "18%" }; // rough hitzone over the butt on the gif (haha easter egg)


//hided so no ? cursor on hover, its like the little fart secret between us
//dunno when ill do the my room rn im pretty tired so maybe in several weeks its worth integrate it
function ButtHitzone() {
  return (
    <div onClick={() => { if (isSfxOn()) new Audio(FART_SFX_SRC).play().catch(() => {}); }} style={{ position: "absolute", pointerEvents: "auto", ...BUTT_HITZONE }} />
  );
}

function Content() {
  const { closeMyRoom, cameraTarget } = useNavigation();
  const layout = useMyRoomLayout();
  const canvasHeight = useThree((state) => state.size.height);
  const groupRef = useRef<THREE.Group>(null);
  const gifRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const closingAt = useRef(0);
  const backBounce = useRef({ value: HOVER_REST });

  useEffect(() => {
    if (!isSfxOn()) return;
    const sound = new Audio(SFX_SRC);
    sound.volume = 0.55;
    sound.play().catch(() => {});
  }, []);

  const closing = cameraTarget === "myroom-closing";

  useFrame(({ clock }) => {
    let scale: number;
    if (closing) {
      if (!closingAt.current) closingAt.current = clock.elapsedTime;
      const p = Math.min((clock.elapsedTime - closingAt.current) / SCALE_DURATION, 1);
      scale = easeInOut(1 - p);
    } else {
      if (!startedAt.current) startedAt.current = clock.elapsedTime;
      const p = Math.min((clock.elapsedTime - startedAt.current) / SCALE_DURATION, 1);
      scale = easeInOut(p);
    }
    groupRef.current?.scale.setScalar(scale);
    if (gifRef.current) gifRef.current.style.transform = `scale(${scale})`;
  });

  const gifHeight = worldToPixels(layout.gifHeight, canvasHeight);

  return (
    <>
      <group ref={groupRef} scale={0}>
        <TextAnimation text={TITLE_TEXT} position={[0, layout.titleY, 0]} fontSize={layout.titleFontSize} curvatureFactor={TITLE_CURVATURE} tiltFactor={1.3} onTop />
        {layout.bodyLines.map((line, i) => (
          <TextAnimation key={i} text={line} position={[0, layout.bodyTopY - i * layout.bodyLineStep, 0]} phase={i * 1.7} fontSize={layout.bodyFontSize} curvatureFactor={BODY_CURVATURE} tiltFactor={1.3} onTop />
        ))}
        <Model3D path="/3d/back.glb" position={layout.backPosition} rotation={BACK_ROTATION} scaleMult={layout.backIconScale} onClick={closeMyRoom} bounceHover hoverBounce={backBounce} />
        <group position={[layout.backPosition[0] + layout.backLabelOffset[0], layout.backPosition[1] + layout.backLabelOffset[1], layout.backPosition[2] + layout.backLabelOffset[2]]}>
          <HoverText lines={[BACK_TEXT]} phase={3.4} fontSize={BACK_FONT} hoverBounce={backBounce} drop={layout.backLabelDrop} curvatureFactor={layout.backLabelCurvature} />
        </group>
      </group>
      <Html center position={[0, layout.gifY, 0]} zIndexRange={[10, 0]}>
        <div ref={gifRef} style={{ position: "relative", transform: "scale(0)" }}>
          <img src={GIF_SRC} alt={WIP_IMAGE_ALT} className={styles.gif} draggable={false} style={{ height: gifHeight, width: gifHeight * GIF_ASPECT }} />
          <ButtHitzone />
        </div>
      </Html>
    </>
  );
}

export default function Page() {
  const { cameraTarget } = useNavigation();
  const menu = useMenuLayout();
  const [showing, setShowing] = useState(false);
  const [seen, setSeen] = useState(cameraTarget);
  if (seen !== cameraTarget) {
    setSeen(cameraTarget);
    if (cameraTarget === "menu") setShowing(false);
  }

  useEffect(() => {
    if (cameraTarget !== "myroom") return;
    const timer = setTimeout(
      () => setShowing(true),
      (MYROOM_SPIN_DELAY + MYROOM_SPIN_DURATION) * 1000
    );
    return () => clearTimeout(timer);
  }, [cameraTarget]);

  if (!showing) return null;
  return (
    <group position={menu.corners.myroom}>
      <Content />
    </group>
  );
}