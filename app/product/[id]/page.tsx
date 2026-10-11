import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Star } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { getProduct } from '@/lib/data';
import { rs } from '@/lib/format';
import { SITE } from '@/lib/config';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  return { title: p ? `${p.name} | Sareli` : 'Product | Sareli' };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  if (!p) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/shop" className="text-sm text-muted hover:text-accent-light">&larr; Back to shop</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-b from-line/60 to-card shadow-glow">
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-8" priority />
          ) : (
            <Sparkles size={64} className="text-accent/40" aria-hidden />
          )}
        </div>

        <div className="flex flex-col justify-center gap-5">
          {p.badge && (
            <span className="w-fit rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-white">{p.badge}</span>
          )}
          <h1 className="font-display text-4xl font-medium leading-tight">{p.name}</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Star size={14} className="fill-accent text-accent" aria-hidden />
            {p.rating} ({p.reviews} reviews)
          </p>
          <p className="text-3xl font-semibold text-accent-light">{rs(p.price)}</p>
          {p.description && <p className="max-w-md leading-relaxed text-muted">{p.description}</p>}
          <AddToCartButton product={p} variant="full" />
          <p className="text-xs text-muted">
            Free shipping above {rs(SITE.freeShippingAbove)}. Easy returns.
          </p>
        </div>
      </div>
    </main>
  );
}
