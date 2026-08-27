// deals with the start of the preload and when to do it
// note that it start when clicking on mypc 3d model, not when the loading bar spawn (which is only decorative)
// we want to load everything in advance because a user will mostly open all the windows by curiosity before exiting

"use client";
import { useEffect } from "react";
import { useNavigation } from "@/utils/navigation";
import { preloadAssets } from "./preload";

export default function PreloadTrigger() {
  const { cameraTarget } = useNavigation();

  useEffect(() => {
    if (cameraTarget !== "mypc") return;
    preloadAssets();
  }, [cameraTarget]);

  return null;
}