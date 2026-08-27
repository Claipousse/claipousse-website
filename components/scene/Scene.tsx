//file for the 3D scene : canva, lights, 4 blocs who deals the the differents hubs (main screen, mypc screen, gallery hub, my room)
//links isn't here because its on the same as main menu we just erase whats on main menu while doing it

"use client";
import { Canvas, events as createPointerEvents, RootStore } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import Camera from "./Camera";
import MainMenu from "../menu/MainMenu";
import Hub from "../gallery/Hub";
import ScreenModel from "../mypc/ScreenModel";
import Page from "../myroom/Page";
import { MENU_CAMERA_Z, MENU_FOV } from "../menu/layout";

const canvasEvents = (store: RootStore) => ({
  ...createPointerEvents(store),
  compute(event: { clientX: number; clientY: number }, state: ReturnType<RootStore["getState"]>) {
    const rect = state.gl.domElement.getBoundingClientRect();
    state.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    state.raycaster.setFromCamera(state.pointer, state.camera);
  },
});

function SceneContent() {
  const mypcCapturedQuaternion = useRef(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 18, Math.PI, 0))
  );

  return (
    <>
      <Camera />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} />
      <directionalLight position={[-3, 2, 3]} intensity={0.8} />
      <Suspense fallback={null}>
        <MainMenu mypcCapturedQuaternion={mypcCapturedQuaternion} />
        <ScreenModel capturedQuaternionRef={mypcCapturedQuaternion} />
        <Hub />
        <Page />
      </Suspense>
    </>
  );
}
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, MENU_CAMERA_Z], fov: MENU_FOV }}
      events={canvasEvents}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <SceneContent />
    </Canvas>
  );
}