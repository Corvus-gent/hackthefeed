import type { ReactNode } from 'react';
import { pickedVideos, rankedVideos, toggle, type RankedVideo, type VideoView } from '@/lib/onboarding/state';
import { fmtCount, fmtDuration, type ViralVideo } from '@/lib/onboarding/viral';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { btn, CheckCircle, Reel, RemoteImage, Sparkline, Stat, Tag } from '../ui';

const VIEWS: [VideoView, string][] = [['competitors', 'From competitors'], ['niche', 'Whole niche']];
const PLATFORM = { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube' } as const;

export default function VideosStep({ s, set }: StepProps) {
  const picked = new Set(s.videos);
  const pick = (id: string) => set(p => ({ ...p, videos: toggle(p.videos, id) }));
  const setView = (v: VideoView) => set(p => ({ ...p, videoView: v }));

  return (
    <div className="flex w-full max-w-[940px] flex-col items-center gap-4">
      <div role="radiogroup" aria-label="Which videos to show" className="inline-flex rounded-full border border-line bg-surface-2 p-1">
        {VIEWS.map(([v, label]) => (
          <button key={v} type="button" role="radio" aria-checked={s.videoView === v} onClick={() => setView(v)}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition aria-checked:bg-surface aria-checked:text-ink aria-checked:shadow-sm">
            {label}
          </button>
        ))}
      </div>

      {s.videoView === 'competitors' ? (
        s.viralSt === 'loading' ? <Note>Finding Bloom’s most viral videos…</Note>
        : s.viralSt === 'error' ? (
          <Note>
            Couldn’t load videos from Oriane.
            <button type="button" className={btn.ghost} onClick={() => set(p => ({ ...p, viralSt: 'loading' }))}>Try again</button>
          </Note>
        )
        : s.viral.length === 0 ? <Note>No Bloom videos found right now.</Note>
        : (
          <Reel label="videos" head={<p className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2"><Tag tone="live">LIVE</Tag>Bloom’s most viewed videos that show the product · via Oriane</p>}>
            {s.viral.map(v => <ViralCard key={v.id} v={v} on={picked.has(v.id)} onToggle={() => pick(v.id)} />)}
          </Reel>
        )
      ) : (
        <Reel label="videos" head={<p className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2"><Tag tone="sample">SAMPLE DATA</Tag>{s.genres.join(', ') || 'Your niche'} · TikTok, Reels, Shorts · last 30 days</p>}>
          {rankedVideos(s).map(v => <FormatCard key={v.id} v={v} on={picked.has(v.id)} onToggle={() => pick(v.id)} competitorCount={s.comps.length} />)}
        </Reel>
      )}
      {pickedVideos(s).length > 0 && <p className="text-[13px] text-ink-3">{pickedVideos(s).length} picked · picks stay when you switch views</p>}
    </div>
  );
}

const Note = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line px-6 py-10 text-center text-ink-2">{children}</div>
);

const cardButton = 'group flex flex-col gap-2.5 text-left';
const tile = 'relative block aspect-[9/16] overflow-hidden rounded-[10px] text-white transition group-hover:-translate-y-0.5 group-aria-checked:shadow-[0_0_0_2px_white,0_0_0_4px_var(--color-accent)]';
const shade = <span className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-50% to-black/70" />;

/** A real video from Oriane: its thumbnail and stats. */
function ViralCard({ v, on, onToggle }: { v: ViralVideo; on: boolean; onToggle: () => void }) {
  const published = new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <div className="flex w-[212px] shrink-0 snap-start flex-col gap-2 max-sm:w-44">
      <button type="button" role="checkbox" aria-checked={on} onClick={onToggle} className={cardButton}>
        <span className={tile} style={{ background: 'linear-gradient(160deg, #1e1b4b, #7c3aed)' }}>
          {v.thumb && <RemoteImage src={v.thumb} alt="" className="absolute inset-0 size-full object-cover" />}
          {shade}
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold tabular-nums"><Icon name="play" size={11} stroke={0} />{fmtCount(v.views)}</span>
          <CheckCircle on={on} onImage className="absolute top-2 right-2" />
          <span className="absolute bottom-3.5 left-3 max-w-[60%] truncate text-xs opacity-85">@{v.handle}</span>
          {v.dur !== null && <span className="absolute right-2.5 bottom-3 rounded bg-black/45 px-1.5 py-0.5 text-[11.5px] tabular-nums">{fmtDuration(v.dur)}</span>}
        </span>
        <span className="flex flex-col gap-2 px-0.5">
          <span className="text-[15px] leading-tight font-medium group-aria-checked:text-accent">{v.t}</span>
          <span className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-dashed border-line pt-2.5">
            <Stat value={fmtCount(v.views)} label="views" />
            <Stat value={fmtCount(v.likes)} label="likes" />
            <Stat value={v.er === null ? '–' : `${v.er.toFixed(1)}%`} label="engagement" />
            <Stat value={fmtCount(v.shares)} label="shares" />
          </span>
        </span>
      </button>
      <p className="px-0.5 text-[12.5px] text-ink-3">
        {PLATFORM[v.platform]} · {published}
        {v.url && <> · <a href={v.url} target="_blank" rel="noreferrer" className="text-ink-2 underline-offset-2 hover:underline">Watch</a></>}
      </p>
    </div>
  );
}

/** A sample whole-niche format (no real posts behind it yet). */
function FormatCard({ v, on, onToggle, competitorCount }: { v: RankedVideo; on: boolean; onToggle: () => void; competitorCount: number }) {
  const used = Math.min(v.comps, competitorCount);
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onToggle} className={`${cardButton} w-[212px] shrink-0 snap-start max-sm:w-44`}>
      <span style={{ background: `linear-gradient(160deg, ${v.c[0]}, ${v.c[1]})` }} className={tile}>
        <span className="absolute inset-x-0 top-0 bottom-[28%] grid place-items-center opacity-45"><Icon name={v.icon} size={52} stroke={1.1} /></span>
        {shade}
        <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold tabular-nums"><Icon name="play" size={11} stroke={0} />{v.views}</span>
        <CheckCircle on={on} onImage className="absolute top-2 right-2" />
        <span className="absolute inset-x-3 bottom-10 text-[15px] leading-tight font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,.45)]">{v.cap}</span>
        <span className="absolute bottom-3.5 left-3 max-w-[60%] truncate text-xs opacity-85">{v.handle}</span>
        <span className="absolute right-2.5 bottom-3 rounded bg-black/45 px-1.5 py-0.5 text-[11.5px] tabular-nums">{v.dur}</span>
      </span>
      <span className="flex flex-col gap-2 px-0.5">
        <span className="text-[15px] leading-tight font-medium group-aria-checked:text-accent">{v.t}</span>
        <span className="flex flex-wrap gap-1.5">
          {v.fit.length > 0 && <Tag tone="fit">Matches: {v.fit.join(', ')}</Tag>}
          {used ? <Tag tone="used">{used > 1 ? `${used} competitors post this` : '1 competitor posts this'}</Tag> : <Tag tone="open">Open lane</Tag>}
        </span>
        <span className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-dashed border-line pt-2.5">
          <Stat value={v.views} label="median views" />
          <Stat value={`${v.watch}%`} label="avg watch time">
            <span className="mt-1.5 block h-1 overflow-hidden rounded bg-line"><span className="block h-full bg-accent" style={{ width: `${v.watch}%` }} /></span>
          </Stat>
          <Stat value={v.posts.toLocaleString('en-US')} label="posts found" />
          <Stat value={<span className={v.growth >= 0 ? 'text-good' : 'text-warn'}>{v.growth >= 0 ? '+' : '−'}{Math.abs(v.growth)}%</span>} label="in 30 days" />
          <span className="col-span-2"><Sparkline values={v.s} /></span>
        </span>
      </span>
    </button>
  );
}
