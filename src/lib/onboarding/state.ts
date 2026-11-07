// Onboarding state and the pure rules behind it. No React here, so it can be unit tested.
import {
  COMPETITOR_VIDEO_IDEAS, DRINKS, FORMAT_COLORS, GENERIC_WHAT, NICHES, NICHE_HINTS, NICHE_SETS,
  NIGHTLIFE_BELIEFS, NIGHTLIFE_COMPETITORS, NIGHTLIFE_FORMATS, PALETTE, SOCIALS,
  type Belief, type Competitor, type Format, type IconName, type NicheId, type Product, type SiteInfo, type SocialKey,
} from './data.ts';

export type Role = 'creator' | 'brand' | 'agency';
export type VideoView = 'competitors' | 'niche';

export type State = {
  step: number;
  role: Role | null;
  client: string;
  site: string;
  siteSt: 'idle' | 'loading' | 'done' | 'error';
  siteInfo: SiteInfo | null;
  what: string;
  whatAuto: boolean; // description was written by the agent; cleared once the user edits it
  links: Record<SocialKey, string>;
  found: SocialKey[]; // handles filled in from the website
  products: Product[];
  suggested: NicheId | null;
  nicheManual: boolean;
  niche: NicheId | null;
  genres: string[];
  comps: string[];
  custom: string[];
  beliefs: string[];
  own: string[];
  videoView: VideoView;
  videos: string[];
};

export const STEPS = ['role', 'site', 'products', 'niche', 'socials', 'comps', 'beliefs', 'videos', 'done'] as const;
export type StepId = (typeof STEPS)[number];
export const SECTIONS = ['About', 'Edge', 'Find videos', 'Launch'];
export const SECTION_OF: Record<StepId, number> = { role: 0, site: 0, products: 0, niche: 0, socials: 0, comps: 0, beliefs: 1, videos: 2, done: 3 };
export const SKIPPABLE: Partial<Record<StepId, string>> = { products: 'Skip for now', socials: 'I don’t post yet', comps: 'Skip for now', beliefs: 'Skip for now' };

export const initialState = (): State => ({
  step: 0, role: null, client: '', site: '', siteSt: 'idle', siteInfo: null, what: '', whatAuto: false,
  links: { tiktok: '', instagram: '', youtube: '' }, found: [], products: [],
  suggested: null, nicheManual: false, niche: null, genres: [],
  comps: [], custom: [], beliefs: [], own: [], videoView: 'competitors', videos: [],
});

export const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
export const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

export function validLink(key: SocialKey | 'site', v: string) {
  v = v.trim();
  if (!v) return false;
  const url = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v);
  return key === 'site' ? url : url || /^@?[\w.]{2,30}$/.test(v);
}
export const hostOf = (site: string) => site.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/^www\./i, '').replace(/\/.*$/, '').toLowerCase();
export const nicheById = (id: NicheId | null) => NICHES.find(n => n.id === id) ?? null;

/** Accepts "@name" or a profile link and returns the bare handle, or null if it isn't one. */
export function parseHandle(input: string) {
  const v = input.trim().replace(/^https?:\/\/(www\.)?[^/]+\/@?/i, '').replace(/^@/, '').replace(/\/.*$/, '');
  return /^[\w.]{2,30}$/.test(v) ? v.toLowerCase() : null;
}

export function detectNiche(s: State): NicheId | null {
  const text = [hostOf(s.site), s.siteInfo?.title, s.siteInfo?.description, ...Object.values(s.links), s.whatAuto ? '' : s.what]
    .join(' ').toLowerCase();
  const words = text.split(/[^a-z]+/);
  let best: NicheId | null = null;
  let top = 0;
  for (const [id, h] of Object.entries(NICHE_HINTS) as [NicheId, (typeof NICHE_HINTS)[NicheId]][]) {
    const score = h.k.filter(k => (k.length >= 4 ? text.includes(k) : words.includes(k))).length;
    if (score > top) { best = id; top = score; }
  }
  return best;
}

/** Switching niche clears picks from the old niche's lists. Hand-added competitors stay. */
export function withNiche(s: State, id: NicheId | null): State {
  if (s.niche === id) return s;
  const keep = s.comps.filter(h => s.custom.includes(h));
  // Drinks: the example client's main competitor (Bloom) is pre-selected.
  const comps = id === 'drinks' ? [...new Set([...keep, DRINKS.competitors[0].h])] : keep;
  return { ...s, niche: id, comps, beliefs: [], videos: [] };
}

/**
 * Re-runs detection and selects the niche with its first two genres, unless the user chose one
 * or is already past the niche step (editing a handle later must not reset their answers).
 */
export function withSuggestion(s: State): State {
  const suggested = detectNiche(s);
  s = { ...s, suggested };
  if (s.nicheManual || s.step > STEPS.indexOf('niche')) return s;
  s = withNiche(s, suggested);
  return { ...s, genres: nicheById(suggested)?.g.slice(0, 2) ?? [] };
}

export const validSocials = (s: State) => SOCIALS.filter(l => validLink(l.key, s.links[l.key]));
export const sources = (s: State) => [...(s.siteSt === 'done' ? [hostOf(s.site)] : []), ...validSocials(s).map(l => l.label)];

/** Writes the description from what the agent found, until the user edits it. */
export function withAutofill(s: State): State {
  s = withSuggestion(s);
  const has = sources(s).length > 0;
  if (has && (s.whatAuto || !s.what.trim())) {
    const what = s.siteInfo?.description || (s.suggested ? NICHE_HINTS[s.suggested].w : GENERIC_WHAT);
    return { ...s, what, whatAuto: true };
  }
  if (!has && s.whatAuto) return { ...s, what: '', whatAuto: false };
  return s;
}

/** Typing a new website forgets everything that came from the old one. */
export function editSite(s: State, site: string): State {
  const links = { ...s.links };
  for (const k of s.found) links[k] = '';
  return withAutofill({
    ...s, site, links, found: [], siteInfo: null,
    siteSt: validLink('site', site) ? 'loading' : 'idle',
    products: s.products.filter(p => !p.imported),
  });
}

/** Applies a website read: fills empty handles, imports products, writes the description. */
export function finishSiteRead(s: State, info: SiteInfo): State {
  if (hostOf(s.site) !== info.host || s.siteSt !== 'loading') return s;
  const links = { ...s.links };
  const found: SocialKey[] = [];
  for (const { key } of SOCIALS) {
    const handle = info.socials[key];
    if (handle && !links[key].trim()) { links[key] = handle; found.push(key); }
  }
  const products = [...s.products.filter(p => !p.imported), ...info.products];
  return withAutofill({ ...s, siteSt: 'done', siteInfo: info, links, found, products });
}

export const siteFailed = (s: State, site: string): State =>
  s.site === site && s.siteSt === 'loading' ? withAutofill({ ...s, siteSt: 'error' }) : s;

export function editLink(s: State, key: SocialKey, value: string): State {
  return withAutofill({ ...s, links: { ...s.links, [key]: value }, found: s.found.filter(k => k !== key) });
}

export const editWhat = (s: State, what: string): State => withSuggestion({ ...s, what, whatAuto: false });

export function canContinue(s: State): boolean {
  switch (STEPS[s.step]) {
    case 'role': return !!s.role;
    case 'site': return s.what.trim().length >= 12 && (s.role !== 'agency' || s.client.trim().length > 0);
    case 'products': return s.products.some(p => p.selected);
    case 'niche': return !!s.niche && s.genres.length > 0;
    case 'socials': return validSocials(s).length > 0;
    case 'comps': return s.comps.length > 0;
    case 'beliefs': return s.beliefs.length + s.own.length > 0;
    case 'videos': return pickedVideos(s).length > 0; // ids can go stale when a competitor is deselected
    default: return true;
  }
}

/* ---------- niche-specific lists (sample content; see data.ts) ---------- */

export function competitorsFor(niche: NicheId | null): Competitor[] {
  if (niche === 'drinks') return DRINKS.competitors;
  const set = niche ? NICHE_SETS[niche] : undefined;
  if (!set) return NIGHTLIFE_COMPETITORS;
  return set.c.map(([h, n], i) => { const x = hash(h); return { h, n, f: `${40 + (x % 300)}K`, v: `${18 + ((x >> 4) % 110)}K`, c: PALETTE[i % 4] }; });
}

export function beliefsFor(niche: NicheId | null): Belief[] {
  if (niche === 'drinks') return DRINKS.beliefs;
  const set = niche ? NICHE_SETS[niche] : undefined;
  return set ? set.b.map(([id, s, t, vs, ex]) => ({ id, s, t, vs, ex })) : NIGHTLIFE_BELIEFS;
}

// Stats are made up but stable per item (derived from its name), so the page doesn't flicker between renders.
function sampleFormat(id: string, t: string, cap: string, icon: IconName, fits: string[], handle: string, i: number, extra: Partial<Format> = {}): Format {
  const x = hash(id + t);
  return {
    id, t, cap, icon, fits, handle, dur: `0:${15 + (x % 30)}`, c: FORMAT_COLORS[i % FORMAT_COLORS.length],
    views: `${150 + (x % 450)}K`, watch: 48 + (x % 20), posts: 300 + (x % 1900), growth: (x % 90) - 10, comps: x % 4,
    s: Array.from({ length: 12 }, (_, j) => 5 + j * (1 + (x % 3)) * 0.5 + ((x >> j) & 3)), ...extra,
  };
}

/** Broad view: formats working across the whole niche. */
export function nicheFormats(niche: NicheId | null): Format[] {
  // Not credited to real brands: these are examples, not their posts.
  if (niche === 'drinks') return DRINKS.formats.map(([t, cap, icon, fits], i) => sampleFormat(`n${i}`, t, cap, icon, fits, 'Top in niche', i));
  const set = niche ? NICHE_SETS[niche] : undefined;
  if (!set) return NIGHTLIFE_FORMATS;
  return set.f.map(([t, cap, icon, fits], i) => sampleFormat(`n${i}`, t, cap, icon, fits, '@' + set.c[i % set.c.length][0], i));
}

/**
 * Focused view: top videos from the selected competitors.
 * ponytail: placeholder videos built from each competitor's product shots; replace with Oriane's
 * top posts per account (call it from a route handler so the API key stays on the server).
 */
export function competitorVideos(s: State): Format[] {
  const list = competitorsFor(s.niche).filter(c => s.comps.includes(c.h));
  const custom = s.custom.filter(h => s.comps.includes(h)).map((h, i): Competitor => ({ h, n: '@' + h, c: PALETTE[i % 4] }));
  return [...list, ...custom].flatMap((c, ci) => COMPETITOR_VIDEO_IDEAS.slice(0, c.img ? 4 : 2).map(([t, cap, icon, fits], i) =>
    sampleFormat(`c-${c.h}-${i}`, t, cap, icon, fits, c.n, ci * 4 + i, { img: c.img?.[i % c.img.length], from: c.h, comps: 0 })));
}

export type RankedVideo = Format & { fit: string[] };
/** Videos for the current view, with the user's matching beliefs; matches first. */
export function rankedVideos(s: State): RankedVideo[] {
  const beliefs = beliefsFor(s.niche);
  const list = s.videoView === 'competitors' ? competitorVideos(s) : nicheFormats(s.niche);
  return list
    .map(v => ({ ...v, fit: beliefs.filter(b => v.fits.includes(b.id) && s.beliefs.includes(b.id)).map(b => b.s) }))
    .sort((a, b) => b.fit.length - a.fit.length || b.growth - a.growth);
}

export const beliefLabels = (s: State) => [...beliefsFor(s.niche).filter(b => s.beliefs.includes(b.id)).map(b => b.s), ...s.own];

export const exampleHooks = (s: State): [hook: string, from: string][] => [
  ...beliefsFor(s.niche).filter(b => s.beliefs.includes(b.id)).map((b): [string, string] => [b.ex, b.s]),
  ...s.own.map((o): [string, string] => [`A hook built around “${o}”`, 'Your own belief']),
].slice(0, 3);

/** Every video the user picked, from either view (picks survive switching views). */
export const pickedVideos = (s: State) => [...competitorVideos(s), ...nicheFormats(s.niche)].filter(v => s.videos.includes(v.id));
