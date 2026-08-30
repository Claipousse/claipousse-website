//preload the icons used in the settings modal (button + music/sfx/language rows) the instant the main menu becomes interactive, same idea as mypc/preload.ts

const SETTINGS_ICON_URLS = [
  "/icons/settings.webp",
  "/icons/sound_on.webp",
  "/icons/sound_off.webp",
  "/icons/fr.webp",
  "/icons/en.webp",
];

let assetsPreloaded = false;

export function preloadSettingsIcons() {
  if (assetsPreloaded) return;
  assetsPreloaded = true;
  for (const url of SETTINGS_ICON_URLS) {
    fetch(url).then((res) => res.blob()).catch(() => {});
  }
}
