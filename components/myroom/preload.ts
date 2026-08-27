//preload the assets myroom needs the instant we click on it in the menu, same idea as mypc/preload.ts

const MYROOM_URLS = [
  "/myroom/myroom_wip.gif",
  "/sound/myroom/404.mp3",
  "/sound/myroom/spin.mp3",
  "/sound/myroom/fart.mp3",
];

let assetsPreloaded = false;

export function preloadMyRoomAssets() {
  if (assetsPreloaded) return;
  assetsPreloaded = true;
  for (const url of MYROOM_URLS) {
    fetch(url).then((res) => res.blob()).catch(() => {});
  }
}
