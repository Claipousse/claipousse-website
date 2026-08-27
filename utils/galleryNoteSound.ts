//1 xylophone sample pitched into 6 notes via playbackrate, spawn gives each model its own note then hover cycles through the same 6
"use client";
const NOTE_SRC = "/sound/spawn3D.mp3";
const NOTE_COUNT = 6;
const RATE_START = 0.8;
const RATE_STEP = 0.12; //0.8 to 1.4

let next = 0;
let spawnedCount = 0; //notes played by the intro this gallery open, gates hover so it doesnt overlap the intro

function playNote(i: number) {
  const audio = new Audio(NOTE_SRC);
  audio.preservesPitch = false; //without this the browser auto-corrects pitch back, rate would only change speed
  audio.playbackRate = RATE_START + i * RATE_STEP;
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playGallerySpawnNote(spawnIndex: number) {
  if (spawnIndex === 0) spawnedCount = 0; //first icon of a fresh gallery open, reset the gate
  playNote(spawnIndex % NOTE_COUNT); //each model always gets the same dedicated note
  next = (spawnIndex + 1) % NOTE_COUNT; //hover picks up right after the last spawned note
  spawnedCount++;
}

export function playGalleryHoverNote() {
  if (spawnedCount < NOTE_COUNT) return; //intro still playing its own notes, stay quiet
  playNote(next);
  next = (next + 1) % NOTE_COUNT;
}
