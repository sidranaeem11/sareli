import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Features from '@/components/Features';
import BestSellers from '@/components/BestSellers';
import Story from '@/components/Story';
import { getBestSellers, getCategories, getHeroImage } from '@/lib/data';

export const revalidate = 60; // Supabase se data har 60 second baad refresh

export default async function Home() {
  const [categories, products, heroImage] = await Promise.all([
    getCategories(),
    getBestSellers(),
    getHeroImage(),
  ]);

  return (
    <main>
      <Hero image={heroImage} />
      <Categories categories={categories} />
      <Features />
      <BestSellers products={products} />
      <Story />
    </main>
  );
}
