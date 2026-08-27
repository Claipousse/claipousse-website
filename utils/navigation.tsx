//useful to know where we are when navigating, since there is not subpage claipousse/..., useful to know what to use and show easily

"use client";
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { SLIDE_DURATION, ZOOM_DURATION, CLOSE_FADE_DURATION, GALLERY_CLOSE_DURATION, LINKS_CLOSE_DURATION, MYROOM_CLOSE_DURATION } from "./transitionTiming";

export type View = "menu" | "gallery" | "links" | "mypc" | "myroom"; //5 possibles locations
export type CameraTarget = View | "mypc-closing" | "gallery-closing" | "links-closing" | "myroom-closing"; //closing animation are also a location
export type Category = "cats" | "cooking" | "cs" | "gardening" | "other"; //inside gallery

interface NavigationCtx {
  view: View; //only change AFTER a transition
  cameraTarget: CameraTarget; //what location we aim
  transitioning: boolean; //true while transitionning
  category: Category | null; //active one
  goToGallery: () => void;
  goToLinks: () => void;
  goToMyPc: () => void;
  goToMyRoom: () => void;
  goToMenu: () => void;
  closeMyPc: () => void;
  closeGallery: () => void;
  closeLinks: () => void;
  closeMyRoom: () => void;
  goToCategory: (cat: Category) => void;
  closeCategory: () => void;
}

const Ctx = createContext<NavigationCtx>(null!);
export const useNavigation = () => useContext(Ctx);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("menu");
  const [cameraTarget, setCameraTarget] = useState<CameraTarget>("menu");
  const [transitioning, setTransitioning] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const enterHub = useCallback((to: View) => {
    if (view !== "menu" || transitioning) return; //cancel if already transitionning or if not in a menu
    setCameraTarget(to);
    setTransitioning(true); //lock to block all other animation
    setTimeout(() => { setView(to); setTransitioning(false); }, SLIDE_DURATION * 1000); //x1000 because js expect ms
  }, [view, transitioning]);

  const closeHub = useCallback(( //a closing animation is like entering but reverse
    from: View,
    closing: CameraTarget,
    duration: number,
    clearCategory = false,
  ) => {
    if (view !== from || transitioning) return;
    setTransitioning(true);
    setCameraTarget(closing);
    setTimeout(() => {
      if (clearCategory) setCategory(null);
      setCameraTarget("menu");
      setView("menu"); //when it end we indicate we are in da menu
      setTransitioning(false);
    }, duration * 1000);
  }, [view, transitioning]);

  //calling enter hub fonction
  const goToGallery = useCallback(() => enterHub("gallery"), [enterHub]);
  const goToLinks = useCallback(() => enterHub("links"), [enterHub]);
  const goToMyPc = useCallback(() => enterHub("mypc"), [enterHub]);
  const goToMyRoom = useCallback(() => enterHub("myroom"), [enterHub]);

  const goToMenu = useCallback(() => {
    if (view === "menu" || transitioning) return;
    setCategory(null);
    setCameraTarget("menu");
    setTransitioning(true);
    setTimeout(() => { setView("menu"); setTransitioning(false); }, SLIDE_DURATION * 1000);
  }, [view, transitioning]);

  //calling closing hub function
  //my pc a bit slower
  const closeMyPc = useCallback(
    () => closeHub("mypc", "mypc-closing", CLOSE_FADE_DURATION + ZOOM_DURATION + SLIDE_DURATION, true),
    [closeHub],
  );
  const closeGallery = useCallback(
    () => closeHub("gallery", "gallery-closing", GALLERY_CLOSE_DURATION),
    [closeHub],
  );
  const closeLinks = useCallback(
    () => closeHub("links", "links-closing", LINKS_CLOSE_DURATION),
    [closeHub],
  );
  const closeMyRoom = useCallback(
    () => closeHub("myroom", "myroom-closing", MYROOM_CLOSE_DURATION),
    [closeHub],
  );

  const goToCategory = useCallback((cat: Category) => {
    setCategory(cat);
  }, []);

  const closeCategory = useCallback(() => {
    setCategory(null);
  }, []);

  const value = useMemo(
    () => ({ view, cameraTarget, transitioning, category, goToGallery, goToLinks, goToMyPc, goToMyRoom, goToMenu, closeMyPc, closeGallery, closeLinks, closeMyRoom, goToCategory, closeCategory }),
    [view, cameraTarget, transitioning, category, goToGallery, goToLinks, goToMyPc, goToMyRoom, goToMenu, closeMyPc, closeGallery, closeLinks, closeMyRoom, goToCategory, closeCategory],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}