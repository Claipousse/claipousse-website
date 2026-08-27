//.glb behaviour, biggest file in da project
// deals with normalization of size, idling animation floating, connection for click, hover, etc
//every 3d model .glb of the website use this

"use client";
import { useRef, useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle, RefObject } from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createHoverBounce,
  integrateHoverBounce,
  HOVER_REST,
  HOVER_PLATEAU,
} from "@/utils/animation";

export const TARGET_SIZE = 0.85; //every model is normalized to a cube of this size before scaleMult, so icons stay consistent no matter the .glb's original scale
const WHITE_COLOR = new THREE.Color(1, 1, 1); //buffer color for the reveal fade below, avoids allocating one every frame
const HIT_CENTER = new THREE.Vector3(); //buffer for the hover test, same reason
const HOVER_HIT_EXPAND = 1.35; //exit hitbox bigger than entry one, hysteresis so a pointer sitting right on the edge doesn't flicker in/out
const HIT_GEOMETRY = new THREE.SphereGeometry(1, 8, 6);
const HIT_MATERIAL = new THREE.MeshBasicMaterial({transparent: true,opacity: 0,depthWrite: false,});

export type ModelHotspot = { nodeName?: string; materialName?: string; onClick: () => void }; //nodeName: hit mesh or any parent; materialName: only the hit mesh's own material

interface Props {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scaleMult?: number;
  interactive?: boolean;
  verticalAmplMult?: number;
  phaseOffset?: number;
  onClick?: () => void;
  spinning?: boolean; //true: fast rotation, no floating (gallery transition)
  noHoverEffect?: boolean; //true: no zoom on hover, no cursor-enter/leave events
  holdHover?: boolean; //locks the hover bounce at its current size — a clicked icon flying off keeps its zoom instead of shrinking once no longer hoverable
  bounceHover?: boolean; //true: overshoot/undershoot spring on hover instead of a plain lerp
  bounceStrength?: number; //scales bounceHover's amplitude without touching timing — 1 = main menu icons, less = softer (gallery hub)
  frozen?: boolean; //locks the idle float, unless wobbleBlend below says otherwise
  wobbleBlend?: RefObject<{ value: number }>; //while frozen, float to blend back in (0 rigid, 1 full), for easing into rest instead of snapping
  hotspot?: ModelHotspot[]; //per-zone click targets, independent of interactive/onClick above, with their own cursor-enter/leave
  hoverBounce?: RefObject<{ value: number }>; //exposes the icon's current hover scale so the label below follows the same bounce, ref same reason as wobbleBlend
  onHoverStart?: () => void; //fires once when hover begins, not on every pointer move while already hovered
  reveal?: { progress: RefObject<{ value: number }>; targets: string[] }; //named materials fade from their baked dark tint (0) to full-lit texture (1), ref same reason as wobbleBlend
  hitRadiusMult?: number; //shrinks the hover sphere without resizing the model — sphere is sized off the LARGEST axis
  fitRotated?: boolean; //normalizes scale AFTER rotation instead of before, for callers with several fixed-rotation models wanting consistent silhouettes (e.g. HeaderModel)
}

export interface Model3DHandle { //exposes the model live orientation, screenmodel read it on click to animate from the current pose
  getWorldQuaternion: (target: THREE.Quaternion) => THREE.Quaternion;
}

//the hit object is always a mesh nested under the named node so we walk up
function isDescendantNamed(obj: THREE.Object3D | null, name: string): boolean {
  let o = obj;
  while (o) {
    if (o.name === name) return true;
    o = o.parent;
  }
  return false;
}

// first hotspot whose zone contains the hit object, materialName tests the hit mesh's material, nodeName tests the whole parent chain
function findHotspot<T extends { nodeName?: string; materialName?: string }>(
  obj: THREE.Object3D | null,
  hotspots: T[]
): T | null {
  if (!obj) return null;
  for (const spec of hotspots) {
    if (spec.materialName) {
      if (obj instanceof THREE.Mesh && !Array.isArray(obj.material) && obj.material.name === spec.materialName) return spec;
    } else if (spec.nodeName && isDescendantNamed(obj, spec.nodeName)) {
      return spec;
    }
  }
  return null;
}

const Model3D = forwardRef<Model3DHandle, Props>(function Model3D({
  path,
  position,
  rotation,
  scaleMult = 1,
  interactive = false,
  verticalAmplMult = 1,
  phaseOffset = 0,
  onClick,
  spinning = false,
  noHoverEffect = false,
  holdHover = false,
  bounceHover = false,
  bounceStrength = 1,
  frozen = false,
  wobbleBlend,
  hoverBounce,
  hotspot,
  reveal,
  hitRadiusMult = 1,
  fitRotated = false,
  onHoverStart,
}, ref) {
  const { scene: cachedScene } = useGLTF(path);
  const scene = useMemo(() => cachedScene.clone(true), [cachedScene]); // useGLTF caches by path, we clone for a per-instance Object3D
  useImperativeHandle(ref, () => ({
    getWorldQuaternion: (target: THREE.Quaternion) => scene.getWorldQuaternion(target),
  }), [scene]);
  const idleGroupRef = useRef<THREE.Group>(null);
  const dragGroupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const bounceState = useRef(createHoverBounce());
  const [hovered, setHovered] = useState(false);
  const [hotspotHovered, setHotspotHovered] = useState(false);
  const hoveredRef = useRef(hovered); // read on unmount for the real value, not the one captured when the effect was set up
  hoveredRef.current = hovered;
  const hotspotHoveredRef = useRef(hotspotHovered);
  hotspotHoveredRef.current = hotspotHovered;
  const scaleVec = useRef(new THREE.Vector3());
  const spinAngle = useRef(0);
  const revealMaterialsRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});
  const revealOriginalMapsRef = useRef<Record<string, THREE.Texture | null>>({});
  const revealDarkColorsRef = useRef<Record<string, THREE.Color>>({});
  const revealTargetNames = reveal ? reveal.targets.join(",") : "";
  useMemo(() => {
    if (!revealTargetNames) return;
    const names = new Set(revealTargetNames.split(","));

    const originalMaps: Record<string, THREE.Texture | null> = {}; //read the cached scene, never mutated else React dev mode double call would clone an already detached clone
    cachedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || Array.isArray(obj.material)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (names.has(mat.name) && !(mat.name in originalMaps)) originalMaps[mat.name] = mat.map;
    });

    const materials: Record<string, THREE.MeshStandardMaterial> = {};
    const darkColors: Record<string, THREE.Color> = {};
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || Array.isArray(obj.material)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (names.has(mat.name) && !materials[mat.name]) {
        const cloned = mat.clone();
        cloned.map = null;
        obj.material = cloned;
        materials[mat.name] = cloned;
        darkColors[mat.name] = cloned.color.clone();
      }
    });
    revealMaterialsRef.current = materials;
    revealOriginalMapsRef.current = originalMaps;
    revealDarkColorsRef.current = darkColors;
  }, [scene, cachedScene, revealTargetNames]);

  const hasHotspot = !!hotspot;
  const hadHotspot = useRef(false); //value from the PREVIOUS pass, hasHotspot is already up to date by the time the effect runs
  useEffect(() => {
    if (hasHotspot) {
      hadHotspot.current = true;
      window.dispatchEvent(new Event(hotspotHovered ? "cursor-enter" : "cursor-leave"));
      return;
    }
    if (hadHotspot.current && hotspotHovered) {
      window.dispatchEvent(new Event("cursor-leave"));
      setHotspotHovered(false);
    }
    hadHotspot.current = false;
  }, [hotspotHovered, hasHotspot]);

  useEffect(() => {
    if (noHoverEffect && hovered) {
      setHovered(false);
      window.dispatchEvent(new Event("cursor-leave"));
    }
  }, [noHoverEffect, hovered]);

  //same idea for the bounce an icon unmounted mid zoom can leave its label behind so we give it back its rest scale
  useEffect(() => {
    if (!hoverBounce) return;
    const bounce = hoverBounce.current;
    return () => { bounce.value = HOVER_REST; };
  }, [hoverBounce]);

  // 3rd case = gallery icons remount under a fresh key on every entry/exit so clicking one without moving the mouse unmount it midhover
  useEffect(() => {
    return () => {
      if (hoveredRef.current || hotspotHoveredRef.current) {
        window.dispatchEvent(new Event("cursor-leave"));
      }
    };
  }, []);

  const { maxDim, center } = useMemo(() => {
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    // measured before rotation otherwise two instances rotated differently would normalize to different scales =jump between them
    scene.rotation.set(0, 0, 0);
    scene.updateMatrixWorld(true);
    const unrotatedSize = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    const unrotatedMaxDim = Math.max(unrotatedSize.x, unrotatedSize.y, unrotatedSize.z);

    // centering always needs the rotated box, a tilted model world center isnt the same point as the upright model
    scene.rotation.set(rotation?.[0] ?? 0, rotation?.[1] ?? 0, rotation?.[2] ?? 0);
    scene.updateMatrixWorld(true);
    const rotatedBox = new THREE.Box3().setFromObject(scene);
    const center = rotatedBox.getCenter(new THREE.Vector3());

    let maxDim = unrotatedMaxDim; //fitrotated normalize on the rotated box instead, so TARGET_SIZE lands on the silhouette actually shown
    if (fitRotated) {
      const rotatedSize = rotatedBox.getSize(new THREE.Vector3());
      maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z);
    }

    scene.traverse((obj) => { obj.frustumCulled = false; }); //avoid a model under an animated group getting wrongly culled midtransition

    return { maxDim, center };
  }, [scene, rotation, fitRotated]);

  useMemo(() => {
    if (maxDim > 0) {
      const s = (TARGET_SIZE * scaleMult) / maxDim;
      scene.scale.setScalar(s);
      scene.position.set(-center.x * s, -center.y * s, -center.z * s);
    }
  }, [scene, scaleMult, maxDim, center]);

  useFrame((state, delta) => {
    if (!idleGroupRef.current) return;

    const t = state.clock.elapsedTime;
    const p = phaseOffset;

    if (spinning) {
      spinAngle.current += delta * 18; //fast rotation ~900ms
      idleGroupRef.current.rotation.y = spinAngle.current;
      idleGroupRef.current.rotation.x = 0;
      idleGroupRef.current.rotation.z = 0;
      idleGroupRef.current.position.y = 0;
    } else {
      spinAngle.current = 0; //resets clean for da next transition

      //always computed for the current instant: wobbleblend raised during a freeze thus follows the real value no catch-up needed once unfrozen
      const rotY = Math.sin(t * 0.41 + p) * 0.22 + Math.sin(t * 0.73 + p * 1.4) * 0.14 + Math.sin(t * 1.17 + p * 0.6) * 0.09;
      const rotX = Math.sin(t * 0.29 + p * 1.7) * 0.13 + Math.sin(t * 0.83 + p * 0.9) * 0.08 + Math.sin(t * 1.31 + p * 1.1) * 0.05;
      const rotZ = Math.sin(t * 0.53 + p * 1.2) * 0.10 + Math.sin(t * 0.97 + p * 0.8) * 0.06;
      const posY = (Math.sin(t * 0.37 + p) * 0.06 + Math.sin(t * 0.71 + p * 1.3) * 0.03) * verticalAmplMult;

      const blend = frozen ? THREE.MathUtils.clamp(wobbleBlend?.current?.value ?? 0, 0, 1) : 1; // full amplitude when not frozen, 0 by default while frozen

      idleGroupRef.current.rotation.y = rotY * blend;
      idleGroupRef.current.rotation.x = rotX * blend;
      idleGroupRef.current.rotation.z = rotZ * blend;
      idleGroupRef.current.position.y = posY * blend;
    }

    //driven by its own external progress runs no matter frozen/spinning/rest
    if (revealTargetNames) {
      const progress = THREE.MathUtils.clamp(reveal?.progress.current?.value ?? 0, 0, 1);
      const materials = revealMaterialsRef.current;
      const originalMaps = revealOriginalMapsRef.current;
      const darkColors = revealDarkColorsRef.current;
      for (const name of Object.keys(materials)) {
        const mat = materials[name];
        const wantMap = progress > 0 ? originalMaps[name] : null; //fully detached at 0, not just darkened
        if (mat.map !== wantMap) {
          mat.map = wantMap;
          mat.needsUpdate = true;
        }
        mat.color.copy(darkColors[name]).lerp(WHITE_COLOR, progress);
      }
    }

    const isHovered = !noHoverEffect && hovered; //holdHover = we stop touching scale it stays wherever the pointer last left it
    if (holdHover) {
      // nothing to do three keeps the last scale
    } else if (bounceHover) {
      idleGroupRef.current.scale.setScalar(
        integrateHoverBounce(bounceState.current, isHovered, bounceStrength, t, delta)
      );
    } else {
      const s = isHovered ? HOVER_PLATEAU : HOVER_REST;
      idleGroupRef.current.scale.lerp(scaleVec.current.set(s, s, s), 0.1);
    }
    if (hoverBounce) hoverBounce.current.value = idleGroupRef.current.scale.x; //read here so the label follows, written before its own useframe
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    isDragging.current = true;
    lastPointer.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };

    const onMove = (ev: PointerEvent) => {
      if (!isDragging.current || !dragGroupRef.current) return;
      const dx = ev.clientX - lastPointer.current.x;
      const dy = ev.clientY - lastPointer.current.y;
      lastPointer.current = { x: ev.clientX, y: ev.clientY };
      dragGroupRef.current.rotation.y += dx * 0.01;
      dragGroupRef.current.rotation.x += dy * 0.01;
    };

    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [interactive]);

  const hitRadius = TARGET_SIZE * scaleMult * 0.55 * hitRadiusMult;

  //entry decided here rather than via onPointerEnter, for a tighter threshold
  //than the actual hit mesh — ray-to-center distance, not the hit point itself
  const handleHoverMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (hoveredRef.current) return;
    if (e.ray.distanceToPoint(e.object.getWorldPosition(HIT_CENTER)) > hitRadius) return;
    setHovered(true);
    window.dispatchEvent(new Event("cursor-enter"));
    onHoverStart?.();
  }, [hitRadius, onHoverStart]);

  return (
    <group position={position}>
      <mesh
        geometry={HIT_GEOMETRY}
        material={HIT_MATERIAL}
        scale={hitRadius * HOVER_HIT_EXPAND}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
        onPointerMove={noHoverEffect ? undefined : handleHoverMove} //whole handler cut off, hovzred stays false, never goes stale
        onPointerLeave={() => {
          setHovered(false);
          if (!noHoverEffect) window.dispatchEvent(new Event("cursor-leave"));
        }}
      />
      <group ref={idleGroupRef}>
        <group ref={dragGroupRef}>
          <primitive
            object={scene}
            onPointerMove={hotspot ? (e: ThreeEvent<PointerEvent>) => {
              //without stopPropagation, r3f sends the event to everything the
              //ray hits next (ex:the board behind the post-it)
              e.stopPropagation();
              setHotspotHovered(!!findHotspot(e.object, hotspot));
            } : undefined}
            onPointerOut={hotspot ? () => setHotspotHovered(false) : undefined}
            onClick={hotspot ? (e: ThreeEvent<MouseEvent>) => {
              const match = findHotspot(e.object, hotspot);
              if (match) {
                e.stopPropagation();
                match.onClick();
              }
            } : undefined}
          />
        </group>
      </group>
    </group>
  );
});

export default Model3D;

// preloaded upfront: total weight is small enough that loading it all now beats a model popping in on first use
for (const model of [
  "main/mypc",
  "main/gallery",
  "main/links_desktop",
  "main/links_mobile",
  "main/myroom",
]) {
  useGLTF.preload(`/3d/${model}.glb`);
}
setTimeout(() => {
  for (const model of [
    "back",
    "gallery/cats",
    "gallery/computer-science",
    "gallery/cooking",
    "gallery/gardening",
    "gallery/other",
  ]) {
    useGLTF.preload(`/3d/${model}.glb`);
  }
}, 400);