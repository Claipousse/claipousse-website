//handle all the sounds played when you enter mypc, since there is a lot of sfx and we need to play them at the right time
//we load the sound before playing them to avoid the lag server side or due to bad connection

"use client";

import { BOOT_DELAY } from "./transitionTiming";
import { LOGIN_DURATION } from "@/components/mypc/Boot";
import { isSfxOn } from "./sfx";

//path of sfx
const PC_ON_URL = "/sound/mypc/pc_on.ogg";
const LOADING_URL = "/sound/mypc/loading_screen.ogg";
const PC_LOGON_URL = "/sound/mypc/pc_logon.ogg";
const PC_OFF_URL = "/sound/mypc/pc_off.ogg";

export const PC_LOGON_DURATION = 2;

let ctx: AudioContext | null = null;
const bufferCache = new Map<string, Promise<AudioBuffer>>();

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function loadBuffer(context: AudioContext, url: string): Promise<AudioBuffer> {
  let promise = bufferCache.get(url);
  if (!promise) {
    promise = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => context.decodeAudioData(data));
    bufferCache.set(url, promise);
  }
  return promise;
}

export function playMyPcBootSound(): () => void {
  if (!isSfxOn()) return () => {};
  const context = getContext();
  if (context.state !== "running") void context.resume();
  void loadBuffer(context, PC_OFF_URL);
  //same origin as boot_delay constant is mesured, for the sfx to start playing at the right time
  const t0 = context.currentTime;
  let cancelled = false;
  const sources: AudioBufferSourceNode[] = [];

  Promise.all([loadBuffer(context, PC_ON_URL), loadBuffer(context, LOADING_URL)]).then(
    ([pcOn, loading]) => {
      if (cancelled) return;
      const startAt = t0 + BOOT_DELAY;

      const pcOnSource = context.createBufferSource();
      pcOnSource.buffer = pcOn;
      pcOnSource.connect(context.destination);
      pcOnSource.start(startAt);
      sources.push(pcOnSource);

      const loadingSource = context.createBufferSource();
      loadingSource.buffer = loading;
      loadingSource.connect(context.destination);
      loadingSource.start(startAt + pcOn.duration);
      sources.push(loadingSource);
    },
  );

  loadBuffer(context, PC_LOGON_URL).then((pcLogon) => {
    if (cancelled) return;
    const logonSource = context.createBufferSource();
    logonSource.buffer = pcLogon;
    const logonGain = context.createGain();
    logonGain.gain.value = 0.6;
    logonSource.connect(logonGain).connect(context.destination);
    logonSource.start(t0 + BOOT_DELAY + LOGIN_DURATION);
    sources.push(logonSource);
  });

  return () => {
    cancelled = true;
    sources.forEach((source) => {
      try {
        source.stop();
      } catch {
      }
    });
  };
}
export function playMyPcShutdownSound() {
  if (!isSfxOn()) return;
  const context = getContext();
  if (context.state !== "running") void context.resume();

  loadBuffer(context, PC_OFF_URL).then((pcOff) => {
    const source = context.createBufferSource();
    source.buffer = pcOff;
    source.connect(context.destination);
    source.start();
  });
}