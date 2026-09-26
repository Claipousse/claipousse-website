"use client";
import { isSfxOn } from "./sfx";

const NOTE_SRC = "/sound/spawn3D.mp3";
const RATE_START = 0.8;
const RATE_STEP = 0.12;

function playNote(i: number) {
  if (!isSfxOn()) return;
  const audio = new Audio(NOTE_SRC);
  audio.preservesPitch = false;
  audio.playbackRate = RATE_START + i * RATE_STEP;
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playMenuSpawnNote(spawnIndex: number) {
  playNote(spawnIndex);
}
