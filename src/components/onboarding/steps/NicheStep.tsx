import { NICHES } from '@/lib/onboarding/data';
import { nicheById, toggle, withNiche } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { CheckCircle, Chip, Reel } from '../ui';

export default function NicheStep({ s, set }: StepProps) {
  const current = nicheById(s.niche);
  // The niche suggested from the website goes first so it's visible without scrolling.
  const ordered = [...NICHES].sort((a, b) => Number(b.id === s.suggested) - Number(a.id === s.suggested));

  return (
    <div className="flex w-full max-w-[900px] flex-col gap-3">
      <Reel label="niches">
        <div role="radiogroup" aria-label="Niche" className="contents">
          {ordered.map(n => (
            <button key={n.id} type="button" role="radio" aria-checked={s.niche === n.id}
              onClick={() => set(p => (p.niche === n.id ? p : { ...withNiche(p, n.id), genres: [], nicheManual: true }))}
              style={{ background: `linear-gradient(160deg, ${n.c[0]}, ${n.c[1]})` }}
              className="relative aspect-[9/16] w-[156px] shrink-0 snap-start overflow-hidden rounded-[10px] text-left text-white shadow-sm transition hover:-translate-y-0.5 aria-checked:ring-2 aria-checked:ring-accent aria-checked:ring-offset-2 max-sm:w-32">
              <span className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-45% to-black/60" />
              <span className="absolute inset-x-0 top-0 bottom-[18%] grid place-items-center opacity-55"><Icon name={n.icon} size={46} stroke={1.2} /></span>
              <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold tabular-nums"><Icon name="play" size={11} stroke={0} />{n.v}</span>
              {n.id === s.suggested && <span className="absolute top-8 left-2.5 rounded-full bg-white/25 px-2 py-0.5 text-[10.5px] font-medium backdrop-blur">Suggested</span>}
              <CheckCircle on={s.niche === n.id} onImage className="absolute top-2 right-2" />
              <span className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-0.5">
                <span className="text-[13.5px] leading-tight font-semibold">{n.t}</span>
                <span className="text-[11.5px] leading-snug opacity-90 max-sm:hidden">{n.d}</span>
              </span>
            </button>
          ))}
        </div>
      </Reel>
      {current && <p className="text-center text-sm text-ink-2 sm:hidden"><b className="font-medium text-ink">{current.t}:</b> {current.d}</p>}
      {current && (
        <>
          <p className="mt-1 flex items-center justify-center gap-2 text-sm font-medium">Genre <span className="font-normal text-ink-3">Select all that apply</span></p>
          <div role="group" aria-label="Genre" className="flex flex-wrap justify-center gap-2.5">
            {current.g.map(g => (
              <Chip key={g} on={s.genres.includes(g)} onClick={() => set(p => ({ ...p, genres: toggle(p.genres, g), nicheManual: true }))}>{g}</Chip>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
