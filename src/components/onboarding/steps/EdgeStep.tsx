import { useState } from 'react';
import { beliefsFor, exampleHooks, toggle } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { btn, cardClass, CheckCircle, cx, InputWithIcon, Panel, Tag } from '../ui';

export default function EdgeStep({ s, set }: StepProps) {
  const [own, setOwn] = useState('');
  const hooks = exampleHooks(s);

  const add = () => {
    const v = own.trim().slice(0, 160);
    if (v.length < 4) return;
    set(p => ({ ...p, own: [...p.own, v] }));
    setOwn('');
  };

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-3">
      <form className="flex gap-2.5" onSubmit={e => { e.preventDefault(); add(); }}>
        <InputWithIcon icon="plus" aria-label="Write your own belief" placeholder="In your words: what do you believe that competitors don’t?"
          value={own} onChange={e => setOwn(e.target.value)} className="min-w-0 flex-1" />
        <button type="submit" className={btn.ghost}>Add</button>
      </form>

      {s.own.map((b, i) => (
        <div key={`${i}-${b}`} className={cx(cardClass, 'flex items-center gap-3.5 border-accent bg-accent-soft px-4 py-3.5')}>
          <span className="min-w-0 flex-1"><span className="block font-medium">{b}</span><span className="text-[13.5px] text-ink-2">Written by you</span></span>
          <button type="button" aria-label="Remove this belief" onClick={() => set(p => ({ ...p, own: p.own.filter((_, j) => j !== i) }))}
            className="grid size-8 place-items-center rounded-lg border border-line bg-surface text-ink-2"><Icon name="x" size={16} /></button>
        </div>
      ))}

      <p className="mt-1 text-center text-sm font-medium">Or pick from these</p>
      {beliefsFor(s.niche).map(b => (
        <button key={b.id} type="button" role="checkbox" aria-checked={s.beliefs.includes(b.id)}
          onClick={() => set(p => ({ ...p, beliefs: toggle(p.beliefs, b.id) }))}
          className={cx(cardClass, 'group flex items-center gap-3.5 px-4 py-3.5')}>
          <span className="min-w-0 flex-1">
            <span className="block font-medium group-aria-checked:text-accent">{b.t}</span>
            <span className="text-[13.5px] text-ink-2">{b.vs}</span>
          </span>
          <CheckCircle on={s.beliefs.includes(b.id)} />
        </button>
      ))}

      {hooks.length > 0 && (
        <Panel title="Example hooks with your edge" tag={<Tag tone="sample">SAMPLE</Tag>}>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {hooks.map(([hook, from]) => (
              <li key={hook} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-[14.5px]">
                {hook}<span className="mt-0.5 block text-xs text-ink-3">{from}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
