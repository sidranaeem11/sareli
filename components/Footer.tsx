import Link from 'next/link';
import { SITE } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:flex-row">
        <p className="font-display text-xl text-cream">{SITE.name}</p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/shop" className="hover:text-accent-light">Shop</Link>
          <Link href="/about" className="hover:text-accent-light">About</Link>
          <Link href="/contact" className="hover:text-accent-light">Contact</Link>
          <Link href="/admin" className="hover:text-accent-light">Admin</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
