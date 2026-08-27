//behavior for the camera : the movement with the mouse, the movement of transition in/out

"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigation, CameraTarget } from "@/utils/navigation";
import { useIntro } from "@/utils/intro";
import { SLIDE_DURATION, ZOOM_DURATION, CLOSE_FADE_DURATION, GALLERY_CLOSE_DURATION, LINKS_CLOSE_DURATION, MYROOM_CLOSE_DURATION, MYROOM_SPIN_DELAY, MYROOM_SPIN_DURATION } from "@/utils/transitionTiming";
import { isCoarsePointer } from "@/utils/deviceCapabilities";
import { easeInOut } from "@/utils/animation";
import { useMenuLayout, MENU_CAMERA_Z, MENU_CAMERA_Y } from "../menu/layout";
import { useGalleryHubLayout } from "../gallery/layout";

export const MYPC_ZOOM_Z = 2.1;

export const DURATION = SLIDE_DURATION;
export { ZOOM_DURATION, CLOSE_FADE_DURATION };

export const menuChromeScale = { value: 1 };
export const cameraZRatio = { value: 1 };

const TAKES_OVER: CameraTarget[] = ["gallery", "links", "myroom"]; //mypc not here because its not the same type of transition (it doesnt make disappear whats on screen)

const CLOSE_DURATIONS: Partial<Record<CameraTarget, number>> = { //based on navigation.tsx
  "gallery-closing": GALLERY_CLOSE_DURATION,
  "links-closing": LINKS_CLOSE_DURATION,
  "myroom-closing": MYROOM_CLOSE_DURATION,
};

const isClosing = (t: CameraTarget) => t === "mypc-closing" || t in CLOSE_DURATIONS;

function restingPlace(
  cameraTarget: string,
  menu: ReturnType<typeof useMenuLayout>,
  hub: ReturnType<typeof useGalleryHubLayout>
): [number, number, number] {
  if (cameraTarget === "gallery") return [hub.x, hub.cameraY, hub.cameraZ];
  if (cameraTarget === "links") return [menu.corners.links[0], menu.corners.links[1], MENU_CAMERA_Z];
  if (cameraTarget === "myroom") return [menu.corners.myroom[0], menu.corners.myroom[1], MENU_CAMERA_Z];
  if (cameraTarget === "mypc") return [menu.corners.mypc[0], menu.corners.mypc[1], MYPC_ZOOM_Z];
  return [0, MENU_CAMERA_Y, MENU_CAMERA_Z];
}

export default function Camera() {
  const { camera } = useThree();
  const { cameraTarget } = useNavigation();
  const { interactive } = useIntro();
  const interactiveRef = useRef(interactive);
  interactiveRef.current = interactive;
  const menu = useMenuLayout();
  const hub = useGalleryHubLayout();
  const restPlace = useMemo(() => restingPlace(cameraTarget, menu, hub), [cameraTarget, menu, hub]);
  const place = useRef(restPlace);
  place.current = restPlace;
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, MENU_CAMERA_Y, MENU_CAMERA_Z));
  const baseX = useRef(0);
  const baseY = useRef(MENU_CAMERA_Y);
  const baseZ = useRef(MENU_CAMERA_Z);

  const transitionT = useRef(1);
  const transitionFrom = useRef(new THREE.Vector3());
  const transitionTo = useRef(new THREE.Vector3());
  const transitionDuration = useRef(DURATION);
  const closeT = useRef(0);
  const myroomT = useRef(0);
  const prevCameraTarget = useRef<typeof cameraTarget>("menu");

  useEffect(() => {
    if (isCoarsePointer()) return;
    const onMove = (e: MouseEvent) => {
      if (!interactiveRef.current) return;
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = (1 - e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (isClosing(cameraTarget)) {
      closeT.current = 0;
      prevCameraTarget.current = cameraTarget;
      return;
    }
    if (!TAKES_OVER.includes(cameraTarget)) {
      menuChromeScale.value = 1;
    }
    mouse.current.x = 0;
    mouse.current.y = 0;
    myroomT.current = 0;
    if (cameraTarget === "menu" && isClosing(prevCameraTarget.current)) {
      prevCameraTarget.current = cameraTarget;
      baseX.current = 0;
      baseY.current = MENU_CAMERA_Y;
      baseZ.current = MENU_CAMERA_Z;
      camera.position.set(0, MENU_CAMERA_Y, MENU_CAMERA_Z);
      transitionT.current = 1;
      return;
    }
    prevCameraTarget.current = cameraTarget;
    const [targetX, targetY, targetZ] = place.current;
    baseX.current = targetX;
    baseY.current = targetY;
    baseZ.current = targetZ;
    transitionFrom.current.copy(camera.position);
    const isMypc = cameraTarget === "mypc";
    transitionTo.current.set(targetX, targetY, targetZ);
    transitionDuration.current = isMypc ? DURATION + ZOOM_DURATION : DURATION;
    transitionT.current = 0;
  }, [cameraTarget]);

  useFrame((_, delta) => {
    if (cameraTarget === "myroom") myroomT.current += delta;

    if (transitionT.current < 1) {
      transitionT.current = Math.min(transitionT.current + delta / transitionDuration.current, 1);
      camera.position.lerpVectors(
        transitionFrom.current,
        transitionTo.current,
        easeInOut(transitionT.current)
      );
      if (TAKES_OVER.includes(cameraTarget)) {
        menuChromeScale.value = 1 - easeInOut(transitionT.current);
      }
    } else if (cameraTarget === "mypc") {
      camera.position.set(place.current[0], place.current[1], MYPC_ZOOM_Z);
    } else if (cameraTarget === "mypc-closing") {
      closeT.current += delta;
      const t = closeT.current;
      if (t < CLOSE_FADE_DURATION) { //while the desktop havent finished the blackscreen fade we dont move
        camera.position.set(baseX.current, baseY.current, MYPC_ZOOM_Z);
      } else {
        const p = easeInOut(Math.min((t - CLOSE_FADE_DURATION) / (ZOOM_DURATION + DURATION), 1));
        camera.position.set(
          THREE.MathUtils.lerp(baseX.current, 0, p),
          THREE.MathUtils.lerp(baseY.current, MENU_CAMERA_Y, p),
          THREE.MathUtils.lerp(MYPC_ZOOM_Z, MENU_CAMERA_Z, p)
        );
      }
    } else if (CLOSE_DURATIONS[cameraTarget]) {
      //same back animations for the 3 hubs
      closeT.current += delta;
      const p = easeInOut(Math.min(closeT.current / CLOSE_DURATIONS[cameraTarget]!, 1));
      camera.position.set(
        THREE.MathUtils.lerp(baseX.current, 0, p),
        THREE.MathUtils.lerp(baseY.current, MENU_CAMERA_Y, p),
        THREE.MathUtils.lerp(baseZ.current, MENU_CAMERA_Z, p)
      );
      menuChromeScale.value = p;
    } else if (
      cameraTarget === "myroom" &&
      myroomT.current < MYROOM_SPIN_DELAY + MYROOM_SPIN_DURATION
    ) {
      //while key is spinning the camera/parallax dont move with the mouse
      camera.position.set(place.current[0], place.current[1], place.current[2]);
    } else {
      const parallaxX = mouse.current.x * 0.8;
      const parallaxY = mouse.current.y * 0.5;
      const [restX, restY, restZ] = place.current;
      target.current.set(restX + parallaxX, restY + parallaxY, restZ);
      camera.position.lerp(target.current, 0.05);
    }
    cameraZRatio.value = camera.position.z / MENU_CAMERA_Z;
  });

  return null;
}