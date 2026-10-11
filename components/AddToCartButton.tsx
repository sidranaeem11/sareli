'use client';

import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/data';

type P = Pick<Product, 'id' | 'name' | 'price' | 'image_url'>;

export default function AddToCartButton({
  product,
  variant = 'icon',
}: {
  product: P;
  variant?: 'icon' | 'full';
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className={`rounded-full border p-2 transition-colors ${
          added
            ? 'border-accent bg-accent text-white'
            : 'border-accent/50 text-accent-light hover:bg-accent hover:text-white'
        }`}
      >
        {added ? <Check size={14} /> : <ShoppingBag size={14} />}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-full border border-line bg-card">
        <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-accent-light">
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
        <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-accent-light">
          <Plus size={14} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-light"
      >
        {added ? 'Added to cart' : 'Add to cart'}
      </button>
    </div>
  );
}
