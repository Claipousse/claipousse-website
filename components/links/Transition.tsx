//the animation the board is doing while transitionning to become bigger and take the entire screen
//the polaroid are grey in the menu but became visible when zoomed
//animation when opening & closing are not the same the spring effect is slightly different
//again lot of vibecoded parts, the animations, the manipulation of 3d models and all the maths behind are way ahead my level i feel so lame and so behind in everything

"use client";
import { useRef, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Model3D, { ModelHotspot } from "../three/3DModel";
import { menuChromeScale } from "../scene/Camera";
import { useIntro } from "@/utils/intro";
import { LINKS_GROWTH_DELAY, LINKS_CLOSE_DURATION } from "@/utils/transitionTiming";
import {easeInOut,integrateSpring,ANTICIPATION_DURATION,BOUNCE_STIFFNESS,BOUNCE_DAMPING,} from "@/utils/animation";

const BOING_STIFFNESS = 190; // only used  during growth, same as bounce_stiffness value
const BOING_DAMPING = 10; //lower damping than BOUNCE_DAMPING (11.6), go bigger before settling
const ANTICIPATION_RATIO = 0.6; //60% reducing size of restRatio during ANTICIPATION_DURATION bbefore frowing, opening only
const STRAIGHTEN_DURATION = 0.3; //duration of wobbleBlend -> 0 ramp, triggered at the start of the opening/growth
const HIT_RADIUS_MULT = 0.78; //hitbox for the hover multiplier (reduced)

function rampBlend(since: RefObject<number | null>,from: number,to: number,duration: number,t: number,blend: { value: number },): void {
  if (since.current === null) return;
  const progress = (t - since.current) / duration;
  if (progress >= 1) {
    blend.value = to;
    since.current = null;
    return;
  }
  blend.value = THREE.MathUtils.lerp(from, to, easeInOut(progress));
}

interface Props {
  path: string; //3d model path
  rotation: [number, number, number];
  boardScaleMult: number;
  restRatio: number; // 3d model size when idle, fraction of boardScaleMult
  linksOpen: boolean; //triggered by the opening/growth
  frozen: boolean;
  verticalAmplMult?: number; //amplitude of the vertical flotting movement
  phaseOffset: number;
  onClick?: () => void;
  hotspot?: ModelHotspot[];
  revealTargets: string[];
  hoverBounce?: RefObject<{ value: number }>;
  onHoverStart?: () => void;
}

export default function Transition({
  path,
  rotation,
  boardScaleMult,
  restRatio,
  linksOpen,
  frozen,
  verticalAmplMult,
  phaseOffset,
  onClick,
  hotspot,
  revealTargets,
  hoverBounce,
  onHoverStart,
}: Props) {
  const { interactive } = useIntro();
  const groupRef = useRef<THREE.Group>(null);
  const spring = useRef({ value: restRatio, velocity: 0 });
  const revealProgress = useRef({ value: 0 });
  const wobbleBlend = useRef({ value: 1 }); // 1 = moving, 0 = fixed
  const wasActive = useRef(false);
  const squashUntil = useRef(0); // end of the dezoom before the zoom (momentum)
  const wasOpen = useRef(false);
  const openSince = useRef(0); // remember when the user clicked on the icon
  const straightenSince = useRef<number | null>(null); //remember when the code asked the board to stop bouncing
  const straightenFrom = useRef(1);
  const closingSince = useRef<number | null>(null);
  const closeFrom = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = spring.current;

    if (linksOpen && !wasOpen.current) {
      openSince.current = t;
    }
    wasOpen.current = linksOpen;
    const active = linksOpen && t - openSince.current >= LINKS_GROWTH_DELAY;

    if (active && !wasActive.current) {
      squashUntil.current = t + ANTICIPATION_DURATION;
      s.velocity = 0;
      straightenSince.current = t;
      straightenFrom.current = wobbleBlend.current.value;
      closingSince.current = null;
    } else if (!active && wasActive.current) {
      closingSince.current = t;
      closeFrom.current = wobbleBlend.current.value;
      straightenSince.current = null;
    }
    wasActive.current = active;

    rampBlend(straightenSince, straightenFrom.current, 0, STRAIGHTEN_DURATION, t, wobbleBlend.current);
    rampBlend(closingSince, closeFrom.current, 1, LINKS_CLOSE_DURATION, t, wobbleBlend.current);

    if (active && t < squashUntil.current) {
      // we set up an easeinout instead of east out, to have a more gradual momentum
      const progress = 1 - (squashUntil.current - t) / ANTICIPATION_DURATION;
      const dip = restRatio * ANTICIPATION_RATIO;
      s.value = THREE.MathUtils.lerp(restRatio, dip, easeInOut(progress));
      s.velocity = 0;
    } else {
      integrateSpring(
        s,
        active ? 1 : restRatio,
        active ? BOING_STIFFNESS : BOUNCE_STIFFNESS,
        active ? BOING_DAMPING : BOUNCE_DAMPING,
        delta,
        2,
      );
    }
    const chromeFade = frozen ? 1 : menuChromeScale.value;
    groupRef.current?.scale.setScalar(s.value * chromeFade);
    revealProgress.current.value = active
      ? THREE.MathUtils.clamp((s.value - restRatio) / (1 - restRatio), 0, 1)
      : 0;
  });

  return (
    <group ref={groupRef} rotation={rotation} scale={restRatio}>
      <Model3D
        path={path}
        position={[0, 0, 0]}
        scaleMult={boardScaleMult}
        verticalAmplMult={verticalAmplMult}
        phaseOffset={phaseOffset}
        onClick={onClick}
        hotspot={hotspot}
        hitRadiusMult={HIT_RADIUS_MULT}
        reveal={{ progress: revealProgress, targets: revealTargets }}
        frozen={frozen}
        wobbleBlend={wobbleBlend}
        noHoverEffect={frozen || !interactive}
        bounceHover
        hoverBounce={hoverBounce}
        onHoverStart={onHoverStart}
      />
    </group>
  );
}
