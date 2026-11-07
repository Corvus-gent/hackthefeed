// Real viral videos from Oriane (connect.oriane.xyz/rest/docs), trimmed to what the onboarding needs.
// Pure (no server imports) so the mapping can be unit tested; the API call lives in /api/onboarding/videos.
import { z } from 'zod';

const OrianeResult = z.object({
  id: z.string(),
  platform: z.enum(['instagram', 'tiktok', 'youtube']),
  platformId: z.string(),
  profileHandle: z.string(),
  caption: z.string().nullish(),
  thumbnailMediaUrl: z.string().nullish(),
  publishedAt: z.string(),
  viewsCount: z.number().nullish(),
  likesCount: z.number().nullish(),
  sharesCount: z.number().nullish(),
  commentsCount: z.number().nullish(),
  engagementRatePerViews: z.number().nullish(),
  media: z.array(z.object({
    duration: z.number().nullish(),
    transcript: z.string().nullish(),
    onScreenText: z.array(z.string()).nullish(),
  })).nullish(),
});

/** Body of POST /rest/assets: a reusable text or image query for visual search. */
export const OrianeAsset = z.object({ data: z.object({ id: z.string() }) });
/** Body of POST /rest/contents/search with the default projection. */
export const OrianeSearch = z.object({ data: z.object({ results: z.array(OrianeResult) }) });
export type OrianeResult = z.infer<typeof OrianeResult>;
export type ViralVideo = ReturnType<typeof toViralVideo>;

const POST_URL: Record<OrianeResult['platform'], (r: OrianeResult) => string | null> = {
  tiktok: r => `https://www.tiktok.com/@${r.profileHandle}/video/${r.platformId}`,
  youtube: r => `https://www.youtube.com/shorts/${r.platformId}`,
  instagram: () => null, // Oriane only gives the numeric media id, not the shortcode the URL needs
};

/** Short card title from a caption: drops hashtags, mentions and links, keeps the first sentence. */
export function titleFrom(caption: string, fallback: string) {
  const clean = caption
    .replace(/^replying to @\S+/i, '')
    .replace(/@bloom nutrition/gi, 'Bloom')
    .replace(/https?:\/\/\S+|[#@][\w.]+/g, '')
    .split(/\n|(?<=[.!?])\s/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return fallback;
  return clean.length > 48 ? clean.slice(0, 46).trimEnd() + '…' : clean;
}

export function toViralVideo(r: OrianeResult) {
  const media = r.media?.[0];
  return {
    id: `o-${r.id}`,
    t: titleFrom(r.caption ?? '', `@${r.profileHandle}`),
    caption: r.caption ?? '',
    url: POST_URL[r.platform](r),
    platform: r.platform,
    handle: r.profileHandle,
    thumb: r.thumbnailMediaUrl ?? null,
    publishedAt: r.publishedAt,
    views: r.viewsCount ?? 0,
    likes: r.likesCount ?? 0,
    shares: r.sharesCount ?? 0,
    comments: r.commentsCount ?? 0,
    er: r.engagementRatePerViews ?? null, // percent
    dur: media?.duration ?? null, // seconds
    transcript: media?.transcript ?? '',
    onScreenText: media?.onScreenText ?? [],
  };
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const fmtCount = (n: number) => compact.format(n);
export const fmtDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;
