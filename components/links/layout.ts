//size of the links board : the model and rotation and size (in menu and zoomed) to use depending of the device
import { TARGET_SIZE } from "../three/3DModel";
import { MENU_CAMERA_Z, MENU_FOV } from "../menu/layout";
import { LINKS_BOARD_SCALE } from "./links";
import { DeviceTier } from "@/utils/deviceCapabilities";

export const LINKS_MODEL_PATH = "/3d/main/links_desktop.glb";
export const LINKS_MODEL_PATH_MOBILE = "/3d/main/links_mobile.glb";
export const LINKS_MODEL_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0];
export const LINKS_MODEL_ROTATION_MOBILE: [number, number, number] = [-Math.PI / 2, 0, -Math.PI / 2];
export const LINKS_VERTICAL_AMPL_MULT = 0.4;

const FORESHORTEN_COMPENSATION = 1.6; //on desktop the board is very inclined and so look smaller than it really it, we zoom it as much in the menu
const BOARD_SHORT_SIDE = 1.02; //board proportion in world unit 
const BOARD_LONG_SIDE = 1.78;
const BOARD_SCREEN_FILL = 0.92; // size of screen it use when its fully zoomed in (92%)

export function linksIconScale(tier: DeviceTier, menuIconScale: number) {
  return tier === "mobile" ? menuIconScale : menuIconScale * FORESHORTEN_COMPENSATION;
}

export function linksBoardScale(tier: DeviceTier, width: number, height: number) {
  const visibleHeight = 2 * MENU_CAMERA_Z * Math.tan((MENU_FOV * Math.PI) / 360);
  const visibleWidth = (visibleHeight * width) / height;
  const boardWidth = tier === "mobile" ? BOARD_SHORT_SIDE : BOARD_LONG_SIDE;
  const boardHeight = tier === "mobile" ? BOARD_LONG_SIDE : BOARD_SHORT_SIDE;
  const fitted =
    (BOARD_SCREEN_FILL * BOARD_LONG_SIDE * Math.min(visibleWidth / boardWidth, visibleHeight / boardHeight)) /
    TARGET_SIZE;
  return Math.min(LINKS_BOARD_SCALE, fitted);
}