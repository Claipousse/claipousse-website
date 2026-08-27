//layout for myroom with the work in progress placeholder and all the texts gif and back icone
"use client";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { measureWobblyWidth, measureWobblyRise } from "../three/TextAnimation";
import { WORLD_HEIGHT } from "../menu/layout";
import { TARGET_SIZE } from "../three/3DModel";
import { useDeviceTier } from "@/utils/deviceCapabilities";

export const GIF_SRC = "/myroom/myroom_wip.gif";
export const GIF_ASPECT = 233 / 210; // cropped to the drawing itself, source file has wide transparent margins
export const SFX_SRC = "/sound/myroom/404.mp3";
export const FART_SFX_SRC = "/sound/myroom/fart.mp3";
export const TITLE_TEXT = "work in progress...";
export const BODY_TEXT = "sorry folks, the process is more time consuming than i expected, come back later";
export const WIP_IMAGE_ALT = "work in progress";
export const BACK_TEXT = "back";
const TITLE_FONT = 0.4; // world units, same reference distance as the menu
const BODY_FONT_RATIO = 0.55;
const CONTENT_WIDTH_MOBILE = 0.92;//makes up for the title shrinking on phone
const BODY_FONT_RATIO_MOBILE = 0.72; //reduced size for phone
const BACK_ICON_SCALE = 0.85;
const BACK_ICON_SCALE_MOBILE = 0.6;
export const BACK_FONT = 0.2;
const BACK_LABEL_GAP = 0.16;
const BACK_LABEL_GAP_MOBILE = 0.12;
const BACK_LABEL_DROP = 0.08;
export const TITLE_CURVATURE = -0.55; // opposite direction from the intro text
export const BODY_CURVATURE = 0.3; // weaker than the title: a strong curve would spread the paragraph's lines apart
const GIF_HEIGHT = 2.4;
const TITLE_GAP = 0.12;
const BODY_GAP = 0.25;
const LINE_HEIGHT = 1.05;
const CONTENT_WIDTH = 0.86;
const BODY_MAX_WIDTH = 5.8;
const BACK_SIDE = 0.32;
const BACK_SIDE_MOBILE = 0.14;
const BACK_TOP = 0.62;
const BACK_TOP_MOBILE = 0.42;
const BOTTOM_MARGIN = 0.2;

export interface MyRoomLayout {
  titleY: number;
  titleFontSize: number;
  gifY: number;
  gifHeight: number;
  bodyLines: string[];
  bodyFontSize: number;
  bodyTopY: number;
  bodyLineStep: number;
  backPosition: [number, number, number];
  backIconScale: number;
  backLabelOffset: [number, number, number];
  backLabelCurvature: number;
  backLabelDrop: number;
}

function wrapLines(text: string, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && measureWobblyWidth(next, fontSize) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  return [...lines, line];
}

function myroomLayoutFor(
  pixelWidth: number,
  pixelHeight: number,
  mobile: boolean,
  titleText: string,
  bodyText: string,
  backText: string,
): MyRoomLayout {
  const halfWidth = (WORLD_HEIGHT * (pixelWidth / pixelHeight)) / 2;
  const maxWidth = 2 * halfWidth * (mobile ? CONTENT_WIDTH_MOBILE : CONTENT_WIDTH);

  //title always on 1 line, if too big it reduce size
  const titleFont = Math.min(
    TITLE_FONT,
    (TITLE_FONT * maxWidth) / measureWobblyWidth(titleText, TITLE_FONT)
  );
  const bodyFont = titleFont * (mobile ? BODY_FONT_RATIO_MOBILE : BODY_FONT_RATIO);
  const bodyLines = wrapLines(bodyText, bodyFont, Math.min(maxWidth, BODY_MAX_WIDTH));
  const titleArc = measureWobblyRise(titleText, titleFont, TITLE_CURVATURE);
  const titleAbove = Math.max(titleArc, 0);
  const titleBelow = Math.max(-titleArc, 0);
  const bodyRise = measureWobblyRise(bodyLines[0], bodyFont, BODY_CURVATURE);
  const lineStep = bodyFont * LINE_HEIGHT + bodyRise;
  const bodyHeight = (bodyLines.length - 1) * lineStep + bodyFont;
  const gifHeight = Math.min(GIF_HEIGHT, (2 * halfWidth * CONTENT_WIDTH) / GIF_ASPECT);
  const backTop = mobile ? BACK_TOP_MOBILE : BACK_TOP;
  const backSide = Math.min(mobile ? BACK_SIDE_MOBILE : BACK_SIDE, halfWidth * 0.12);
  const backIconScale = mobile ? BACK_ICON_SCALE_MOBILE : BACK_ICON_SCALE;
  const backIconSize = TARGET_SIZE * backIconScale;
  const backLabelWidth = measureWobblyWidth(backText, BACK_FONT);
  const backLabelOffset: [number, number, number] = mobile
    ? [backIconSize / 2 + BACK_LABEL_GAP_MOBILE + backLabelWidth / 2, 0, 0.1]
    : [0, -(backIconSize / 2 + BACK_LABEL_GAP + BACK_FONT / 2), 0.1];
  const backBelow = mobile
    ? backIconSize / 2
    : backIconSize / 2 + BACK_LABEL_GAP + BACK_FONT;
  const backX = mobile
    ? -(halfWidth - backSide - backIconSize / 2)
    : -(halfWidth - backSide - Math.max(backIconSize, backLabelWidth) / 2);
  const backRightEdge = mobile
    ? backX + backLabelOffset[0] + backLabelWidth / 2
    : backX + Math.max(backIconSize, backLabelWidth) / 2;
  const titleReachesBack =
    measureWobblyWidth(titleText, titleFont) / 2 > -backRightEdge;
  const topMargin = titleReachesBack ? backTop + backBelow : BOTTOM_MARGIN;
  const total =
    titleAbove + titleFont + titleBelow + TITLE_GAP + gifHeight + BODY_GAP + bodyRise + bodyHeight;
  const available = WORLD_HEIGHT - topMargin - BOTTOM_MARGIN;
  const fit = Math.min(1, available / total);
  let y = WORLD_HEIGHT / 2 - topMargin - (available - total * fit) / 2;
  const titleY = y - (titleAbove + titleFont / 2) * fit;
  y -= (titleAbove + titleFont + titleBelow + TITLE_GAP) * fit;
  const gifY = y - (gifHeight * fit) / 2;
  y -= (gifHeight + BODY_GAP + bodyRise) * fit;
  const bodyTopY = y - (bodyFont * fit) / 2;
  return {
    titleY,
    titleFontSize: titleFont * fit,
    gifY,
    gifHeight: gifHeight * fit,
    bodyLines,
    bodyFontSize: bodyFont * fit,
    bodyTopY,
    bodyLineStep: lineStep * fit,
    backPosition: [backX, WORLD_HEIGHT / 2 - backTop, 0],
    backIconScale,
    backLabelOffset,
    backLabelCurvature: mobile ? 0 : 1,
    backLabelDrop: mobile ? 0 : BACK_LABEL_DROP,
  };
}
export function useMyRoomLayout(): MyRoomLayout {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const mobile = useDeviceTier() === "mobile";
  return useMemo(
    () => myroomLayoutFor(width, height, mobile, TITLE_TEXT, BODY_TEXT, BACK_TEXT),
    [width, height, mobile],
  );
}
export function worldToPixels(world: number, canvasHeight: number): number {
  return (world / WORLD_HEIGHT) * canvasHeight;
}
