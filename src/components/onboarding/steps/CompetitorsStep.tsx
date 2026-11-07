import { useRef, useState } from 'react';
import { PALETTE, type Competitor } from '@/lib/onboarding/data';
import { competitorsFor, parseHandle, toggle } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { btn, CheckCircle, cx, InputWithIcon, Reel, RemoteImage, Stat, Status } from '../ui';

export default function CompetitorsStep({ s, set }: StepProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const known = competitorsFor(s.niche);
  const custom: Competitor[] = s.custom.map((h, i) => ({ h, n: '@' + h, c: PALETTE[i % PALETTE.length] }));

  const add = () => {
    const h = parseHandle(input);
    if (!h) return setError('Enter a handle like @name, or a profile link');
    set(p => ({ ...p, custom: known.some(c => c.h === h) || p.custom.includes(h) ? p.custom : [...p.custom, h], comps: p.comps.includes(h) ? p.comps : [...p.comps, h] }));
    setInput('');
    requestAnimationFrame(() => scroller.current?.scrollTo({ left: scroller.current.scrollWidth }));
  };

  return (
    <div className="flex w-full max-w-[900px] flex-col gap-4">
      {s.genres.length > 0 && (
        <p className="flex flex-wrap items-center justify-center gap-1.5 text-[13px] text-ink-3">
          <Icon name="search" size={14} /> Matched on
          {s.genres.map(g => <span key={g} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[12.5px] text-ink-2">{g}</span>)}
        </p>
      )}
      <Reel label="competitors" scrollerRef={scroller}>
        {[...known, ...custom].map(c => (
          <CompetitorCard key={c.h} c={c} custom={s.custom.includes(c.h)} on={s.comps.includes(c.h)}
            onToggle={() => set(p => ({ ...p, comps: toggle(p.comps, c.h) }))}
            onRemove={() => set(p => ({ ...p, custom: p.custom.filter(x => x !== c.h), comps: p.comps.filter(x => x !== c.h) }))} />
        ))}
      </Reel>
      <form className="mx-auto flex w-full max-w-[480px] flex-col gap-1.5" onSubmit={e => { e.preventDefault(); add(); }}>
        <div className="flex gap-2.5">
          <InputWithIcon icon="plus" aria-label="Add another account" placeholder="Add another account: @handle or link" value={input}
            onChange={e => { setInput(e.target.value); setError(''); }} className="min-w-0 flex-1" bad={!!error} />
          <button type="submit" className={btn.ghost}>Add</button>
        </div>
        {error && <Status tone="bad">{error}</Status>}
      </form>
    </div>
  );
}

function CompetitorCard({ c, on, custom, onToggle, onRemove }: { c: Competitor; on: boolean; custom: boolean; onToggle: () => void; onRemove: () => void }) {
  const initials = c.n.replace('@', '').split(/[\s.]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    // The Remove button is a sibling of the checkbox, not inside it, so screen readers expose both.
    <div className="relative w-[176px] shrink-0 snap-start max-sm:w-[150px]" style={{ ['--c' as string]: c.c }}>
    <button type="button" role="checkbox" aria-checked={on} aria-label={`${c.n}${c.site ? `, ${c.site}` : ''}`} onClick={onToggle}
      className={cx('group relative flex min-h-[248px] w-full flex-col items-center gap-0.5 overflow-hidden rounded-[10px] border bg-surface px-3.5 pb-3.5 text-center transition hover:-translate-y-0.5',
        on ? 'border-accent bg-accent-soft shadow-[inset_0_0_0_1px_var(--color-accent),0_0_0_3px_var(--color-accent-ring)]' : 'border-line hover:border-accent/45')}>
      <span className="absolute inset-x-0 top-0 h-[84px] bg-[linear-gradient(160deg,var(--c),color-mix(in_srgb,var(--c)_45%,white))]">
        {c.img && <RemoteImage src={c.img[0]} alt="" className="size-full object-cover" />}
      </span>
      {!custom && <CheckCircle on={on} onImage className="absolute top-2 right-2 z-10" />}
      <span className="relative mt-[50px] grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-surface bg-[var(--c)] text-xl font-medium text-white group-aria-checked:border-accent-soft">
        {c.img ? <RemoteImage src={c.img[0]} alt="" className="size-full object-cover" /> : initials}
      </span>
      <span className="relative mt-2 text-[15px] leading-tight font-medium group-aria-checked:text-accent">{c.n}</span>
      <span className="relative w-full truncate text-[12.5px] text-ink-3" title={c.site ?? c.h}>{custom ? 'Added by you' : c.site ?? '@' + c.h}</span>
      <span className="relative mt-auto w-full border-t border-dashed border-line pt-2.5">
        {c.f ? (
          <span className="grid grid-cols-2 gap-2"><Stat value={c.f} label="followers" /><Stat value={c.v} label="avg views" /></span>
        ) : (
          <span className="line-clamp-3 block text-[12px] leading-snug text-ink-2">{c.product ?? 'Stats arrive after the first scan'}</span>
        )}
      </span>
    </button>
    {custom && (
      <button type="button" aria-label={`Remove ${c.n}`} onClick={onRemove}
        className="absolute top-2 right-2 z-10 grid size-[26px] place-items-center rounded-lg border border-line bg-surface text-ink-2"><Icon name="x" size={14} /></button>
    )}
    </div>
  );
}
