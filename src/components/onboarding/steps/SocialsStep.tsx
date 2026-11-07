import { hash, nicheFormats, validSocials } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Panel, Tag } from '../ui';
import SocialFields from './SocialFields';

export default function SocialsStep({ s, set }: StepProps) {
  const channels = validSocials(s);
  // ponytail: sample numbers; replace with the account's last 90 days from Oriane.
  const h = channels.reduce((a, l) => a + hash(l.key + s.links[l.key]), 0);
  const best = nicheFormats(s.niche)[0];

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-3">
      <SocialFields s={s} set={set} />
      {channels.length > 0 && (
        <Panel title={`What ${channels.map(c => c.label).join(' and ')} shows`} tag={<Tag tone="sample">SAMPLE</Tag>}>
          <div className="grid grid-cols-3 gap-3">
            {[[String(30 + (h % 150)), 'posts in 90 days'], [`${18 + (h % 60)}K`, 'median views'], [`${44 + (h % 18)}%`, 'avg watch time']].map(([v, l]) => (
              <div key={l}><b className="block text-xl font-normal tabular-nums">{v}</b><span className="text-xs text-ink-3">{l}</span></div>
            ))}
          </div>
          <div className="flex flex-col gap-1 border-t border-dashed border-line pt-3 text-sm">
            <span className="text-xs text-ink-3">Best performer</span>“{best.cap}” · {150 + (h % 300)}K views
          </div>
        </Panel>
      )}
    </div>
  );
}
