'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { SITE } from '@/lib/config';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/#categories' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function NavLinks({ className = '' }: { className?: string }) {
  const path = usePathname();
  return (
    <nav aria-label="Main" className={className}>
      {links.map((l) => {
        const active = l.href === path;
        return (
          <Link
            key={l.label}
            href={l.href}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors hover:text-accent-light ${
              active ? 'bg-accent/15 text-accent-light' : 'text-cream/80'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="bg-accent-deep/40 px-4 py-2 text-center text-xs text-cream/90">
        Free shipping on orders above Rs. {SITE.freeShippingAbove.toLocaleString('en-PK')}
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
        <Link href="/" className="font-display text-3xl font-semibold tracking-wide">
          {SITE.name}
          <span className="-mt-1 block font-body text-[9px] font-normal tracking-[0.25em] text-muted">
            BEAUTY TOOLS &amp; MORE
          </span>
        </Link>

        <NavLinks className="ml-6 hidden gap-1 lg:flex" />

        <form action="/shop" role="search" className="ml-auto hidden max-w-xs flex-1 items-center rounded-full border border-line bg-card px-4 py-2 md:flex">
          <input
            type="search"
            name="q"
            placeholder="Search beauty tools..."
            aria-label="Search"
            className="w-full bg-transparent text-sm placeholder:text-muted focus:outline-none"
          />
          <button type="submit" aria-label="Search" className="text-muted hover:text-accent-light">
            <Search size={16} />
          </button>
        </form>

        <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative ml-auto p-1 hover:text-accent-light md:ml-0">
          <ShoppingBag size={22} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
      <NavLinks className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden" />
    </header>
  );
}
