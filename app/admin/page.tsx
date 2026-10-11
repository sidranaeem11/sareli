'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { CategoriesPanel, OrdersPanel, ProductsPanel, SiteImagesPanel, input } from './panels';

type Tab = 'orders' | 'products' | 'categories' | 'site';
const TABS: { id: Tab; label: string }[] = [
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'site', label: 'Site images' },
];

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) return <main className="mx-auto max-w-md px-5 py-24 text-center text-muted">Pehle .env.local mein Supabase keys daalo.</main>;
  if (checking) return <main className="mx-auto max-w-md px-5 py-24 text-center text-muted">Loading...</main>;
  if (!session) return <Login />;
  return <Dashboard />;
}

function Login() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get('email')),
      password: String(f.get('password')),
    });
    setBusy(false);
    if (error) setError('Email ya password galat hai.');
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-4xl font-medium">Admin login</h1>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className={input} />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={input} />
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-light disabled:opacity-60">
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>('products');
  const tabCls = (on: boolean) =>
    `rounded-full px-5 py-2 text-sm ${on ? 'bg-accent text-white' : 'border border-line text-cream/80 hover:border-accent/50'}`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-medium">Admin</h1>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={tabCls(tab === t.id)}>{t.label}</button>
          ))}
          <button onClick={() => supabase?.auth.signOut()} className="rounded-full border border-line px-5 py-2 text-sm text-muted hover:text-cream">
            Sign out
          </button>
        </div>
      </div>
      <div className="mt-8">
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'products' && <ProductsPanel />}
        {tab === 'categories' && <CategoriesPanel />}
        {tab === 'site' && <SiteImagesPanel />}
      </div>
    </main>
  );
}
