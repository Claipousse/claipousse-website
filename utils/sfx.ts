//on/off flag for all the click/hover sfx across the site (separate from the background music), same localstorage idea as backgroundMusic.tsx

"use client";
import { useEffect, useState } from "react";

export const SFX_STORAGE_KEY = "sfx";

function remember(value: "on" | "off") {
  try {
    localStorage.setItem(SFX_STORAGE_KEY, value);
  } catch {}
}

function recall(): string | null {
  try {
    return localStorage.getItem(SFX_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isSfxOn(): boolean {
  return recall() !== "off";
}

export function setSfxOn(value: boolean) {
  remember(value ? "on" : "off");
}

export function useSfx() {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(isSfxOn()), []);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      setSfxOn(next);
      return next;
    });
  };

  return { on, toggle };
}
