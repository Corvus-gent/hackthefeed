import { SOCIALS } from '@/lib/onboarding/data';
import { editLink, hostOf, validLink } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { InputWithIcon, Status } from '../ui';

/** TikTok / Instagram / YouTube fields, shared by "What do you do?" and "What do you post now?". */
export default function SocialFields({ s, set }: Pick<StepProps, 's' | 'set'>) {
  return SOCIALS.map(({ key, label, icon, ph }) => {
    const v = s.links[key];
    const bad = !!v.trim() && !validLink(key, v);
    return (
      <div key={key} className="flex flex-col gap-1.5">
        <InputWithIcon icon={icon} aria-label={label} placeholder={ph} inputMode="url" value={v} bad={bad}
          loading={s.siteSt === 'loading' && !v.trim()}
          onChange={e => set(p => editLink(p, key, e.target.value))} />
        {bad && <Status tone="bad">Enter a handle like @name, or a profile link</Status>}
        {!bad && s.found.includes(key) && <Status tone="ok">Found on {hostOf(s.site)}</Status>}
      </div>
    );
  });
}
