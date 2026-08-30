//behavior of the click sound when clicking a model in the gallery hub
//we alternate between the 3 sounds available without a defined cycle/loop to avoid hearing always the same and to be annoying
"use client";
import { isSfxOn } from "./sfx";

const CLICK_SOUNDS = ["/sound/gallery/click1.mp3", "/sound/gallery/click2.mp3", "/sound/gallery/click3.mp3"]; //paths of the sounds

let next = 0;

export function playGalleryClickSound() {
  if (isSfxOn()) new Audio(CLICK_SOUNDS[next]).play().catch(() => {}); //play to good sfx
  next = (next + 1) % CLICK_SOUNDS.length; //modulo to have a loop from 1 to 3
}