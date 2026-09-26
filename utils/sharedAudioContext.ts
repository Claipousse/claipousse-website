//single shared AudioContext for the whole site, used by backgroundMusic.tsx and mypcBootSound.ts
//having 2 separate realtime AudioContext instances running at once was suspected of causing audio glitches after a while

"use client";

let ctx: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}
