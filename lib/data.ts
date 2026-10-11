import { supabase } from './supabase';

export type Category = {
  id: string;
  name: string;
  tagline: string | null;
  image_url: string | null;
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
};

const sampleCategories: Category[] = [
  { id: '1', name: 'Tweezers', tagline: 'Shape Your Brows', image_url: null },
  { id: '2', name: 'Hair Scissors', tagline: 'Perfect Cuts', image_url: null },
  { id: '3', name: 'Eyebrow Razors', tagline: 'Clean & Smooth', image_url: null },
  { id: '4', name: 'Nail Care', tagline: 'Healthy Nails', image_url: null },
  { id: '5', name: 'Makeup Brushes', tagline: 'Blend Like a Pro', image_url: null },
  { id: '6', name: 'Eyelash Tools', tagline: 'Lift & Define', image_url: null },
  { id: '7', name: 'Accessories', tagline: 'Complete Your Kit', image_url: null },
];

const mk = (
  id: string, category_id: string, name: string, price: number, badge: string | null,
  rating: number, reviews: number, description: string
): Product => ({ id, category_id, name, price, badge, rating, reviews, image_url: null, description, is_best_seller: true });

const sampleProducts: Product[] = [
  mk('1', '1', 'Precision Tweezer Set', 1299, '20% OFF', 5, 124, 'Stainless steel tweezers with a fine, aligned tip for clean brow shaping.'),
  mk('2', '2', 'Professional Hair Scissors', 1899, 'Best Seller', 5, 98, 'Sharp, balanced scissors for smooth trims and precise cuts at home.'),
  mk('3', '3', 'Eyebrow Razor (Pack of 3)', 849, null, 4.5, 76, 'Gentle razors that clean and define brows without irritation.'),
  mk('4', '4', 'Nail Clipper Set', 799, null, 5, 82, 'Durable clippers with a clean cut for fingers and toes.'),
  mk('5', '5', 'Makeup Brush Set (5 Pcs.)', 1599, 'New', 5, 110, 'Soft, dense bristles for even blending of face and eye makeup.'),
  mk('6', '6', 'Eyelash Curler', 899, null, 4.5, 87, 'Comfortable curve with a silicone pad for lifted, defined lashes.'),
];

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return sampleCategories;
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error || !data || data.length === 0) return sampleCategories;
  return data as Category[];
}

export async function getBestSellers(): Promise<Product[]> {
  if (!supabase) return sampleProducts;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true)
    .limit(6);
  if (error || !data || data.length === 0) return sampleProducts;
  return data as Product[];
}

export async function getProducts(opts: { category?: string; q?: string } = {}): Promise<Product[]> {
  const { category, q } = opts;
  const fallback = () =>
    sampleProducts.filter(
      (p) =>
        (!category || p.category_id === category) &&
        (!q || p.name.toLowerCase().includes(q.toLowerCase()))
    );
  if (!supabase) return fallback();

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category_id', category);
  if (q) query = query.ilike('name', `%${q}%`);
  const { data, error } = await query;
  if (error) return fallback();
  return (data ?? []) as Product[];
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
