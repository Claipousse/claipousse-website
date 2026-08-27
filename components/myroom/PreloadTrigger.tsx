"use client";
import { useEffect } from "react";
import { useNavigation } from "@/utils/navigation";
import { preloadMyRoomAssets } from "./preload";

export default function PreloadTrigger() {
  const { cameraTarget } = useNavigation();

  useEffect(() => {
    if (cameraTarget !== "myroom") return;
    preloadMyRoomAssets();
  }, [cameraTarget]);

  return null;
}
