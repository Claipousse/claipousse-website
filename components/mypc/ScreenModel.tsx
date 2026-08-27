//clone of the my pc model, but designed for the click scenario when we need it to be fixed and straight
// it straightens up from the position of the original model (which moves in all directions because of the idle animation)
// because of that we cannot do a fix animation and its annoying asf
//again lot of maths and technical animation code means vibecoded things here sorry pals
"use client";
import { RefObject, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigation } from "@/utils/navigation";
import { SLIDE_DURATION, ZOOM_DURATION, CLOSE_FADE_DURATION } from "@/utils/transitionTiming";
import { easeInOut } from "@/utils/animation";
import { useMenuLayout } from "../menu/layout";
import Model3D from "../three/3DModel";

const SWOOP_DURATION = SLIDE_DURATION + ZOOM_DURATION; //pan & tracking form a single movment

//take the rotation fixed at the entering of mypc
const REST_TILT_X = Math.PI / 18;
const bakedRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(REST_TILT_X, Math.PI, 0));
const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0)); //fixed position perfectly straighten and face camera
const MYPC_ICON_PHASE_OFFSET = 3 * 1.3;
const scratchEuler = new THREE.Euler();
const scratchQuaternion = new THREE.Quaternion();

// reproduce the formula of the idle animation of Model3d so it can preshot the orientation of the icon without it existing (because it is unmounted when enterng mypc)
function liveIconQuaternion(elapsedTime: number, target: THREE.Quaternion): THREE.Quaternion {
  const t = elapsedTime;
  const p = MYPC_ICON_PHASE_OFFSET;
  scratchEuler.set( //no need to say this thing is not made by me i'm not fucking leonhard euler
    Math.sin(t * 0.29 + p * 1.7) * 0.13 +
      Math.sin(t * 0.83 + p * 0.9) * 0.08 +
      Math.sin(t * 1.31 + p * 1.1) * 0.05,
    Math.sin(t * 0.41 + p) * 0.22 +
      Math.sin(t * 0.73 + p * 1.4) * 0.14 +
      Math.sin(t * 1.17 + p * 0.6) * 0.09,
    Math.sin(t * 0.53 + p * 1.2) * 0.10 +
      Math.sin(t * 0.97 + p * 0.8) * 0.06
  );
  scratchQuaternion.setFromEuler(scratchEuler);
  return target.multiplyQuaternions(scratchQuaternion, bakedRotationQuaternion);
}

interface Props {capturedQuaternionRef: RefObject<THREE.Quaternion>;}

export default function ScreenModel({ capturedQuaternionRef }: Props) {
  const { cameraTarget } = useNavigation();
  const layout = useMenuLayout();
  const groupRef = useRef<THREE.Group>(null);
  const t = useRef(0);
  const closeT = useRef(0);
  const fromQuaternion = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (cameraTarget === "mypc") {
      fromQuaternion.current.copy(capturedQuaternionRef.current ?? bakedRotationQuaternion);
      t.current = 0;
    } else if (cameraTarget === "mypc-closing") {
      closeT.current = 0;
    }
  }, [cameraTarget, capturedQuaternionRef]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (cameraTarget === "mypc") {
      if (t.current >= 1) {
        // when the reorientation is done and the black screen is here we stop rendering it
        groupRef.current.visible = false;
        return;
      }
      //is finished during the entering, the modele became fixed at the close up
      groupRef.current.visible = true;
      t.current = Math.min(t.current + delta / SWOOP_DURATION, 1);
    } else if (cameraTarget === "mypc-closing") {
      groupRef.current.visible = true;
      closeT.current += delta;
      t.current = closeT.current < CLOSE_FADE_DURATION
        ? 1
        : 1 - Math.min((closeT.current - CLOSE_FADE_DURATION) / SWOOP_DURATION, 1);
      liveIconQuaternion(state.clock.elapsedTime, fromQuaternion.current);
    } else {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.quaternion.slerpQuaternions(fromQuaternion.current, targetQuaternion, easeInOut(t.current));
  });

  return (
    <group position={[layout.corners.mypc[0], layout.corners.mypc[1], 0]}>
      <group ref={groupRef} visible={false}>
        <Model3D
          path="/3d/main/mypc.glb"
          position={[0, 0, 0]}
          scaleMult={layout.iconScale}
          phaseOffset={3.4}
          noHoverEffect
          frozen
        />
      </group>
    </group>
  );
}