import type { Role } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { RoleArt } from '../icons';
import { cardClass, cx } from '../ui';

const ROLES: [Role, string, string][] = [
  ['creator', 'I’m a creator', 'I post on my own channels.'],
  ['brand', 'We’re a brand', 'We make content for our own products.'],
  ['agency', 'We’re an agency', 'We make content for clients.'],
];

export default function RoleStep({ s, set }: StepProps) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid w-full max-w-[900px] grid-cols-3 gap-3 max-sm:grid-cols-1">
      {ROLES.map(([id, title, desc]) => (
        <button key={id} type="button" role="radio" aria-checked={s.role === id} onClick={() => set(p => ({ ...p, role: id }))}
          className={cx(cardClass, 'group flex flex-col items-center gap-3.5 px-5 pt-6 pb-5 text-center max-sm:flex-row max-sm:px-4 max-sm:py-3 max-sm:text-left [&_svg]:max-sm:w-[104px] [&_svg]:max-sm:shrink-0')}>
          <RoleArt role={id} />
          <span>
            <span className="block text-[17px] font-medium group-aria-checked:text-accent">{title}</span>
            <span className="mt-0.5 block text-[13.5px] text-ink-2">{desc}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
