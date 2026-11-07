import { cacheLife } from 'next/cache';
import { connection } from 'next/server';
import { OrianeAsset, OrianeSearch, toViralVideo } from '@/lib/onboarding/viral';

// GET /api/onboarding/videos
// Bloom's most viewed videos that show the product on screen, from Oriane.
// Always Bloom for now, whatever competitors the user picked.

const ORIANE = 'https://connect.oriane.xyz/rest';
// Visual match for the product itself; mentions alone also catch videos where Bloom is just tagged.
const PRODUCT_SHOT = 'a person holding a can of Bloom sparkling energy drink';
const BLOOM_HANDLE = 'bloom'; // @bloom on TikTok and Instagram (Bloom Nutrition)

async function oriane(path: string, body: unknown) {
  const key = process.env.ORIANE_API_KEY;
  if (!key) throw new Error('ORIANE_API_KEY is not set');
  const res = await fetch(`${ORIANE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Oriane ${path} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** Cached for an hour: each search spends Oriane credits and the ranking barely moves. */
async function bloomVideos() {
  'use cache';
  cacheLife('hours');
  const assetId = OrianeAsset.parse(await oriane('/assets', { type: 'text', text: PRODUCT_SHOT })).data.id;
  const body = {
    operator: 'and',
    filters: {
      format: { includes: ['video'] },
      visualSimilarity: { includes: { values: [{ assetId, minScore: 0.25 }] } },
    },
    queries: [{
      operator: 'or',
      filters: {
        profileHandle: { exactMatch: { values: [BLOOM_HANDLE] } },
        mentionHandles: { exactMatch: { values: [BLOOM_HANDLE] } },
      },
    }],
  };
  const data = OrianeSearch.parse(await oriane('/contents/search?limit=12&sort=viewsCount:desc', body));
  return data.data.results.map(toViralVideo);
}

export async function GET() {
  await connection(); // never prerender at build time: that would need the API key and spend credits
  try {
    return Response.json({ videos: await bloomVideos() });
  } catch (err) {
    console.error('[onboarding/videos]', err);
    return Response.json({ error: 'Couldn’t load videos from Oriane' }, { status: 502 });
  }
}
