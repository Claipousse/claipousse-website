//define the layout of the main menu : where to place the 4 icons, my claipousse 3d model, the greeting text, depending of the viewport
//all positions/coordinates are in world units at distance MENU_CAMERA_Z

"use client";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { measureWobblyWidth } from "../three/TextAnimation";
import { useT } from "@/utils/traductions";
import { en } from "@/utils/traductions/en";

export const MENU_CAMERA_Z = 6; //distance between scene and camera, higher = far
export const MENU_CAMERA_Y = 0.12;
export const MENU_FOV = 45;

// reference sizes with max width possible, when the viewport become to tight we just reduce this values in order to fit
const REF_CX = 3.2; //horizontal fistance between center and the icons at the corners
const REF_ICON_SCALE = 1.25;
const REF_AVATAR_SCALE = 1.7; //model at the center (claipousse) is x70% bigger on big screen
const REF_AVATAR_Y = 0.4; //model at the center y pos
const REF_LABEL_FONT_SIZE = 0.248; //size of text below model
const REF_GREETING_Y = -0.8; //y pos of the greeting
const REF_GREETING_FONT_SIZE = 0.363; //greeting a bit bigger than others text
const REF_GREETING_CURVATURE = 1
const ICON_HALF = 0.425 * REF_ICON_SCALE; // half of space taken by a model once scaled
const LABEL_DROP = 0.95; // space reserved under a model of the text
const EDGE_X = 0.245; // margin horizontal
const EDGE_TOP = 0.304; //margin top
const EDGE_BOTTOM = 0.385; //margin bottom
const CENTER_SHARE = 0.35; // part reserved for the center icon
const CENTER_CLEARANCE = 0.12; // minimal emptyness between centered icon and the others icon
const AVATAR_HALF_WIDTH = 0.57; // half width taken by the avatar at x1
const AVATAR_TOP = 1.15;
const GREETING_DESCENT = 0.75;
const CORNER_LIFT = 0.12; //offset in up applied to the 4 icons in corner
const CENTER_HEADROOM = 1.2; //avatar is 1.2 bigger than the others icons

// size of the greeting/center text we aim, it can't be higher and if its higher we reduce the font size
// its useful because in french the text is longer, otherwise it would go in the other icons in the border or off screen on mobile
const EN_GREETING_WIDTH = measureWobblyWidth(en.menu.greeting, REF_GREETING_FONT_SIZE);

// size of viewport converted in world unit at menu_camera_Z, only the width depend of the ratio, all the layout is build on this for smaller devices
export const WORLD_HEIGHT = 2 * MENU_CAMERA_Z * Math.tan((MENU_FOV * Math.PI) / 360);

export interface MenuLayout {
  corners: Record<string, [number, number, number]>;
  scale: number;
  iconScale: number;
  labelFontSize: number;
  avatarScale: number;
  avatarY: number;
  greetingY: number;
  greetingFontSize: number;
  greetingText: string;
  greetingCurvature: number;
}

//formula for all the icons/text for their position and size depending of the viewport
function menuLayoutFor(pixelWidth: number, pixelHeight: number, greetingText: string): MenuLayout {
  const aspect = pixelWidth / pixelHeight; //screen ratio
  const halfWidth = (WORLD_HEIGHT * aspect) / 2;
  const halfHeight = WORLD_HEIGHT / 2;
  const scale = Math.min(1, (halfWidth * (1 - CENTER_SHARE)) / (EDGE_X + 2 * ICON_HALF)); //scale of thr icons, 1 default (on big screen), else lower
  const iconHalf = ICON_HALF * scale;
  const cx = Math.min(REF_CX, halfWidth - EDGE_X * scale - iconHalf);
  const tightY = halfHeight - EDGE_BOTTOM - LABEL_DROP;
  const looseY = halfHeight - EDGE_TOP - iconHalf;
  const topY = (tightY + looseY) / 2 + CORNER_LIFT;
  const bottomY = -(tightY + looseY) / 2 + CORNER_LIFT;
  const greetingWidth = measureWobblyWidth(greetingText, REF_GREETING_FONT_SIZE);
  const centerBottom = -REF_GREETING_Y + REF_GREETING_FONT_SIZE * GREETING_DESCENT;
  const corridorFit = (cx - iconHalf) / AVATAR_HALF_WIDTH;
  const bandFit = Math.min((topY - iconHalf - CENTER_CLEARANCE) / AVATAR_TOP,(-bottomY - iconHalf - CENTER_CLEARANCE) / centerBottom);
  const centerScale = Math.min(1, Math.max(corridorFit, bandFit), scale * CENTER_HEADROOM);
  const greetingCeiling = REF_GREETING_FONT_SIZE * centerScale;
  const greetingFontSize = Math.min(greetingCeiling,greetingCeiling * (EN_GREETING_WIDTH / greetingWidth),(REF_GREETING_FONT_SIZE * (halfWidth * 2 - 2 * EDGE_X * scale)) / greetingWidth);

  return {
    corners: {
      mypc: [-cx, topY, 0],
      gallery: [cx, topY, 0],
      links: [cx, bottomY, 0],
      myroom: [-cx, bottomY, 0],
    },
    scale,
    iconScale: REF_ICON_SCALE * scale,
    labelFontSize: REF_LABEL_FONT_SIZE * scale,
    avatarScale: REF_AVATAR_SCALE * centerScale,
    avatarY: REF_AVATAR_Y * centerScale,
    greetingY: REF_GREETING_Y * centerScale,
    greetingFontSize,
    greetingText,
    greetingCurvature: REF_GREETING_CURVATURE,
  };
}

export function useMenuLayout(): MenuLayout {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const t = useT();
  return useMemo(
    () => menuLayoutFor(width, height, t.menu.greeting),
    [width, height, t.menu.greeting],
  );
}