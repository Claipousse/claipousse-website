"use client";
//intro behavious code, know if the user passed the intro or not (entered bool), and when, the intro animation is based on enteredAt rather than a serie of timers

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { MUSIC_ICON_DELAY } from "./introTiming";

interface IntroCtx {entered: boolean; 
  enteredAt: number | null; //start timer
  interactive: boolean; //only at the end of the animation : when music on/off button is here
  enter: () => void;
}

const Ctx = createContext<IntroCtx>(null!);
export const useIntro = () => useContext(Ctx);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [enteredAt, setEnteredAt] = useState<number | null>(null); //null = not entered yet
  const [interactive, setInteractive] = useState(false);
  const enter = useCallback(() => setEnteredAt((t) => t ?? performance.now()), []); //2nd click doesnt restart the intro, only set enteredat if nul
  useEffect(() => {
    if (enteredAt === null) return;
    const t = setTimeout(() => setInteractive(true), MUSIC_ICON_DELAY * 1000); //interactive after the delay, music icon is 2.98s
    return () => clearTimeout(t);
  }, [enteredAt]);
  const value = useMemo(
    () => ({ entered: enteredAt !== null, enteredAt, interactive, enter }),
    [enteredAt, interactive, enter],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
