//1 xylophone sample pitched into 6 notes via playbackrate, spawn gives each model its own note
"use client";
import { isSfxOn } from "./sfx";

const NOTE_SRC = "/sound/spawn3D.mp3";
const NOTE_COUNT = 6;
const RATE_START = 0.8;
const RATE_STEP = 0.12; //0.8 to 1.4

function playNote(i: number) {
  if (!isSfxOn()) return;
  const audio = new Audio(NOTE_SRC);
  audio.preservesPitch = false; //without this the browser auto-corrects pitch back, rate would only change speed
  audio.playbackRate = RATE_START + i * RATE_STEP;
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playGallerySpawnNote(spawnIndex: number) {
  playNote(spawnIndex % NOTE_COUNT); //each model always gets the same dedicated note
}
