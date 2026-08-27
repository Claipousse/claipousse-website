"use client";
//assemble the board : chose what model and size to use depending of the device/resolution, pass all to Transition who handle animation/transition of the zoom
import { RefObject } from "react";
import { useThree } from "@react-three/fiber";
import Transition from "./Transition";
import {
  LINKS_MODEL_PATH,
  LINKS_MODEL_PATH_MOBILE,
  LINKS_MODEL_ROTATION,
  LINKS_MODEL_ROTATION_MOBILE,
  LINKS_VERTICAL_AMPL_MULT,
  linksBoardScale,
  linksIconScale,
} from "./layout";
import { useMenuLayout } from "../menu/layout";
import { LINKS_POLAROID_TARGETS, buildLinksHotspot } from "./links";
import { useDeviceTier } from "@/utils/deviceCapabilities";
import { useNavigation } from "@/utils/navigation";
import { useIntro } from "@/utils/intro";

interface Props {phaseOffset: number;hoverBounce?: RefObject<{ value: number }>;onHoverStart?: () => void;}

export default function Setup({ phaseOffset, hoverBounce, onHoverStart }: Props) {
  const { view, cameraTarget, goToLinks, closeLinks } = useNavigation();
  const { interactive } = useIntro();
  const { size } = useThree();
  const tier = useDeviceTier();
  const mobile = tier === "mobile";
  // busy = still doing the transition, settled = its tungtung good now
  //links become interactive only when settled, to avoid missclick while the animation of zoom/dezoom is doing
  const busy = cameraTarget === "links" || cameraTarget === "links-closing";
  const settled = cameraTarget === "links" && view === "links";

  const menu = useMenuLayout();
  const boardScale = linksBoardScale(tier, size.width, size.height);
  const iconScale = linksIconScale(tier, menu.iconScale);

  return (
    <Transition
      path={mobile ? LINKS_MODEL_PATH_MOBILE : LINKS_MODEL_PATH}
      rotation={mobile ? LINKS_MODEL_ROTATION_MOBILE : LINKS_MODEL_ROTATION}
      boardScaleMult={boardScale}
      restRatio={iconScale / boardScale}
      linksOpen={cameraTarget === "links"}
      frozen={busy}
      verticalAmplMult={LINKS_VERTICAL_AMPL_MULT}
      phaseOffset={phaseOffset}
      onClick={view === "menu" && interactive ? goToLinks : undefined}
      hotspot={settled ? buildLinksHotspot(closeLinks) : undefined}
      revealTargets={LINKS_POLAROID_TARGETS}
      hoverBounce={hoverBounce}
      onHoverStart={onHoverStart}
    />
  );
}