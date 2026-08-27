//background follow the navigation between hubs but not the mouse, we already got the camera moving
"use client";
import { useEffect, useRef } from "react";
import { useNavigation, CameraTarget } from "@/utils/navigation";
import { SLIDE_DURATION } from "@/utils/transitionTiming";

//slightly zoomed in order to not be outside the image when moving the mouse because of the parallax
const VIDEO_SCALE = 1.06;
const MAX_SHIFT_PERCENT = 50 * (VIDEO_SCALE - 1);

//offset background for everyhub based on where they are to simulate a movement when sliding, scaled to not exceed MAX_SHIFT_PERCENT
const HUB_OFFSETS: Record<CameraTarget, { x: number; y: number }> = {
  menu: { x: 0, y: 0 },
  gallery: { x: 1, y: 1.65 / 3.2 },
  links: { x: 1, y: -1.15 / 3.2 },
  mypc: { x: -1, y: 1.65 / 3.2 },
  myroom: { x: -1, y: -1.15 / 3.2 },
  // when closing we go to the origin point which is center of the main menu
  "gallery-closing": { x: 0, y: 0 },
  "links-closing": { x: 0, y: 0 },
  "mypc-closing": { x: 0, y: 0 },
  "myroom-closing": { x: 0, y: 0 },
};

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

//exported before the gallery list also draw its own copy of the background and we need the same scaling to avoid it being different between the originl and the copy
export function backdropTransform(target: CameraTarget): string {
  const hub = HUB_OFFSETS[target];
  const x = clamp(hub.x * MAX_SHIFT_PERCENT, MAX_SHIFT_PERCENT);
  const y = clamp(-hub.y * MAX_SHIFT_PERCENT, MAX_SHIFT_PERCENT);
  return `translate3d(${x}%, ${y}%, 0) scale(${VIDEO_SCALE})`;
}

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraTarget } = useNavigation();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transform = backdropTransform(cameraTarget);
    }
  }, [cameraTarget]);

  return (
    <video ref={videoRef} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover" style={{ zIndex: -1, transform: `scale(${VIDEO_SCALE})`, transition: `transform ${SLIDE_DURATION}s ease-in-out`, willChange: "transform", backfaceVisibility: "hidden", pointerEvents: "none" }}>
      <source src="/background.webm" type="video/webm" />
    </video>
  );
}