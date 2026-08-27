//functions to handle the background musics of the website, for the main menu AND mypc, which are however connected by the on/off status
//a huge vibecoded part because i was a lazy fatass for this part and i couldn't make work the buffer and technical stuff

"use client";
import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo, ReactNode } from "react";
import { useNavigation } from "./navigation";
import { useMyPcScreenShowing } from "./mypcScreen";
import { LOGIN_DURATION } from "@/components/mypc/Boot";
import { PC_LOGON_DURATION } from "./mypcBootSound";
import { BOOT_DELAY, CLOSE_FADE_DURATION, MYPC_RETURN_DURATION } from "./transitionTiming";

const TRACKS = { //loopend based on the lengh of each musics
  site: { url: "/sound/music/music_main.ogg", loopEnd: 3474286 / 48000, volume: 0.35 },
  mypc: { url: "/sound/music/music_pc.ogg", loopEnd: 4968312 / 48000, volume: 0.35 },
} as const;

type TrackId = keyof typeof TRACKS;

// music in my pc only play when the intro si done
const MYPC_DELAY = BOOT_DELAY + LOGIN_DURATION + PC_LOGON_DURATION;
const FADE = 0.25;
export const MUSIC_STORAGE_KEY = "bgm"; //memorise if music on/off

// we try to put the on/off value in localstorage, if not possible (ex: private navigation) we handle the error
function remember(value: "on" | "off") {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, value);
  } catch {}
}

function recall(): string | null {
  try {
    return localStorage.getItem(MUSIC_STORAGE_KEY);
  } catch {
    return null;
  }
}

interface MusicCtx {
  playing: boolean;
  loading: boolean;
  failed: boolean;
  toggle: () => void;
  enterFromGate: () => void;
}

const Ctx = createContext<MusicCtx>(null!);
export const useBackgroundMusic = () => useContext(Ctx);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const { cameraTarget } = useNavigation();
  const screenShowing = useMyPcScreenShowing();

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mypcReady, setMypcReady] = useState(false);
  const [seenTarget, setSeenTarget] = useState(cameraTarget);
  const [loaded, setLoaded] = useState(0);

  const ducked = cameraTarget === "mypc" || (cameraTarget === "mypc-closing" && screenShowing);

  if (seenTarget !== cameraTarget) {
    setSeenTarget(cameraTarget);
    if (cameraTarget !== "mypc") setMypcReady(false);
  }

  useEffect(() => {
    if (cameraTarget !== "mypc") return;
    const t = setTimeout(() => setMypcReady(true), MYPC_DELAY * 1000);
    return () => clearTimeout(t);
  }, [cameraTarget]);

  const siteGain = playing && !ducked ? TRACKS.site.volume : 0;
  const mypcGain = playing && mypcReady ? TRACKS.mypc.volume : 0;

  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Partial<Record<TrackId, AudioBuffer>>>({});
  const gainsRef = useRef<Partial<Record<TrackId, GainNode>>>({});
  const sourcesRef = useRef<Partial<Record<TrackId, AudioBufferSourceNode>>>({});
  const suspendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDucked = useRef(ducked);
  const instantStart = useRef(false);

  const rampTo = useCallback((id: TrackId, target: number, seconds: number) => {
    const ctx = ctxRef.current;
    const gain = gainsRef.current[id];
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    if (seconds <= 0) {
      gain.gain.setValueAtTime(target, ctx.currentTime);
      return;
    }
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + seconds);
  }, []);

  const load = useCallback(async (ctx: AudioContext, id: TrackId) => {
    const res = await fetch(TRACKS[id].url);
    if (!res.ok) throw new Error(`${res.status}`);
    buffersRef.current[id] = await ctx.decodeAudioData(await res.arrayBuffer());
    setLoaded((n) => n + 1);
  }, []);

  const start = useCallback((ctx: AudioContext, id: TrackId) => {
    const buffer = buffersRef.current[id];
    if (!buffer || sourcesRef.current[id]) return;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopEnd = TRACKS[id].loopEnd;
    source.connect(gain).connect(ctx.destination);
    source.start();
    gainsRef.current[id] = gain;
    sourcesRef.current[id] = source;
  }, []);

  const stop = useCallback((id: TrackId, seconds: number) => {
    const ctx = ctxRef.current;
    const source = sourcesRef.current[id];
    if (!ctx || !source) return;
    source.stop(ctx.currentTime + seconds);
    sourcesRef.current[id] = undefined;
    gainsRef.current[id] = undefined;
  }, []);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const byNav = wasDucked.current !== ducked;
    wasDucked.current = ducked;
    const instant = instantStart.current;
    instantStart.current = false;
    const siteSeconds = instant ? 0 : byNav ? (ducked ? BOOT_DELAY : MYPC_RETURN_DURATION) : FADE;
    const mypcSeconds = mypcReady ? FADE : CLOSE_FADE_DURATION;

    if (suspendTimer.current) clearTimeout(suspendTimer.current);

    const apply = () => {
      if (mypcGain > 0) start(ctx, "mypc");
      rampTo("site", siteGain, siteSeconds);
      rampTo("mypc", mypcGain, mypcSeconds);
      if (mypcGain === 0) stop("mypc", mypcSeconds);
    };

    if (playing) {
      void ctx.resume().then(apply);
      return;
    }

    apply();
    suspendTimer.current = setTimeout(
      () => void ctx.suspend(),
      Math.max(siteSeconds, mypcSeconds) * 1000,
    );
  }, [siteGain, mypcGain, playing, ducked, mypcReady, loaded, rampTo, start, stop]);

  const open = useCallback((instant = false) => {
    if (loading || ctxRef.current) return;
    setLoading(true);
    instantStart.current = instant;

    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      void ctx.resume();
    } catch {
      setLoading(false);
      setFailed(true);
      return;
    }

    void (async () => {
      try {
        await load(ctx, "site");
        start(ctx, "site");
        if (ctx.state !== "running") await ctx.resume();

        ctxRef.current = ctx;
        setLoading(false);
        setPlaying(true);
        remember("on");
        void load(ctx, "mypc").catch(() => {});
      } catch {
        setLoading(false);
        setFailed(true);
      }
    })();
  }, [loading, load, start]);

  const toggle = useCallback(() => {
    if (loading) return;
    if (ctxRef.current) {
      setPlaying((p) => {
        remember(p ? "off" : "on");
        return !p;
      });
      return;
    }
    open();
  }, [loading, open]);

  const enterFromGate = useCallback(() => {
    if (recall() === "off") return;
    open(true);
  }, [open]);

  const value = useMemo(
    () => ({ playing, loading, failed, toggle, enterFromGate }),
    [playing, loading, failed, toggle, enterFromGate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}