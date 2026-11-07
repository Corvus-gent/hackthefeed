import type { ReactNode } from 'react';
import type { IconName } from '@/lib/onboarding/data';

const PATHS: Record<IconName, ReactNode> = {
  check: <path d="M5 12.5l4.2 4L19 7" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2 2" /></>,
  chat: <><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-5 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></>,
  tiktok: <><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.5 2.6 2.4 4.3 5 4.5" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.6" /><path d="M16.8 7.3h.01" /></>,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="M10.5 9.5v5l4-2.5z" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1-3.8 4-5.5 7-5.5s6 1.7 7 5.5" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.8-3.4 3.3-5 6-5s5.2 1.6 6 5" /><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.8c1.7.6 3 2.1 3.5 4.7" /></>,
  building: <path d="M4 20V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15M15 9h4a1 1 0 0 1 1 1v10M3 20h18M8 8h3M8 12h3M8 16h3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M7 7l10 10M17 7L7 17" />,
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  tag: <><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.2" /></>,
  film: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  share: <path d="M14 5l6 6-6 6M20 11h-8a7 7 0 0 0-7 7v1" />,
  cocktail: <><path d="M5 4h14l-7 8z" /><path d="M12 12v7M8 20h8" /></>,
  bowl: <><path d="M3 11h18a9 9 0 0 1-18 0z" /><path d="M8 7c0-1.5 1-2 1-3M12 7c0-1.5 1-2 1-3M16 7c0-1.5 1-2 1-3" /></>,
  plane: <><path d="M2 16l20-8-6 12-3-5z" /><path d="M13 15l9-7" /></>,
  dumbbell: <path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" />,
  drop: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />,
  shirt: <path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z" />,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></>,
  chart: <><path d="M4 19h16M6 15l4-4 3 3 5-6" /><path d="M15 8h3v3" /></>,
  house: <path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 21H20" />,
  gamepad: <><rect x="2" y="7" width="20" height="10" rx="5" /><path d="M7 10v4M5 12h4M15.5 11h.01M18 13h.01" /></>,
  sofa: <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2" />,
  can: <><path d="M8 3h8l1 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5z" /><path d="M7 8h10M7 16h10" /></>,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
};

export function Icon({ name, size = 20, stroke = 1.5, className }: { name: IconName; size?: number; stroke?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {PATHS[name]}
    </svg>
  );
}

const Star = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <path d={`M${x} ${y - r}l${r * .3} ${r * .7} ${r * .7} ${r * .3} -${r * .7} ${r * .3} -${r * .3} ${r * .7} -${r * .3} -${r * .7} -${r * .7} -${r * .3} ${r * .7} -${r * .3}z`}
    fill="var(--color-accent)" fillOpacity={0.55} stroke="none" />
);
const Phone = ({ x, y, w, h, screen, play }: { x: number; y: number; w: number; h: number; screen: string; play?: boolean }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={w / 6} fill="var(--color-surface)" />
    <rect x={x + w * .14} y={y + h * .1} width={w * .72} height={h * .55} rx={4} fill={screen} stroke="none" />
    {play && <path d={`M${x + w * .38} ${y + h * .27}v${h * .2}l${w * .32} ${-h * .1}z`} fill="var(--color-accent)" stroke="none" />}
    <path d={`M${x + w * .17} ${y + h * .76}h${w * .45}M${x + w * .17} ${y + h * .84}h${w * .3}`} />
  </>
);

/** Line illustrations for the "Who are you?" cards. */
export function RoleArt({ role }: { role: 'creator' | 'brand' | 'agency' }) {
  return (
    <svg viewBox="0 0 260 180" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="aspect-[13/9] w-full max-w-[200px] text-ink">
      {role === 'creator' && <>
        <Phone x={98} y={16} w={70} h={146} screen="var(--color-accent-soft)" play />
        <rect x={178} y={40} width={56} height={34} rx={8} fill="var(--color-surface)" />
        <path d="M196 57.5c0-3 4-4.5 6-1.5 2-3 6-1.5 6 1.5 0 3.5-6 7-6 7s-6-3.5-6-7z" fill="var(--color-accent)" stroke="none" />
        <Star x={54} y={40} r={9} /><Star x={214} y={118} r={7} /><Star x={30} y={66} r={5} />
      </>}
      {role === 'brand' && <>
        <Phone x={70} y={20} w={66} h={140} screen="var(--color-accent-soft)" play />
        <path d="M168 60h38l3 6v76a6 6 0 0 1-6 6h-32a6 6 0 0 1-6-6V66z" fill="var(--color-surface)" />
        <path d="M165 82h44M165 124h44" /><rect x={172} y={92} width={30} height={22} rx={3} fill="var(--color-accent-soft)" stroke="none" />
        <Star x={40} y={40} r={8} /><Star x={226} y={40} r={6} /><Star x={150} y={22} r={5} />
      </>}
      {role === 'agency' && <>
        <Phone x={30} y={44} w={58} h={112} screen="var(--color-surface-2)" />
        <Phone x={172} y={44} w={58} h={112} screen="var(--color-surface-2)" />
        <Phone x={96} y={22} w={68} h={140} screen="var(--color-accent-soft)" play />
        <Star x={30} y={26} r={8} /><Star x={236} y={30} r={6} /><Star x={130} y={8} r={5} />
      </>}
    </svg>
  );
}
