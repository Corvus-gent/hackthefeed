// Run with: npm test  (Node's built-in test runner; Node 23+ runs TypeScript directly)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WILD_WONDER } from './data.ts';
import { isPublicUrl, parseSite } from './site.ts';
import { titleFrom, toViralVideo, type OrianeResult } from './viral.ts';
import {
  canContinue, detectNiche, editLink, editSite, editWhat, finishSiteRead,
  initialState, parseHandle, rankedVideos, STEPS, validLink, withNiche, type State,
} from './state.ts';

const at = (id: (typeof STEPS)[number], s: Partial<State> = {}): State => ({ ...initialState(), step: STEPS.indexOf(id), ...s });

test('validLink accepts sites and handles, rejects junk', () => {
  assert.ok(validLink('site', 'drinkwildwonder.com'));
  assert.ok(validLink('site', 'https://bloomnu.com/products/sparkling-energy'));
  assert.ok(!validLink('site', 'not a site'));
  assert.ok(validLink('tiktok', '@drinkwildwonder'));
  assert.ok(!validLink('tiktok', 'two words'));
});

test('parseHandle reads @names and profile links', () => {
  assert.equal(parseHandle('@Bloom.Nu'), 'bloom.nu');
  assert.equal(parseHandle('https://www.tiktok.com/@drinkwildwonder'), 'drinkwildwonder');
  assert.equal(parseHandle('no spaces allowed'), null);
});

test('detects the niche from the website and handles', () => {
  assert.equal(detectNiche(at('site', { site: 'drinkwildwonder.com' })), 'drinks');
  assert.equal(detectNiche(at('site', { site: 'glowskin.com' })), 'beauty');
  assert.equal(detectNiche(at('site', { site: 'acme.com' })), null);
});

test('reading Wild Wonder fills handles, products, description and the drinks niche', () => {
  let s = editSite(at('site'), 'drinkwildwonder.com');
  assert.equal(s.siteSt, 'loading');
  s = finishSiteRead(s, WILD_WONDER);
  assert.equal(s.siteSt, 'done');
  assert.equal(s.links.tiktok, '@drinkwildwonder');
  assert.deepEqual(s.found.sort(), ['instagram', 'tiktok']);
  assert.equal(s.products.length, WILD_WONDER.products.length);
  assert.ok(s.whatAuto && s.what.includes('prebiotic'));
  assert.equal(s.niche, 'drinks');
  assert.ok(s.comps.includes('bloomnu.com'), 'Bloom is pre-selected as the main competitor');
});

test('a hand-typed handle is never overwritten by the website read', () => {
  let s = editLink(editSite(at('site'), 'drinkwildwonder.com'), 'tiktok', '@mine');
  s = finishSiteRead(s, WILD_WONDER);
  assert.equal(s.links.tiktok, '@mine');
  assert.ok(!s.found.includes('tiktok'));
});

test('a stale website read is ignored', () => {
  const s = editSite(editSite(at('site'), 'drinkwildwonder.com'), 'glowskin.com');
  assert.equal(finishSiteRead(s, WILD_WONDER), s);
});

test('editing the description stops autofill', () => {
  let s = finishSiteRead(editSite(at('site'), 'drinkwildwonder.com'), WILD_WONDER);
  s = editWhat(s, 'We make yoga mats.');
  s = editLink(s, 'youtube', '@wildwonder');
  assert.equal(s.what, 'We make yoga mats.');
});

test('switching niche clears old picks but keeps hand-added competitors', () => {
  const s = withNiche(at('comps', { niche: 'beauty', comps: ['glowdaily', 'mine'], custom: ['mine'], beliefs: ['honest'], videos: ['n0'] }), 'fitness');
  assert.deepEqual(s.comps, ['mine']);
  assert.deepEqual(s.beliefs, []);
  assert.deepEqual(s.videos, []);
});

test('viral video titles drop hashtags, mentions and the reply prefix', () => {
  assert.equal(titleFrom('Replying to @sam Recovering from vacation with @Bloom Nutrition  #LawnCare', '@x'), 'Recovering from vacation with Bloom');
  assert.equal(titleFrom('#fyp #bloompartner', '@rosanna'), '@rosanna');
});

test('videos matching the user’s beliefs come first', () => {
  const s = { ...withNiche(at('videos'), 'drinks'), beliefs: ['nocrash'], videoView: 'niche' as const };
  assert.deepEqual(rankedVideos(s)[0].fit, ['No crash']);
});

test('steps gate on the right answers', () => {
  assert.ok(!canContinue(at('role')));
  assert.ok(canContinue(at('role', { role: 'brand' })));
  assert.ok(!canContinue(at('site', { role: 'agency', what: 'A long enough description' })), 'agency needs a company name');
  assert.ok(!canContinue(at('products', { products: [{ ...WILD_WONDER.products[0] }] })));
  assert.ok(canContinue(at('products', { products: [{ ...WILD_WONDER.products[0], selected: true }] })));
});

test('parseSite reads meta, socials and products from a Shopify-style page', () => {
  const html = `
    <title>Fallback</title>
    <meta property="og:title" content="Soda &amp; more">
    <meta name="description" content="Gut-friendly soda. It&#39;s good.">
    <a href="https://www.tiktok.com/@sodaco">TikTok</a><a href="https://instagram.com/sodaco">IG</a>
    <a href="/products/apple-yuzu">Apple Yuzu</a><a href="/products/pineapple-paradise">Pineapple</a>
    <img src="//sodaco.com/cdn/shop/files/Apple_1B_420x.jpg?v=1">
    <img src="//sodaco.com/cdn/shop/files/Pineapple_1B_420x.jpg?v=1">
    <img srcset="//sodaco.com/cdn/shop/files/Apple_1B_800x.jpg?v=1 800w">`;
  const info = parseSite(html, 'sodaco.com', 'https://sodaco.com');
  assert.equal(info.title, 'Soda & more');
  assert.equal(info.description, 'Gut-friendly soda. It’s good.');
  assert.deepEqual(info.socials, { tiktok: '@sodaco', instagram: '@sodaco' });
  assert.deepEqual(info.products.map(p => p.title), ['Apple Yuzu', 'Pineapple Paradise']);
  assert.deepEqual(info.products[0].images, ['https://sodaco.com/cdn/shop/files/Apple_1B_420x.jpg?v=1'], 'one image per photo, not the pineapple');
});

test('isPublicUrl blocks local, internal, raw-IP and ported targets', () => {
  for (const bad of ['http://localhost/', 'https://localhost./', 'https://a.localhost/', 'https://printer.local./', 'https://db.internal/',
    'http://127.0.0.1/', 'http://169.254.169.254/', 'http://[::1]/', 'https://example.com:6379/', 'https://user:pw@example.com/', 'ftp://example.com/'])
    assert.ok(!isPublicUrl(new URL(bad)), bad);
  assert.ok(isPublicUrl(new URL('https://drinkwildwonder.com/')));
});

test('parseSite stays fast on hostile input (bounded regexes)', () => {
  for (const unit of ['"//a/cdn/shop/', '<meta ', '<title ']) {
    const t = performance.now();
    parseSite(unit.repeat(Math.ceil(512_000 / unit.length)), 'x.com', 'https://x.com');
    assert.ok(performance.now() - t < 2000, `${unit} took too long`);
  }
});

test('editing a handle after the niche step keeps the chosen niche and picks', () => {
  let s = finishSiteRead(editSite(at('site'), 'drinkwildwonder.com'), WILD_WONDER);
  s = { ...s, step: STEPS.indexOf('socials'), beliefs: ['gut'] };
  s = editLink(s, 'tiktok', '@somethingelse');
  assert.equal(s.niche, 'drinks');
  assert.deepEqual(s.beliefs, ['gut']);
});

test('a picked Oriane video only counts while it is in the loaded results', () => {
  const video = toViralVideo({ id: 'cnt_1', platform: 'tiktok', platformId: '42', profileHandle: 'ej', publishedAt: '2026-09-11T00:00:00Z' } satisfies OrianeResult);
  const s = { ...withNiche(at('videos'), 'drinks'), viral: [video], videos: [video.id] };
  assert.equal(video.url, 'https://www.tiktok.com/@ej/video/42');
  assert.ok(canContinue(s));
  assert.ok(!canContinue({ ...s, viral: [] }));
});
