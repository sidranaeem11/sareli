"use client";

import ProductCard from '@/components/ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  badge?: string | null;
  rating?: number;
  reviews?: number;
  image_url?: string | null;
};

export default function ApparelSection({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Jackets & Hoodies</h2>
          <p className="mt-1 text-sm text-muted">Layer up in style. Soft, warm, and made for everyday.</p>
        </div>
        <a href="/shop?section=apparel" className="text-sm text-accent hover:underline">
          View all
        </a>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
