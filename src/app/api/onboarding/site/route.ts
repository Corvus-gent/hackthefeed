import { WILD_WONDER } from '@/lib/onboarding/data';
import { hostOf } from '@/lib/onboarding/state';
import { parseSite } from '@/lib/onboarding/site';

// GET /api/onboarding/site?url=drinkwildwonder.com
// Reads a website's homepage on the server and returns its description, socials and products.
// Falls back to the saved Wild Wonder snapshot for the example client (its store rate-limits bots).

const MAX_BYTES = 3_000_000;

// Blocks obvious internal targets. ponytail: hostname check only, no DNS resolution, so a public
// name pointing at a private IP would get through; resolve and check the IP before production use.
function isPublicUrl(url: URL) {
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
  const h = url.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.')) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':') || h.startsWith('[')) return false; // no raw IPs
  return true;
}

export async function GET(request: Request) {
  const raw = (new URL(request.url).searchParams.get('url') ?? '').trim();
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
    const res = await fetch(target.origin + '/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FeedStudioOnboarding/0.1)', Accept: 'text/html' },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (Number(res.headers.get('content-length') ?? 0) > MAX_BYTES) throw new Error('Page too large');
    const html = (await res.text()).slice(0, MAX_BYTES);
    const info = parseSite(html, host, target.origin);
    // A rate-limit page parses to nothing useful; prefer the snapshot when we have one.
    if (saved && info.products.length === 0) return Response.json(saved);
    return Response.json(info);
  } catch {
    if (saved) return Response.json(saved);
    return Response.json({ error: 'We couldn’t read that website. Add the details yourself.' }, { status: 502 });
  }
}
