import { editSite, editWhat, hostOf, nicheById, sources, validLink } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { InputWithIcon, Panel, Status, Tag } from '../ui';
import SocialFields from './SocialFields';

export default function SiteStep({ s, set }: StepProps) {
  const host = hostOf(s.site);
  const siteBad = !!s.site.trim() && !validLink('site', s.site);
  const imported = s.products.filter(p => p.imported).length;
  const info = s.siteInfo;

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-3">
      {s.role === 'agency' && (
        <InputWithIcon icon="building" aria-label="Company name" placeholder="Company name" value={s.client}
          onChange={e => set(p => ({ ...p, client: e.target.value }))} />
      )}
      <div className="flex flex-col gap-1.5">
        <InputWithIcon icon="globe" aria-label="Website" placeholder="yourbrand.com" inputMode="url" value={s.site}
          loading={s.siteSt === 'loading'} bad={siteBad} onChange={e => set(p => editSite(p, e.target.value))} />
        {siteBad && <Status tone="bad">Enter a web address, like yourbrand.com</Status>}
        {s.siteSt === 'loading' && <Status>Reading {host} for your description, socials and products…</Status>}
        {s.siteSt === 'error' && <Status tone="bad">We couldn’t read that website. Add the details yourself.</Status>}
        {s.siteSt === 'done' && (
          <Status tone="ok">
            Read {host} · {s.found.length} social account{s.found.length === 1 ? '' : 's'} · {imported} product{imported === 1 ? '' : 's'}
          </Status>
        )}
      </div>

      <SocialFields s={s} set={set} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="what" className="flex flex-wrap items-baseline gap-2 text-sm font-medium">
          What you do
          {s.whatAuto && (
            <span className="text-[13px] font-normal text-ink-3">
              <Icon name="spark" size={13} className="mr-0.5 inline align-[-2px] text-accent" />
              Written by the agent from {sources(s).join(', ')}
            </span>
          )}
        </label>
        <textarea id="what" value={s.what} onChange={e => set(p => editWhat(p, e.target.value))}
          placeholder="Fills in from your website and socials, or write it yourself."
          className="h-24 resize-y rounded-[10px] border border-line px-4 py-3 leading-normal outline-none transition placeholder:text-ink-3 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-ring)]" />
      </div>

      {s.siteSt === 'done' && info && (
        <Panel title="Also picked up" tag={<Tag tone={info.source === 'live' ? 'live' : 'sample'}>{info.source === 'live' ? 'LIVE' : 'SAVED COPY'}</Tag>}>
          <dl className="m-0 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
            {[['Site title', info.title || '—'], ['Products', String(imported)], ['Niche', nicheById(s.suggested)?.t ?? 'Not sure yet']].map(([k, v]) => (
              <div key={k} className="min-w-0"><dt className="text-xs text-ink-3">{k}</dt><dd className="m-0 mt-0.5 text-sm break-words">{v}</dd></div>
            ))}
          </dl>
        </Panel>
      )}
    </div>
  );
}
