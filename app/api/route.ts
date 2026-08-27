// call api to get myanimelist (jikan)
// we remove all the anime of the list in the top 10, and then we show all the list in either the "currently watching" or "watched" based on the status i putted on mal
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import manganimeData from "@/data/mypc/manganime.json";

const MAL_LIST_URL = `https://myanimelist.net/animelist/Claipousse/load.json?status=7&offset=0`;
const LIST_REVALIDATE_SECONDS = 60 * 60 * 24; //refresh every 24h (60x60 = 1h)
const RELATIONS_REVALIDATE_SECONDS = 60 * 60 * 24 * 7; //every week (a relations = differents seasons of 1 single show, useful for dr stone for example)
const JIKAN_THROTTLE_MS = 400;
const JIKAN_FETCH_TIMEOUT_MS = 3000;
const FRANCHISE_WALK_BUDGET_MS = 8000;

interface MalListEntry { //each info we fetch
  status: number;
  anime_title: string;
  anime_title_eng: string;
  anime_url: string;
  anime_image_path: string;
  anime_score_val: number;
  anime_id: number;
}

interface JikanRelation {
  relation: string;
  entry: { mal_id: number; type: string }[];
}

function sleep(ms: number) { //we put a delay to avoid the rate-limit of jikan api
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRelationsOnce(malId: number): Promise<number[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`, {
      cache: "no-store",
      signal: AbortSignal.timeout(JIKAN_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const relations: JikanRelation[] = json?.data?.relations ?? [];
    return relations
      .filter((r) => r.relation === "Sequel" || r.relation === "Prequel")
      .flatMap((r) => r.entry)
      .filter((e) => e.type === "anime")
      .map((e) => e.mal_id);
  } catch {
    //jikan can be mame server-side on some id (curl works, fetch doesn't) - retrying won't help its jikan fault, in that case we put that empty and we only eat the cost once rather than on every ids
    return [];
  }
}

//failed research or emptys one goes to the cache, like that some ids that fail everytime cost only 1 call at week (RELATIONS_REVALIDATE_SECONDS) rather than one every requests
const getCachedRelations = unstable_cache(fetchRelationsOnce, ["manganime-relations"], {
  revalidate: RELATIONS_REVALIDATE_SECONDS,
});

// putting 1 season in the favorites remove all the others one from the others list, useful for dr stone as i said before
async function expandFranchiseIds(seedIds: number[]): Promise<Set<number>> {
  const visited = new Set(seedIds);
  const queue = [...seedIds];
  const deadline = Date.now() + FRANCHISE_WALK_BUDGET_MS;
  while (queue.length > 0 && Date.now() < deadline) {
    const id = queue.shift()!;
    const startedAt = Date.now();
    const relatedIds = await getCachedRelations(id);
    for (const relatedId of relatedIds) {
      if (!visited.has(relatedId)) {
        visited.add(relatedId);
        queue.push(relatedId);
      }
    }
    const hitNetwork = Date.now() - startedAt > 50;
    if (hitNetwork && queue.length > 0) {
      await sleep(JIKAN_THROTTLE_MS);
    }
  }
  return visited;
}

function toEntry(entry: MalListEntry) {
  return {
    // we want english name, not japanese because we are not a kikoojap as the french say
    title: entry.anime_title_eng || entry.anime_title,
    image: entry.anime_image_path,
    url: `https://myanimelist.net${entry.anime_url}`,
    score: entry.anime_score_val //unused rn, maybe later in some update
  };
}

export async function GET() {
  let res: Response;
  try {
    res = await fetch(MAL_LIST_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; claipousse-website)" },
      next: { revalidate: LIST_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return NextResponse.json({ error: "failed to fetch MAL list" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "failed to fetch MAL list" }, { status: 502 });
  }

  const entries: MalListEntry[] = await res.json();

  const watchingEntries = entries.filter((e) => e.status === 1);
  const completedEntries = entries.filter((e) => e.status === 2);

  const top10AnimeIds = manganimeData.top10
    .filter((item) => item.type === "anime")
    .map((item) => item.malId);
  const watchingIds = watchingEntries.map((e) => e.anime_id);

  const excludeIds = await expandFranchiseIds([...top10AnimeIds, ...watchingIds]);
  for (const id of manganimeData.extraExcludeMalIds ?? []) {
    excludeIds.add(id);
  }

  const watching = watchingEntries.map(toEntry).sort((a, b) => a.title.localeCompare(b.title));
  const rest = completedEntries
    .filter((e) => !excludeIds.has(e.anime_id))
    .map(toEntry)
    .sort((a, b) => a.title.localeCompare(b.title));

  return NextResponse.json({ watching, rest });
}