import { WILD_WONDER } from '@/lib/onboarding/data';
import { hostOf } from '@/lib/onboarding/state';
import { isPublicUrl, parseSite } from '@/lib/onboarding/site';

// GET /api/onboarding/site?url=drinkwildwonder.com
// Reads a website's homepage on the server and returns its description, socials and products.
// Falls back to the saved Wild Wonder snapshot for the example client (its store rate-limits bots).

const MAX_BYTES = 512_000; // a homepage's <head> and product grid fit well within this
const MAX_REDIRECTS = 3;

/** Fetches with redirects followed by hand, so every hop passes the same public-host check. */
async function fetchPublic(start: URL, signal: AbortSignal) {
  let url = start;
  for (let hop = 0; ; hop++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HackTheFeedOnboarding/0.1)', Accept: 'text/html' },
      signal,
      redirect: 'manual',
    });
    const location = res.headers.get('location');
    if (res.status < 300 || res.status >= 400 || !location) return res;
    url = new URL(location, url);
    if (hop >= MAX_REDIRECTS || !isPublicUrl(url)) throw new Error('Blocked redirect');
  }
}

/** Reads at most MAX_BYTES of the body, even when the server sends no content-length. */
async function readCapped(res: Response) {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  const bytes = new Uint8Array(Math.min(total, MAX_BYTES));
  let offset = 0;
  for (const c of chunks) {
    const part = c.subarray(0, bytes.length - offset);
    bytes.set(part, offset);
    offset += part.length;
    if (offset >= bytes.length) break;
  }
  return new TextDecoder().decode(bytes);
}

export async function GET(request: Request) {
  const raw = (new URL(request.url).searchParams.get('url') ?? '').trim().slice(0, 300);
  let target: URL;
  try {
    target = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return Response.json({ error: 'Enter a web address, like yourbrand.com' }, { status: 400 });
  }
  if (!isPublicUrl(target)) return Response.json({ error: 'Enter a public web address, like yourbrand.com' }, { status: 400 });

  const host = hostOf(target.hostname);
  const saved = host === WILD_WONDER.host ? WILD_WONDER : null;

  try {
    const res = await fetchPublic(new URL(target.origin + '/'), AbortSignal.timeout(8000));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const info = parseSite(await readCapped(res), host, target.origin);
    // A rate-limit page parses to nothing useful; prefer the snapshot when we have one.
    if (saved && info.products.length === 0) return Response.json(saved);
    return Response.json(info);
  } catch {
    if (saved) return Response.json(saved);
    return Response.json({ error: 'We couldn’t read that website. Add the details yourself.' }, { status: 502 });
  }
}
