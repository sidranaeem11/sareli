'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { supabase } from '@/lib/supabase';
import { rs, shippingFor } from '@/lib/format';
import { SITE } from '@/lib/config';

const input =
  'w-full rounded-xl border border-line bg-card px-4 py-3 text-sm placeholder:text-muted focus:border-accent focus:outline-none';

export default function Checkout() {
  const { items, total, clear, ready } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const shipping = shippingFor(total);
  const grand = total + shipping;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!supabase) {
      setError('Database connect nahi hai. .env.local mein Supabase keys daalo.');
      return;
    }
    const f = new FormData(e.currentTarget);
    const id = crypto.randomUUID();
    setBusy(true);

    const { error: orderErr } = await supabase.from('orders').insert({
      id,
      customer_name: String(f.get('name')).trim(),
      phone: String(f.get('phone')).trim(),
      city: String(f.get('city')).trim(),
      address: String(f.get('address')).trim(),
      notes: String(f.get('notes') || '').trim() || null,
      payment_method: payment,
      subtotal: total,
      shipping,
      total: grand,
    });

    if (orderErr) {
      setBusy(false);
      setError('Order save nahi hua. Dobara try karo.');
      return;
    }

    const { error: itemsErr } = await supabase.from('order_items').insert(
      items.map((i) => ({
        order_id: id,
        product_id: i.id,
        product_name: i.name,
        price: i.price,
        qty: i.qty,
      }))
    );

    if (itemsErr) {
      setBusy(false);
      setError('Order ki items save nahi huin. Hamein WhatsApp par batao.');
      return;
    }

    setDone(true);
    clear();
    router.push(`/order-success?id=${id.slice(0, 8).toUpperCase()}`);
  }

  if (!ready) return <main className="mx-auto max-w-5xl px-5 py-16 text-muted">Loading...</main>;

  if (items.length === 0 && !done) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Nothing to check out</h1>
        <Link href="/shop" className="mt-6 inline-block text-accent-light hover:underline">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl font-medium">Checkout</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <input name="name" required placeholder="Full name" autoComplete="name" className={input} />
          <input name="phone" required type="tel" placeholder="Phone number (03xx-xxxxxxx)" autoComplete="tel" className={input} />
          <input name="city" required placeholder="City" autoComplete="address-level2" className={input} />
          <textarea name="address" required rows={3} placeholder="Full delivery address" autoComplete="street-address" className={input} />
          <textarea name="notes" rows={2} placeholder="Notes (optional)" className={input} />

          <fieldset className="pt-2">
            <legend className="mb-3 text-sm font-semibold">Payment method</legend>
            <div className="space-y-2">
              {([
                ['cod', 'Cash on delivery'],
                ['jazzcash', 'JazzCash'],
                ['easypaisa', 'Easypaisa'],
              ] as const).map(([val, label]) => (
                <label key={val} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${payment === val ? 'border-accent bg-accent/10' : 'border-line'}`}>
                  <input type="radio" name="payment" checked={payment === val} onChange={() => setPayment(val)} className="accent-blue-500" />
                  {label}
                </label>
              ))}
            </div>
            {payment !== 'cod' && (
              <p className="mt-3 rounded-xl bg-card p-4 text-sm leading-relaxed text-muted">
                Order place karne ke baad <span className="text-cream">{rs(grand)}</span> is number par bhejo:{' '}
                <span className="text-cream">{payment === 'jazzcash' ? SITE.jazzcash : SITE.easypaisa}</span>, aur payment ka screenshot hamein WhatsApp par bhejo. Screenshot milne par order confirm hoga.
              </p>
            )}
          </fieldset>
        </div>

        <aside className="h-fit rounded-2xl border border-accent/30 bg-card p-6">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-muted">{i.name} x {i.qty}</span>
                <span>{rs(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{shipping === 0 ? 'Free' : rs(shipping)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="text-accent-light">{rs(grand)}</dd></div>
          </dl>
          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
          <button disabled={busy} className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-white shadow-glow hover:bg-accent-light disabled:opacity-60">
            {busy ? 'Placing order...' : 'Place order'}
          </button>
        </aside>
      </form>
    </main>
  );
}
