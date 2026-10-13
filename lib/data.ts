import { supabase } from './supabase';

export type Category = {
  id: string;
  name: string;
  tagline: string | null;
  image_url: string | null;
  section: string | null; // 'beauty' | 'apparel'
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  price: number;
  badge: string | null;
  rating: number;
  reviews: number;
  image_url: string | null;
  description: string | null;
  is_best_seller: boolean;
  section: string | null; // 'beauty' | 'apparel'
  sizes: string | null;   // "S,M,L,XL" (sirf kapron ke liye)
};

export type Section = 'beauty' | 'apparel';

const c = (id: string, name: string, tagline: string, section: Section = 'beauty'): Category => ({
  id, name, tagline, image_url: null, section,
});

const sampleCategories: Category[] = [
  c('1', 'Tweezers', 'Shape Your Brows'),
  c('2', 'Hair Scissors', 'Perfect Cuts'),
  c('3', 'Eyebrow Razors', 'Clean & Smooth'),
  c('4', 'Nail Care', 'Healthy Nails'),
  c('5', 'Makeup Brushes', 'Blend Like a Pro'),
  c('6', 'Eyelash Tools', 'Lift & Define'),
  c('7', 'Accessories', 'Complete Your Kit'),
  c('8', 'Jackets', 'Layer Up in Style', 'apparel'),
  c('9', 'Hoodies', 'Soft, Warm, Everyday', 'apparel'),
];

const mk = (
  id: string, category_id: string, name: string, price: number, badge: string | null,
  rating: number, reviews: number, description: string,
  section: Section = 'beauty', sizes: string | null = null
): Product => ({
  id, category_id, name, price, badge, rating, reviews, image_url: null, description,
  is_best_seller: section === 'beauty', section, sizes,
});

const sampleProducts: Product[] = [
  mk('1', '1', 'Precision Tweezer Set', 1299, '20% OFF', 5, 124, 'Stainless steel tweezers with a fine, aligned tip for clean brow shaping.'),
  mk('2', '2', 'Professional Hair Scissors', 1899, 'Best Seller', 5, 98, 'Sharp, balanced scissors for smooth trims and precise cuts at home.'),
  mk('3', '3', 'Eyebrow Razor (Pack of 3)', 849, null, 4.5, 76, 'Gentle razors that clean and define brows without irritation.'),
  mk('4', '4', 'Nail Clipper Set', 799, null, 5, 82, 'Durable clippers with a clean cut for fingers and toes.'),
  mk('5', '5', 'Makeup Brush Set (5 Pcs.)', 1599, 'New', 5, 110, 'Soft, dense bristles for even blending of face and eye makeup.'),
  mk('6', '6', 'Eyelash Curler', 899, null, 4.5, 87, 'Comfortable curve with a silicone pad for lifted, defined lashes.'),
  mk('a1', '9', 'Classic Pullover Hoodie', 3499, 'New', 5, 64, 'Soft fleece-lined hoodie with a relaxed everyday fit.', 'apparel', 'S,M,L,XL'),
  mk('a2', '9', 'Zip-Up Hoodie', 3999, null, 4.5, 41, 'Midweight zip hoodie with front pockets and a clean finish.', 'apparel', 'S,M,L,XL'),
  mk('a3', '8', 'Quilted Winter Jacket', 6499, 'Best Seller', 5, 38, 'Warm quilted jacket with a soft lining for cold days.', 'apparel', 'S,M,L,XL'),
  mk('a4', '8', 'Denim Jacket', 4999, null, 4.5, 27, 'Classic denim jacket that layers over anything.', 'apparel', 'S,M,L,XL'),
];

const inSection = (s: string | null | undefined, want?: Section) =>
  !want || (s ?? 'beauty') === want;

export async function getCategories(section?: Section): Promise<Category[]> {
  const fallback = () => sampleCategories.filter((x) => inSection(x.section, section));
  if (!supabase) return fallback();
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error || !data || data.length === 0) return fallback();
  return (data as Category[]).filter((x) => inSection(x.section, section));
}

export async function getBestSellers(): Promise<Product[]> {
  const fallback = () => sampleProducts.filter((p) => p.is_best_seller && inSection(p.section, 'beauty'));
  if (!supabase) return fallback();
  const { data, error } = await supabase.from('products').select('*').eq('is_best_seller', true);
  if (error || !data || data.length === 0) return fallback();
  return (data as Product[]).filter((p) => inSection(p.section, 'beauty')).slice(0, 6);
}

export async function getProducts(
  opts: { category?: string; q?: string; section?: Section } = {}
): Promise<Product[]> {
  const { category, q, section } = opts;
  const fallback = () =>
    sampleProducts.filter(
      (p) =>
        inSection(p.section, section) &&
        (!category || p.category_id === category) &&
        (!q || p.name.toLowerCase().includes(q.toLowerCase()))
    );
  if (!supabase) return fallback();

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category_id', category);
  if (q) query = query.ilike('name', `%${q}%`);
  const { data, error } = await query;
  if (error) return fallback();
  return ((data ?? []) as Product[]).filter((p) => inSection(p.section, section));
}

export async function getApparel(limit = 4): Promise<Product[]> {
  return (await getProducts({ section: 'apparel' })).slice(0, limit);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (data) return data as Product;
  }
  return sampleProducts.find((p) => p.id === id) ?? null;
}

export async function getHeroImage(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image').maybeSingle();
  return data?.value ?? null;
}
