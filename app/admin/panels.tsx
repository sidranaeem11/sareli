'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { deleteImage, uploadImage } from '@/lib/upload';
import type { Category, Product } from '@/lib/data';
import { rs } from '@/lib/format';

export const input =
  'w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none';
const fileInput =
  'w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white';
const primaryBtn =
  'rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-light disabled:opacity-60';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function Thumb({ url, size = 'h-12 w-12' }: { url: string | null; size?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="" className={`${size} shrink-0 rounded-lg object-cover`} /> : <div className={`${size} shrink-0 rounded-lg bg-line/60`} />;
}

/* ------------------------------ Orders ------------------------------ */

type OrderItem = { id: string; product_name: string; price: number; qty: number; size?: string | null };
type Order = {
  id: string; customer_name: string; phone: string; city: string; address: string;
  notes: string | null; payment_method: string; total: number; status: string;
  created_at: string; order_items: OrderItem[];
};
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    if (!supabase) return;
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  if (loading) return <p className="text-muted">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-muted">Abhi koi order nahi aaya.</p>;

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border border-line bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">#{o.id.slice(0, 8).toUpperCase()} &middot; {o.customer_name}</p>
              <p className="text-sm text-muted">{o.phone} &middot; {o.city}</p>
              <p className="text-sm text-muted">{o.address}</p>
              {o.notes && <p className="text-sm text-muted">Note: {o.notes}</p>}
            </div>
            <div className="text-right">
              <p className="font-semibold text-accent-light">{rs(o.total)}</p>
              <p className="text-xs text-muted">{o.payment_method.toUpperCase()} &middot; {new Date(o.created_at).toLocaleString('en-PK')}</p>
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} aria-label="Order status" className="mt-2 rounded-lg border border-line bg-ink px-3 py-1.5 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <ul className="mt-3 border-t border-line pt-3 text-sm text-muted">
            {o.order_items.map((i) => <li key={i.id}>{i.product_name}{i.size ? ` (${i.size})` : ''} x {i.qty} &mdash; {rs(i.price * i.qty)}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------- Products ----------------------------- */

export function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts((p.data ?? []) as Product[]);
    setCategories((c.data ?? []) as Category[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get('image') as File | null;
    const removeImg = f.get('removeImage') === 'on';
    setBusy(true);
    setMsg('');
    try {
      let image_url = editing?.image_url ?? null;
      if (file && file.size > 0) {
        const url = await uploadImage(file);
        await deleteImage(editing?.image_url);
        image_url = url;
      } else if (removeImg && image_url) {
        await deleteImage(image_url);
        image_url = null;
      }
      const cat = categories.find((c) => c.id === String(f.get('category')));
      const row = {
        name: String(f.get('name')).trim(),
        price: Number(f.get('price')),
        category_id: String(f.get('category')) || null,
        section: cat?.section ?? 'beauty',
        sizes: String(f.get('sizes') || '').trim() || null,
        badge: String(f.get('badge') || '').trim() || null,
        description: String(f.get('description') || '').trim() || null,
        is_best_seller: f.get('best') === 'on',
        image_url,
      };
      const { error } = editing
        ? await supabase.from('products').update(row).eq('id', editing.id)
        : await supabase.from('products').insert(row);
      if (error) throw new Error(error.message);
      form.reset();
      setEditing(null);
      setMsg('Save ho gaya. Site par 1 minute mein nazar aayega.');
      load();
    } catch (err) {
      setMsg(errMsg(err));
    }
    setBusy(false);
  }

  async function remove(p: Product) {
    if (!supabase || !confirm(`"${p.name}" delete karna hai?`)) return;
    await deleteImage(p.image_url);
    await supabase.from('products').delete().eq('id', p.id);
    setProducts((x) => x.filter((i) => i.id !== p.id));
    if (editing?.id === p.id) setEditing(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} onSubmit={save} className="h-fit space-y-3 rounded-2xl border border-accent/30 bg-card p-5">
        <h2 className="font-display text-2xl">{editing ? 'Edit product' : 'Add product'}</h2>
        <input name="name" required placeholder="Product name" defaultValue={editing?.name} className={input} />
        <input name="price" required type="number" min={1} placeholder="Price (Rs.)" defaultValue={editing?.price} className={input} />
        <select name="category" defaultValue={editing?.category_id ?? ''} className={input}>
          <option value="">Category chuno</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.section === 'apparel' ? ' (Apparel)' : ''}</option>)}
        </select>
        <input name="badge" placeholder="Badge (e.g. New, 20% OFF)" defaultValue={editing?.badge ?? ''} className={input} />
        <input name="sizes" placeholder="Sizes: S,M,L,XL (sirf kapron ke liye, warna khali)" defaultValue={editing?.sizes ?? ''} className={input} />
        <textarea name="description" rows={3} placeholder="Description" defaultValue={editing?.description ?? ''} className={input} />
        {editing?.image_url && (
          <div className="flex items-center gap-3">
            <Thumb url={editing.image_url} size="h-16 w-16" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="removeImage" className="accent-blue-500" /> Image hata do
            </label>
          </div>
        )}
        <label className="block text-xs text-muted">
          {editing?.image_url ? 'Nayi image (purani badal jayegi)' : 'Image'}
          <input name="image" type="file" accept="image/*" className={`mt-1 ${fileInput}`} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="best" defaultChecked={editing?.is_best_seller} className="accent-blue-500" /> Best seller (home page par dikhao)
        </label>
        {msg && <p role="status" className="text-sm text-accent-light">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className={`flex-1 ${primaryBtn}`}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add product'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setMsg(''); }} className="rounded-full border border-line px-4 text-sm text-muted hover:text-cream">
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className={`flex items-center gap-4 rounded-xl border bg-card p-3 ${editing?.id === p.id ? 'border-accent' : 'border-line'}`}>
            <Thumb url={p.image_url} />
            <div className="flex-1">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted">{rs(p.price)}{p.is_best_seller ? ' · Best seller' : ''}</p>
            </div>
            <button onClick={() => { setEditing(p); setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm text-accent-light hover:underline">Edit</button>
            <button onClick={() => remove(p)} className="text-sm text-red-400 hover:underline">Delete</button>
          </li>
        ))}
        {products.length === 0 && <p className="text-muted">Abhi koi product nahi.</p>}
      </ul>
    </div>
  );
}

/* ---------------------------- Categories ---------------------------- */

export function CategoriesPanel() {
  const [cats, setCats] = useState<(Category & { sort_order?: number })[]>([]);
  const [editing, setEditing] = useState<(Category & { sort_order?: number }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCats((data ?? []) as Category[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get('image') as File | null;
    const removeImg = f.get('removeImage') === 'on';
    setBusy(true);
    setMsg('');
    try {
      let image_url = editing?.image_url ?? null;
      if (file && file.size > 0) {
        const url = await uploadImage(file);
        await deleteImage(editing?.image_url);
        image_url = url;
      } else if (removeImg && image_url) {
        await deleteImage(image_url);
        image_url = null;
      }
      const row = {
        name: String(f.get('name')).trim(),
        tagline: String(f.get('tagline') || '').trim() || null,
        section: String(f.get('section') || 'beauty'),
        sort_order: Number(f.get('sort_order') || 0),
        image_url,
      };
      const { error } = editing
        ? await supabase.from('categories').update(row).eq('id', editing.id)
        : await supabase.from('categories').insert(row);
      if (error) throw new Error(error.message);
      form.reset();
      setEditing(null);
      setMsg('Save ho gaya.');
      load();
    } catch (err) {
      setMsg(errMsg(err));
    }
    setBusy(false);
  }

  async function remove(c: Category) {
    if (!supabase || !confirm(`"${c.name}" category delete karni hai? Is ke products delete nahi honge.`)) return;
    await deleteImage(c.image_url);
    await supabase.from('categories').delete().eq('id', c.id);
    setCats((x) => x.filter((i) => i.id !== c.id));
    if (editing?.id === c.id) setEditing(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form key={editing?.id ?? 'new'} onSubmit={save} className="h-fit space-y-3 rounded-2xl border border-accent/30 bg-card p-5">
        <h2 className="font-display text-2xl">{editing ? 'Edit category' : 'Add category'}</h2>
        <input name="name" required placeholder="Category name" defaultValue={editing?.name} className={input} />
        <input name="tagline" placeholder="Tagline (e.g. Shape Your Brows)" defaultValue={editing?.tagline ?? ''} className={input} />
        <select name="section" defaultValue={editing?.section ?? 'beauty'} className={input}>
          <option value="beauty">Beauty tools</option>
          <option value="apparel">Jackets &amp; Hoodies (Apparel)</option>
        </select>
        <input name="sort_order" type="number" placeholder="Order (1, 2, 3...)" defaultValue={editing?.sort_order ?? cats.length + 1} className={input} />
        {editing?.image_url && (
          <div className="flex items-center gap-3">
            <Thumb url={editing.image_url} size="h-16 w-16" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="removeImage" className="accent-blue-500" /> Image hata do
            </label>
          </div>
        )}
        <label className="block text-xs text-muted">
          {editing?.image_url ? 'Nayi image (purani badal jayegi)' : 'Image'}
          <input name="image" type="file" accept="image/*" className={`mt-1 ${fileInput}`} />
        </label>
        {msg && <p role="status" className="text-sm text-accent-light">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className={`flex-1 ${primaryBtn}`}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add category'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setMsg(''); }} className="rounded-full border border-line px-4 text-sm text-muted hover:text-cream">
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {cats.map((c) => (
          <li key={c.id} className={`flex items-center gap-4 rounded-xl border bg-card p-3 ${editing?.id === c.id ? 'border-accent' : 'border-line'}`}>
            <Thumb url={c.image_url} />
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted">{c.tagline}{c.section === 'apparel' ? ' · Apparel' : ''}</p>
            </div>
            <button onClick={() => { setEditing(c); setMsg(''); }} className="text-sm text-accent-light hover:underline">Edit</button>
            <button onClick={() => remove(c)} className="text-sm text-red-400 hover:underline">Delete</button>
          </li>
        ))}
        {cats.length === 0 && <p className="text-muted">Abhi koi category nahi.</p>}
      </ul>
    </div>
  );
}

/* --------------------------- Site images ---------------------------- */

export function SiteImagesPanel() {
  const [hero, setHero] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('value').eq('key', 'hero_image').maybeSingle().then(({ data }) => {
      setHero(data?.value ?? null);
      setLoading(false);
    });
  }, []);

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = e.currentTarget;
    const file = new FormData(form).get('image') as File | null;
    if (!file || file.size === 0) {
      setMsg('Pehle image chuno.');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const url = await uploadImage(file);
      const { error } = await supabase.from('site_settings').upsert({ key: 'hero_image', value: url });
      if (error) throw new Error(error.message);
      await deleteImage(hero);
      setHero(url);
      form.reset();
      setMsg('Hero image save ho gayi. Home page par 1 minute mein nazar aayegi.');
    } catch (err) {
      setMsg(errMsg(err));
    }
    setBusy(false);
  }

  async function remove() {
    if (!supabase || !hero || !confirm('Hero image hata deni hai?')) return;
    await supabase.from('site_settings').delete().eq('key', 'hero_image');
    await deleteImage(hero);
    setHero(null);
    setMsg('Hero image hata di gayi.');
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-xl rounded-2xl border border-accent/30 bg-card p-5">
      <h2 className="font-display text-2xl">Home page hero image</h2>
      <p className="mt-1 text-sm text-muted">Ye image home page ke top par "Small Tools, Big Confidence" ke saath dikhti hai. Behtar size: 1200 x 900.</p>
      <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-line/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {hero ? <img src={hero} alt="Hero" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Abhi koi image nahi</div>}
      </div>
      <form onSubmit={upload} className="mt-4 space-y-3">
        <input name="image" type="file" accept="image/*" className={fileInput} />
        {msg && <p role="status" className="text-sm text-accent-light">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className={primaryBtn}>{busy ? 'Uploading...' : hero ? 'Replace image' : 'Upload image'}</button>
          {hero && <button type="button" onClick={remove} className="rounded-full border border-red-400/50 px-5 text-sm text-red-400 hover:bg-red-400/10">Delete</button>}
        </div>
      </form>
    </div>
  );
}
