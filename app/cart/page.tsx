'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { rs, shippingFor } from '@/lib/format';
import { SITE } from '@/lib/config';

export default function CartPage() {
  const { items, total, setQty, remove, ready } = useCart();
  const shipping = shippingFor(total);

  if (!ready) return <main className="mx-auto max-w-5xl px-5 py-16 text-muted">Loading cart...</main>;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Your cart is empty</h1>
        <p className="mt-3 text-muted">Add a few tools and they will show up here.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-light">
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl font-medium">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-4 p-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-line/50">
                {i.image_url ? (
                  <Image src={i.image_url} alt={i.name} fill sizes="80px" className="object-contain p-2" />
                ) : (
                  <Sparkles className="text-accent/40" aria-hidden />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                {i.size && <p className="text-xs text-muted">Size: {i.size}</p>}
                <p className="text-sm text-accent-light">{rs(i.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button aria-label="Decrease quantity" onClick={() => setQty(i.key, i.qty - 1)} className="p-2 hover:text-accent-light"><Minus size={12} /></button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => setQty(i.key, i.qty + 1)} className="p-2 hover:text-accent-light"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => remove(i.key)} aria-label={`Remove ${i.name}`} className="text-muted hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold">{rs(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-accent/30 bg-card p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{rs(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{shipping === 0 ? 'Free' : rs(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd className="text-accent-light">{rs(total + shipping)}</dd></div>
          </dl>
          {shipping > 0 && (
            <p className="mt-3 text-xs text-muted">Add {rs(SITE.freeShippingAbove - total)} more for free shipping.</p>
          )}
          <Link href="/checkout" className="mt-6 block rounded-full bg-accent py-3 text-center text-sm font-semibold text-white shadow-glow hover:bg-accent-light">
            Go to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
