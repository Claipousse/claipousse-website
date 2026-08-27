"use client";

/*
 * Gallery hub layout: 6 slots in a hexagon around the point where the
 * gallery icon used to sit in the menu. Two possible layouts (wide and
 * tall); we keep whichever lets the camera stay closest, so the icons
 * show up biggest.
 */
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useMenuLayout, MENU_CAMERA_Z, MENU_FOV } from "../menu/layout";

// wide layout: hexagon lying on its side, one tip left and one right
export const HEX_RADIUS = 1.7; // center -> tip
export const HEX_HALF_HEIGHT = (HEX_RADIUS * Math.sqrt(3)) / 2; // center -> top/bottom side

// tall layout: hexagon standing up, one tip top and one bottom. Its width
// adapts to the viewport, between the two bounds below.
const TALL_TIP_Y = 2.2; // height of the tips
const TALL_MID_RATIO = 0.47; // height of the 4 side slots, × TALL_TIP_Y
const TALL_RADIUS_MAX = HEX_HALF_HEIGHT;
const TALL_RADIUS_MIN = 0.8;

// very slight upsize for narrow/mobile aspects only — Math.min(1, ...) below
// keeps it a no-op at scale===1 (desktop), where menu.scale is capped exactly
// there regardless of viewport width
const MOBILE_ICON_BOOST = 1.12;

const CAMERA_Y_OFFSET = 0.25; // the camera aims a bit below the hub center
const ICON_HALF = 0.425; // half the footprint of an icon
const LABEL_HALF = 0.55; // half the width of a label
const LABEL_DROP = 0.72; // how far the label sits below its icon's center
const EDGE_MARGIN = 0.15; // margin kept at the edge of the viewport

const TAN_HALF_FOV = Math.tan((MENU_FOV * Math.PI) / 360);

// half the viewport height needed for a hub whose farthest slots sit at
// ±radiusY: whichever is more constraining between the top (an icon,
// pulled closer to the edge by the camera offset) and the bottom (its
// label, pushed farther by that same offset)
function halfHeightFor(radiusY: number) {
  return Math.max(
    radiusY + ICON_HALF + CAMERA_Y_OFFSET + EDGE_MARGIN,
    radiusY + LABEL_DROP - CAMERA_Y_OFFSET + EDGE_MARGIN
  );
}

export interface GalleryHubLayout {
  x: number;
  y: number;
  cameraY: number;
  cameraZ: number;
  wide: boolean;
  radius: number;
  midY: number;
  tipY: number;
  iconScale: number;
}

// minimum camera distance for the wide layout: the largest of three
// constraints (menu's rest distance, height, width)
function wideFit(aspect: number) {
  const halfW = HEX_RADIUS + LABEL_HALF + EDGE_MARGIN;
  return Math.max(MENU_CAMERA_Z, halfHeightFor(HEX_HALF_HEIGHT) / TAN_HALF_FOV, halfW / (TAN_HALF_FOV * aspect));
}

// same idea for tall, but the hexagon's width is a variable here: we
// shrink it to fit the viewport rather than pull the camera back
function tallFit(aspect: number) {
  const zForHeight = Math.max(MENU_CAMERA_Z, halfHeightFor(TALL_TIP_Y) / TAN_HALF_FOV);
  const available = zForHeight * TAN_HALF_FOV * aspect - LABEL_HALF - EDGE_MARGIN;
  const radius = Math.min(TALL_RADIUS_MAX, Math.max(TALL_RADIUS_MIN, available));
  const z = Math.max(zForHeight, (radius + LABEL_HALF + EDGE_MARGIN) / (TAN_HALF_FOV * aspect));
  return { z, radius };
}

function hubLayoutFor(hubX: number, hubY: number, width: number, height: number, iconScale: number): GalleryHubLayout {
  const aspect = width / height;
  const wideZ = wideFit(aspect);
  const tall = tallFit(aspect);
  // keep whichever layout lets the camera sit closest, so the icons render
  // biggest on screen
  const wide = wideZ <= tall.z;

  return {
    x: hubX,
    y: hubY,
    cameraY: hubY - CAMERA_Y_OFFSET,
    cameraZ: wide ? wideZ : tall.z,
    wide,
    radius: wide ? HEX_RADIUS : tall.radius,
    midY: wide ? 0 : TALL_TIP_Y * TALL_MID_RATIO,
    tipY: TALL_TIP_Y,
    iconScale,
  };
}

// position of a slot (0..5) relative to the hub center, clockwise from the
// top — both layouts must keep this same ordering
export function hubSlotOffset(slot: number, layout: GalleryHubLayout): [number, number] {
  if (layout.wide) {
    const wideSlots: [number, number][] = [
      [-HEX_RADIUS / 2, HEX_HALF_HEIGHT],
      [HEX_RADIUS / 2, HEX_HALF_HEIGHT],
      [HEX_RADIUS, 0],
      [HEX_RADIUS / 2, -HEX_HALF_HEIGHT],
      [-HEX_RADIUS / 2, -HEX_HALF_HEIGHT],
      [-HEX_RADIUS, 0],
    ];
    return wideSlots[slot];
  }
  const { radius: r, midY: m, tipY: t } = layout;
  const tallSlots: [number, number][] = [
    [0, t],
    [r, m],
    [r, -m],
    [0, -t],
    [-r, -m],
    [-r, m],
  ];
  return tallSlots[slot];
}

export function useGalleryHubLayout(): GalleryHubLayout {
  const menu = useMenuLayout();
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const hubX = menu.corners.gallery[0];
  const hubY = menu.corners.gallery[1];
  return useMemo(
    // menu.scale, not menu.iconScale: the latter bakes in the corner icons'
    // own 1.25x boost (REF_ICON_SCALE), which isn't meant for the hub — using
    // it here inflated every hub icon by 25% even at scale 1 (desktop).
    () => hubLayoutFor(hubX, hubY, width, height, Math.min(1, menu.scale * MOBILE_ICON_BOOST)),
    [hubX, hubY, width, height, menu.scale],
  );
}
