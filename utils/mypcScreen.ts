//functions to show the mypc screen at the right time and handle the opening and closing of it cause its slightly more complex than the others delay

"use client";
import { useEffect, useState } from "react";
import { useNavigation } from "./navigation";
import { BOOT_DELAY, CLOSE_FADE_DURATION } from "./transitionTiming";

export function useMyPcScreenShowing(): boolean {
  const { cameraTarget } = useNavigation();
  const [showing, setShowing] = useState(false);
  const [seen, setSeen] = useState(cameraTarget);

  if (seen !== cameraTarget) {
    setSeen(cameraTarget);
    if (cameraTarget !== "mypc" && cameraTarget !== "mypc-closing") setShowing(false);
  }

  useEffect(() => {
    if (cameraTarget === "mypc") { //if entering mypc, we show the screen after the boot delay constant
      const t = setTimeout(() => setShowing(true), BOOT_DELAY * 1000);
      return () => clearTimeout(t);
    }
    if (cameraTarget === "mypc-closing") { //if closing mypc we make the screen disappear at the good time
      const t = setTimeout(() => setShowing(false), CLOSE_FADE_DURATION * 1000);
      return () => clearTimeout(t);
    }
  }, [cameraTarget]);

  return showing;
}
