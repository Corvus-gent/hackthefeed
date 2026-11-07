import { useState } from 'react';
import type { Product } from '@/lib/onboarding/data';
import { hostOf } from '@/lib/onboarding/state';
import type { StepProps } from '../Onboarding';
import { Icon } from '../icons';
import { btn, CheckCircle, cx, InputWithIcon, RemoteImage } from '../ui';

export default function ProductsStep({ s, set }: StepProps) {
  const [name, setName] = useState('');
  const imported = s.products.filter(p => p.imported).length;

  const update = (id: string, fn: (p: Product) => Product) =>
    set(st => ({ ...st, products: st.products.map(p => (p.id === id ? fn(p) : p)) }));

  // ponytail: uploads stay in the browser as object URLs; send them to storage when products are saved for real.
  const addImages = (id: string, files: FileList | null) => {
    const urls = [...(files ?? [])].filter(f => f.type.startsWith('image/')).map(f => URL.createObjectURL(f));
    if (urls.length) update(id, p => ({ ...p, images: [...p.images, ...urls], selected: true }));
  };

  const addProduct = () => {
    const title = name.trim();
    if (!title) return;
    set(st => ({ ...st, products: [...st.products, { id: `own-${Date.now()}`, title, images: [], selected: true, imported: false }] }));
    setName('');
  };

  return (
    <div className="flex w-full max-w-[900px] flex-col items-center gap-5">
      <p className="text-center text-sm text-ink-2">
        {s.siteSt === 'done' && imported > 0
          ? `Found ${imported} products on ${hostOf(s.site)}. Pick the ones videos should feature, and add more photos if you have them.`
          : 'Add the products videos should feature, with a few photos of each.'}
      </p>

      {s.products.length > 0 && (
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {s.products.map(p => (
            <div key={p.id}
              className={cx('flex flex-col overflow-hidden rounded-[10px] border bg-surface transition',
                p.selected ? 'border-accent shadow-[inset_0_0_0_1px_var(--color-accent),0_0_0_3px_var(--color-accent-ring)]' : 'border-line hover:border-accent/45')}>
              <button type="button" role="checkbox" aria-checked={p.selected} onClick={() => update(p.id, x => ({ ...x, selected: !x.selected }))}
                className="relative block text-left">
                <span className="grid aspect-square place-items-center bg-surface-2">
                  {p.images[0]
                    ? <RemoteImage src={p.images[0]} alt={p.title} className="size-full object-cover" />
                    : <Icon name="can" size={40} stroke={1.2} className="text-icon" />}
                </span>
                <CheckCircle on={p.selected} onImage className="absolute top-2 right-2" />
                <span className="block px-3 pt-2.5 text-[14.5px] leading-tight font-medium">{p.title}</span>
                <span className="block px-3 text-xs text-ink-3">{p.imported ? 'From your website' : 'Added by you'}</span>
              </button>
              <div className="flex items-center gap-1.5 px-3 pt-2 pb-3">
                {p.images.slice(1, 4).map(src => (
                  <RemoteImage key={src} src={src} alt="" className="size-8 rounded-md border border-line object-cover" />
                ))}
                <label className="grid size-8 cursor-pointer place-items-center rounded-md border border-dashed border-ink-3/60 text-ink-2 hover:border-accent hover:text-accent"
                  title={`Add photos of ${p.title}`}>
                  <Icon name="plus" size={14} stroke={2} />
                  <span className="sr-only">Add photos of {p.title}</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={e => { addImages(p.id, e.target.files); e.target.value = ''; }} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="flex w-full max-w-[480px] gap-2.5" onSubmit={e => { e.preventDefault(); addProduct(); }}>
        <InputWithIcon icon="plus" aria-label="Add a product" placeholder="Add a product by name" value={name}
          onChange={e => setName(e.target.value)} className="min-w-0 flex-1" />
        <button type="submit" className={btn.ghost}>Add</button>
      </form>
    </div>
  );
}
