"use client";

import { useNavigation } from "@/utils/navigation";
import { SLIDE_DURATION, ZOOM_DURATION, CLOSE_FADE_DURATION, CLOSE_FADE_OUT_DURATION } from "@/utils/transitionTiming";
//black fade when entering or exiting my pc, zooming or dezooming on the crt screen 3d model
export default function Fade() {
  const { cameraTarget } = useNavigation();
  //deals with both cases
  const isMyPc = cameraTarget === "mypc";
  const isClosing = cameraTarget === "mypc-closing";

  // ternary operator to check if we are closing, if yes anim for the closing, if not means we are entering so we play the other anim its simpler that way
  const transition = isClosing
    ? `opacity ${CLOSE_FADE_OUT_DURATION}s steps(4, jump-end) ${CLOSE_FADE_DURATION}s`
    : `opacity ${ZOOM_DURATION}s ease-in ${SLIDE_DURATION}s`;

  return (
    <div
      style={{ //style for the tungtungfade
        position: "fixed",
        inset: 0,
        background: "#000",
        pointerEvents: "none",
        opacity: isMyPc ? 1 : 0,
        transition,
        zIndex: 40,
      }}
    />
  );
}