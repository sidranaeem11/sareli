'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  key: string; // id ya id:size, taake ek hi hoodie ke alag sizes alag lines banein
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string | null;
  qty: number;
};

type NewItem = { id: string; name: string; price: number; image_url: string | null; size?: string | null };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (p: NewItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'sareli-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartItem>[];
        setItems(parsed.map((i) => ({ ...i, size: i.size ?? null, key: i.key ?? i.id }) as CartItem));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((p: NewItem, qty = 1) => {
    const size = p.size ?? null;
    const key = size ? `${p.id}:${size}` : p.id;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      return found
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { key, id: p.id, name: p.name, price: p.price, image_url: p.image_url, size, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}
