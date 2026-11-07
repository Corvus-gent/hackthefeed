import type { IconName } from '@/lib/onboarding/data';
import { beliefLabels, competitorsFor, nicheById, pickedVideos, validSocials } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { CheckCircle, cx, RemoteImage } from '../ui';

type Item = { icon: IconName; t: string; d: string; done: boolean; cta?: string; focus?: boolean };

export default function DoneStep({ s, toast }: StepProps) {
  const products = s.products.filter(p => p.selected);
  const socials = validSocials(s);
  const comps = [...competitorsFor(s.niche).filter(c => s.comps.includes(c.h)).map(c => c.n), ...s.custom.filter(h => s.comps.includes(h)).map(h => '@' + h)];
  const beliefs = beliefLabels(s);
  const items: Item[] = [
    { icon: 'globe', t: 'Describe the company', d: s.what.trim(), done: true },
    { icon: 'can', t: 'Add products', d: products.length ? products.map(p => p.title).join(', ') : 'Skipped. Videos won’t feature a specific product.', done: products.length > 0, cta: 'Add' },
    { icon: 'tag', t: 'Set the niche', d: `${nicheById(s.niche)?.t ?? ''} · ${s.genres.join(', ')}`, done: true },
    { icon: 'film', t: 'Read current content', d: socials.length ? `${socials.map(l => l.label).join(', ')} · last 90 days` : 'Skipped. Add channels so the agent knows what you already post.', done: socials.length > 0, cta: 'Add' },
    { icon: 'users', t: 'Watch competitors', d: comps.length ? comps.join(', ') : 'Skipped. The agent will suggest accounts after its first scan.', done: comps.length > 0, cta: 'Add' },
    { icon: 'flag', t: 'Set your edge', d: beliefs.length ? beliefs.join(', ') : 'Skipped. Without it, pitches follow what’s trending rather than your angle.', done: beliefs.length > 0, cta: 'Add' },
    { icon: 'grid', t: 'Pick videos to learn from', d: pickedVideos(s).map(v => v.t).join(', '), done: true },
    { icon: 'play', t: 'Review your first 5 pitches', d: 'Drafted from this week’s Oriane results.', done: false, cta: 'Review', focus: true },
    { icon: 'share', t: 'Connect a channel to post', d: 'Nothing posts without your approval.', done: false, cta: 'Connect' },
  ];
  const left = items.filter(i => !i.done).length;

  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-[10px] border border-line text-left">
      <div className="flex items-center justify-between gap-3 px-[18px] pt-4 pb-3">
        <h2 className="text-base font-medium">Getting started</h2>
        <span className="text-[13.5px] text-ink-2 tabular-nums">{left} steps left</span>
      </div>
      <div className="h-[3px] bg-line"><div className="h-full bg-accent" style={{ width: `${((items.length - left) / items.length) * 100}%` }} /></div>
      {items.map(i => (
        <div key={i.t} className={cx('grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line px-[18px] py-3 first-of-type:border-t-0 max-sm:gap-2.5 max-sm:px-3.5', i.focus && 'bg-accent-soft')}>
          <span className={cx('grid size-[38px] place-items-center rounded-full text-accent', i.focus ? 'bg-surface' : 'bg-surface-2')}><Icon name={i.icon} size={18} /></span>
          <span>
            <span className={cx('block text-[15px]', i.done ? 'text-ink-2 line-through decoration-1' : 'font-medium')}>{i.t}</span>
            <span className="block text-[13.5px] break-words text-ink-2">{i.d}</span>
            {i.icon === 'can' && products.length > 0 && (
              <span className="mt-1.5 flex gap-1.5">
                {products.slice(0, 6).map(p => p.images[0] && <RemoteImage key={p.id} src={p.images[0]} alt={p.title} className="size-9 rounded-md border border-line object-cover" />)}
              </span>
            )}
          </span>
          {i.done
            ? <span role="img" aria-label="Done"><CheckCircle on /></span>
            : <button type="button" onClick={() => toast(`Prototype ends here. In the app, “${i.cta}” opens that step.`)}
                className="h-[34px] rounded-full bg-accent px-4 text-sm font-medium whitespace-nowrap text-white hover:brightness-110">{i.cta}</button>}
        </div>
      ))}
    </div>
  );
}
