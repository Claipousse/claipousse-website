//what each element of the board do : which polaroid open which links, seperated from the rest in order to modify the content if needed easily
import { ModelHotspot } from "@/components/three/3DModel";
export const LINKS_BOARD_SCALE = (1.7 * 6 * 0.7) / 0.85;
export const LINKS_BACK_NODE_NAME = "postit_5";

// names Photo_n were attributed when i created the 3d model link myself it cannot be modified in the code
export const LINKS_POLAROID_LINKS: { materialName: string; url: string }[] = [
  { materialName: "Photo_1", url: "https://github.com/Claipousse" },
  { materialName: "Photo_2", url: "https://discord.com/users/609413089938505728" },
  { materialName: "Photo_3", url: "https://www.tiktok.com/@claipousse" },
  { materialName: "Photo_4", url: "https://steamcommunity.com/id/claipousse" },
];

export const LINKS_POLAROID_TARGETS: string[] = LINKS_POLAROID_LINKS.map(({ materialName }) => materialName);

//click on a link = on a new tab
function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
export function buildLinksHotspot(onClose: () => void): ModelHotspot[] {
  return [
    { nodeName: LINKS_BACK_NODE_NAME, onClick: onClose },
    ...LINKS_POLAROID_LINKS.map(({ materialName, url }) => ({
      materialName,
      onClick: () => openInNewTab(url),
    })),
  ];
}