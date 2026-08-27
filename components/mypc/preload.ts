//deals with the preloading of the ressources (images, music, api call for manganime, etc)
//i did it because usually you get a delay the moment you want the ressource and you get it in production (i use vercel)
//since we absolutly don't want delay in our animation i did it that way
// (ps: the loading screen is at first a creative idea i had, not a solution for this problem, but note that it also help in the process lmao)
import videogamesData from "@/data/mypc/videogames.json";
import musicData from "@/data/mypc/music.json";
import manganimeData from "@/data/mypc/manganime.json";

export interface AnimeEntry { //i don't use score rn but maybe i'll integrate it and rank the anime in myanimelist in some later update
  title: string;
  image: string;
  url: string;
  score: number;
}

export interface ManganimeResponse {
  watching: AnimeEntry[];
  rest: AnimeEntry[];
}

//for optimisation we want to avoid to fetch 2 times the same data
let manganimeFetch: Promise<ManganimeResponse> | null = null;

export function fetchManganimeOnce(): Promise<ManganimeResponse> {
  if (!manganimeFetch) {
    manganimeFetch = fetch("/api", { signal: AbortSignal.timeout(25000) }) //more than 25s we give up
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .catch((err) => {
        //we dont put error in cache, next call will retry
        manganimeFetch = null;
        throw err;
      });
  }
  return manganimeFetch;
}

//the order of the preload is depending on their order in the app and how quick we saw them, so first whats on bootscreen, then whats on desktop, then the content of the windows

//step 1 = the image on the bootscreen, since its the first see we saw we want it first
const BOOT_ICON_URL = "/mypc/icons/claipousse.webp";

// step 2 = whats on the desktop (icons)
const DESKTOP_ICON_IDS = ["aboutme", "game", "music", "manganime", "contact", "meowl", "todo", "credits", "help", "shutdown"];
const DESKTOP_ICON_URLS = DESKTOP_ICON_IDS.map((id) => `/mypc/icons/${id}.webp`);

// step 3 content of the windows
const WINDOW_CONTENT_URLS: string[] = [
  "/mypc/contact/frame1.gif",
  "/mypc/contact/frame2.gif",
  "/mypc/contact/mail.gif",
  "/mypc/meowl/meowl.webp",
  "/mypc/meowl/meowl.mp3",
  ...videogamesData.top_games.map((g) => `/mypc/videogames/top_games/${g.filename}`),
  ...videogamesData.currently_playing.map((g) => `/mypc/videogames/currently_playing/${g.filename}`),
  ...videogamesData.other.map((g) => `/mypc/videogames/other/${g.filename}`),
  ...musicData.albums.map((a) => `/mypc/music/${a.filename}`),
  ...manganimeData.top10.map((m) => `/mypc/manganime/${m.filename}`),
];

//we control the download by only doing the next step if the previous is done correctly, and catching errors correctly
function warm(url: string): Promise<unknown> {
  return fetch(url)
    .then((res) => res.blob())
    .catch(() => {});
}

function warmAll(urls: string[]): Promise<unknown> {
  return Promise.all(urls.map(warm));
}

let assetsPreloaded = false;

export function preloadAssets() {
  if (assetsPreloaded) return;
  assetsPreloaded = true;
  Promise.all([document.fonts.load("16px 'Grape Soda'").catch(() => {}), warm(BOOT_ICON_URL)])
    .then(() => warmAll(DESKTOP_ICON_URLS))
    .then(() => {
      //its the slower thing so we do it the last not before
      fetchManganimeOnce().then(preloadMalImages).catch(() => {});
      return warmAll(WINDOW_CONTENT_URLS);
    });
}

// hosted on CDN of myanimelist, unknown while the api call didnt respond
export function preloadMalImages(data: ManganimeResponse) {
  for (const entry of [...data.watching, ...data.rest]) {
    fetch(entry.image).catch(() => {});
  }
}
