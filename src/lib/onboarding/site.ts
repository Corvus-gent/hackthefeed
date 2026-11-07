import type { Product, SiteInfo, SocialKey } from './data.ts';

// Reads what onboarding needs out of a homepage's HTML: title, description, social handles and
// products with their images. Product detection follows Shopify's /products/<handle> links and
// matches image filenames to the handle's words, which covers most Shopify storefronts.

const decode = (s: string) => s
  .replace(/&#39;|&#x27;|&apos;/g, '’').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function meta(html: string, key: string) {
  const tag = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*>`, 'i'))?.[0];
  const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
  return content ? decode(content) : '';
}

const SOCIAL_PATTERNS: Record<SocialKey, RegExp> = {
  tiktok: /tiktok\.com\/@([A-Za-z0-9._]{2,30})/i,
  instagram: /instagram\.com\/(?!p\/|reel|explore|stories)([A-Za-z0-9._]{2,30})/i,
  youtube: /youtube\.com\/@([A-Za-z0-9._-]{2,40})/i,
};

const titleCase = (handle: string) => handle.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function parseSite(html: string, host: string, origin: string, maxProducts = 24): SiteInfo {
  const title = meta(html, 'og:title') || decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '');
  const description = meta(html, 'description') || meta(html, 'og:description');

  const socials: SiteInfo['socials'] = {};
  for (const [key, re] of Object.entries(SOCIAL_PATTERNS) as [SocialKey, RegExp][]) {
    const m = html.match(re);
    if (m) socials[key] = '@' + m[1].replace(/\.$/, '');
  }

  const handles = [...new Set([...html.matchAll(/href=["'](?:https?:\/\/[^"']+)?\/products\/([a-z0-9-]+)/gi)].map(m => m[1].toLowerCase()))];
  const images = [...new Set([...html.matchAll(/((?:https?:)?\/\/[^"'\s,]+?\/(?:cdn\/shop|s\/files)\/[^"'\s,]+?\.(?:png|jpe?g|webp)(?:\?[^"'\s,]*)?)/gi)]
    .map(m => m[1].replace(/&amp;/g, '&'))
    .map(u => (u.startsWith('//') ? 'https:' + u : u)))];

  const products: Product[] = [];
  for (const handle of handles) {
    const words = handle.split('-').filter(w => w.length >= 4);
    if (!words.length) continue;
    // Score each image by how many handle words its filename contains, plus one if the filename
    // starts with one of them (so "apple-yuzu" prefers Apple_1B over Pineapple_1B). Keep the best.
    const scored = images.map(src => {
      const file = squash(src.split('/').pop()!.split('?')[0]);
      const hits = words.filter(w => file.includes(w)).length;
      return { src, score: hits && hits + (words.some(w => file.startsWith(w)) ? 1 : 0) };
    }).filter(i => i.score > 0);
    const best = Math.max(0, ...scored.map(i => i.score));
    const picked = scored.filter(i => i.score === best).map(i => i.src);
    // Same photo often appears at several widths; keep one per filename.
    const seen = new Set<string>();
    const unique = picked.filter(src => { const k = src.split('/').pop()!.split('?')[0].replace(/_\d+x(?=\.)/, ''); return seen.has(k) ? false : (seen.add(k), true); });
    if (!unique.length) continue;
    products.push({ id: handle, title: titleCase(handle), url: `${origin}/products/${handle}`, images: unique.slice(0, 3), selected: false, imported: true });
    if (products.length >= maxProducts) break;
  }

  return { host, title, description, socials, products, source: 'live' };
}
