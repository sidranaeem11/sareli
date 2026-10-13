import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts, type Section } from '@/lib/data';

export const metadata = { title: 'Shop | Sareli' };

export default async function Shop({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; section?: string };
}) {
  const { category, q } = searchParams;
  const section: Section | undefined =
    searchParams.section === 'apparel' ? 'apparel' : searchParams.section === 'beauty' ? 'beauty' : undefined;

  const [categories, products] = await Promise.all([
    getCategories(section),
    getProducts({ category, q, section }),
  ]);
  const active = categories.find((c) => c.id === category);

  const href = (cat?: string) => {
    const p = new URLSearchParams();
    if (section) p.set('section', section);
    if (cat) p.set('category', cat);
    const s = p.toString();
    return s ? `/shop?${s}` : '/shop';
  };

  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
      on ? 'border-accent bg-accent/15 text-accent-light' : 'border-line text-cream/80 hover:border-accent/50'
    }`;

  const title = q
    ? `Results for "${q}"`
    : active
    ? active.name
    : section === 'apparel'
    ? 'Jackets & Hoodies'
    : section === 'beauty'
    ? 'Beauty tools'
    : 'All products';

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="font-display text-4xl font-medium">{title}</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Link href={href()} className={chip(!category)}>All</Link>
        {categories.map((c) => (
          <Link key={c.id} href={href(c.id)} className={chip(c.id === category)}>
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center text-muted">
          <p>No products found.</p>
          <Link href="/shop" className="mt-3 inline-block text-accent-light hover:underline">Show all products</Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}><ProductCard p={p} /></li>
          ))}
        </ul>
      )}
    </main>
  );
}
