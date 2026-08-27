"use client";
const NOTE_SRC = "/sound/spawn3D.mp3";
const NOTE_COUNT = 4;
const RATE_START = 0.8;
const RATE_STEP = 0.12;

let next = 0;

function playNote(i: number) {
  const audio = new Audio(NOTE_SRC);
  audio.preservesPitch = false;
  audio.playbackRate = RATE_START + i * RATE_STEP;
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playMenuSpawnNote(spawnIndex: number) {
  playNote(spawnIndex);
  next = (spawnIndex + 1) % NOTE_COUNT;
}

export function playMenuHoverNote() {
  playNote(next);
  next = (next + 1) % NOTE_COUNT;
}
