//functions to detect if we need to use the desktop or mobile versions of some elements when we need to choose, based on the screen size and the input (digital or mouse), used in several cases
import { useEffect, useState } from "react";

export function isCoarsePointer(): boolean { //true if pointer = touch
  // if no window detected server side, false by default
  if (typeof window === "undefined" || !window.matchMedia) return false; //if no window detected server side, false by default
  return window.matchMedia("(pointer: coarse)").matches;
}

export type DeviceTier = "mobile" | "tablet" | "desktop"; //i abandonned the tablet device so the only 2 are mobile & desktop

//transition thresholds
export const MOBILE_MAX_WIDTH = 768;
export const TABLET_MAX_WIDTH = 1280;

function tierForWidth(width: number): DeviceTier { //we take the current width res of the user and compare to our constant
  if (width < MOBILE_MAX_WIDTH) return "mobile";
  if (width < TABLET_MAX_WIDTH) return "tablet";
  return "desktop";
}

export function useDeviceTier(): DeviceTier {
  //not known width on the server = default to desktop, corrected on the client after mount
  const [tier, setTier] = useState<DeviceTier>(() =>
    typeof window === "undefined" ? "desktop" : tierForWidth(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => setTier(tierForWidth(window.innerWidth));
    onResize(); //correcton
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return tier;
}
