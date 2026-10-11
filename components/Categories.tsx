import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { Category } from '@/lib/data';

export default function Categories({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-5 py-16">
      <h2 className="text-center font-display text-3xl font-medium">Shop by category</h2>
      <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/shop?category=${c.id}`} className="group flex flex-col items-center text-center">
              <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-card transition-shadow group-hover:shadow-glow">
                {c.image_url ? (
                  <Image src={c.image_url} alt={c.name} fill sizes="96px" className="object-cover" />
                ) : (
                  <Sparkles className="text-accent-light" aria-hidden />
                )}
              </span>
              <span className="mt-3 text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-muted">{c.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
