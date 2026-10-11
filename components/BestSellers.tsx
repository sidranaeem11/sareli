import Link from 'next/link';
import type { Product } from '@/lib/data';
import ProductCard from './ProductCard';

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section id="best-sellers" className="mx-auto max-w-7xl px-5 py-16">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-3xl font-medium">Best sellers</h2>
        <Link href="/shop" className="text-sm text-accent-light hover:underline">View all</Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {products.map((p) => (
          <li key={p.id}><ProductCard p={p} /></li>
        ))}
      </ul>
    </section>
  );
}
