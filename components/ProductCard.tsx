import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Star } from 'lucide-react';
import type { Product } from '@/lib/data';
import { rs } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-card transition-shadow hover:shadow-glow">
      {p.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
          {p.badge}
        </span>
      )}
      <Link href={`/product/${p.id}`} aria-label={p.name} className="block">
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-line/60 to-card">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 50vw, 200px" className="object-contain p-4" />
          ) : (
            <Sparkles className="text-accent/40" size={32} aria-hidden />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-medium leading-snug">
          <Link href={`/product/${p.id}`} className="hover:text-accent-light">{p.name}</Link>
        </h3>
        <p className="font-semibold text-accent-light">{rs(p.price)}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Star size={12} className="fill-accent text-accent" aria-hidden />
            {p.rating} ({p.reviews})
          </span>
          <AddToCartButton product={p} />
        </div>
      </div>
    </div>
  );
}
