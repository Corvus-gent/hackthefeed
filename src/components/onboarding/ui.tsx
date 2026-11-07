'use client';

import { useRef, type ComponentProps, type ReactNode, type RefObject } from 'react';
import type { IconName } from '@/lib/onboarding/data';
import { Icon } from './icons';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** Selectable card base. Style the checked state with aria-checked: variants. */
export const cardClass =
  'rounded-[10px] border border-line bg-surface text-left shadow-[0_1px_2px_rgba(18,20,43,.04)] transition ' +
  'hover:border-accent/45 aria-checked:border-accent aria-checked:bg-accent-soft ' +
  'aria-checked:shadow-[inset_0_0_0_1px_var(--color-accent),0_0_0_3px_var(--color-accent-ring)]';

export const btn = {
  primary: 'inline-flex h-[46px] min-w-32 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40',
  ghost: 'inline-flex h-[46px] items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 font-medium transition hover:border-ink-3 disabled:cursor-not-allowed disabled:opacity-40',
  link: 'inline-flex h-[46px] items-center px-3 font-medium text-ink-2 hover:text-ink',
};

export function CheckCircle({ on, onImage = false, className }: { on: boolean; onImage?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cx('grid size-[22px] shrink-0 place-items-center rounded-full border-[1.5px] transition',
      on ? 'border-accent bg-accent text-white' : onImage ? 'border-white/80 bg-black/15 text-transparent' : 'border-line bg-surface text-transparent',
      on && onImage && 'border-white', className)}>
      <Icon name="check" size={13} stroke={2.6} />
    </span>
  );
}

export function Chip({ on, children, ...props }: { on: boolean; children: ReactNode } & ComponentProps<'button'>) {
  return (
    <button type="button" role="checkbox" aria-checked={on} {...props}
      className="inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-surface px-[18px] transition hover:border-ink-3 aria-checked:border-ink aria-checked:bg-ink aria-checked:text-white max-sm:h-[38px] max-sm:px-3.5 max-sm:text-sm">
      {children}
    </button>
  );
}

/** One-row horizontal scroller with arrow buttons (hidden on phones, where you swipe). */
export function Reel({ label, children, head, scrollerRef }: { label: string; children: ReactNode; head?: ReactNode; scrollerRef?: RefObject<HTMLDivElement | null> }) {
  const own = useRef<HTMLDivElement>(null);
  const ref = scrollerRef ?? own;
  const by = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (el.clientWidth - 80), behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {head ?? <span />}
        <div className="flex gap-2 max-sm:hidden">
          {(['left', 'right'] as const).map((d, i) => (
            <button key={d} type="button" onClick={() => by(i ? 1 : -1)} aria-label={`Scroll ${label} ${d}`}
              className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink">
              <Icon name={d} size={16} stroke={2} />
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} role="group" aria-label={label} className="-mx-1.5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1.5 pt-1.5 pb-3.5 [scrollbar-width:thin]">
        {children}
      </div>
    </div>
  );
}

export function InputWithIcon({ icon, loading, bad, className, ...props }: { icon: IconName; loading?: boolean; bad?: boolean } & ComponentProps<'input'>) {
  return (
    <div className={cx('relative', className)}>
      <Icon name={icon} size={18} className="pointer-events-none absolute top-1/2 left-[15px] -translate-y-1/2 text-icon" />
      <input {...props} autoComplete="off" spellCheck={false}
        className={cx('h-[52px] w-full rounded-[10px] border bg-surface pr-[42px] pl-[46px] outline-none transition placeholder:text-ink-3 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-ring)]',
          bad ? 'border-warn' : 'border-line')} />
      {loading && <span aria-hidden className="absolute top-1/2 right-[15px] -mt-2 size-4 animate-spin-fast rounded-full border-2 border-line border-t-accent" />}
    </div>
  );
}

export function Status({ tone = 'muted', children }: { tone?: 'muted' | 'ok' | 'bad'; children: ReactNode }) {
  return (
    <p className={cx('flex items-center gap-1.5 pl-0.5 text-[12.5px] tabular-nums', tone === 'ok' ? 'text-good' : tone === 'bad' ? 'text-warn' : 'text-ink-3')}>
      <span className="size-1.5 shrink-0 rounded-full bg-current" />{children}
    </p>
  );
}

export function Tag({ tone, children }: { tone: 'sample' | 'fit' | 'open' | 'used' | 'live'; children: ReactNode }) {
  const tones = {
    sample: 'bg-warn-soft text-warn tracking-wide',
    fit: 'bg-accent-soft text-accent shadow-[inset_0_0_0_1px_var(--color-accent-ring)]',
    open: 'bg-good-soft text-good',
    used: 'bg-surface-2 text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]',
    live: 'bg-good-soft text-good tracking-wide',
  };
  return <span className={cx('rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap', tones[tone])}>{children}</span>;
}

export function Panel({ title, tag, children }: { title: ReactNode; tag?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-line bg-surface-2 px-[18px] py-4 text-left">
      <h2 className="flex flex-wrap items-center gap-2 text-sm font-medium"><Icon name="spark" size={16} className="text-accent" />{title}{tag}</h2>
      {children}
    </div>
  );
}

export function Sparkline({ values, width = 76, height = 24 }: { values: number[]; width?: number; height?: number }) {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => [i * width / (values.length - 1), height - 2 - (v - min) / (max - min || 1) * (height - 6)]);
  const line = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden className="overflow-visible">
      <path d={`M0,${height} L${line.replace(/ /g, ' L')} L${width},${height} Z`} fill="var(--color-accent)" fillOpacity={0.1} />
      <polyline points={line} fill="none" stroke="var(--color-accent)" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={2.6} fill="var(--color-accent)" />
    </svg>
  );
}

export function Stat({ value, label, children }: { value: ReactNode; label: string; children?: ReactNode }) {
  return (
    <span className="block">
      <b className="block font-medium tabular-nums">{value}</b>
      <span className="text-[11.5px] text-ink-3">{label}</span>
      {children}
    </span>
  );
}

/** Plain <img> on purpose: images come from whatever site the user pastes, so next/image's host allowlist doesn't fit. */
export function RemoteImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" />;
}
