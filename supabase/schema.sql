-- Supabase > SQL Editor mein poora paste karke Run karo. Dobara run karna bhi safe hai.

-- ---------- Tables ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  image_url text,
  sort_order int default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  price int not null,
  badge text,
  rating numeric default 5,
  reviews int default 0,
  image_url text,
  description text,
  is_best_seller boolean default false,
  created_at timestamptz default now()
);
alter table products add column if not exists description text;
alter table products add column if not exists created_at timestamptz default now();

create table if not exists orders (
  id uuid primary key,
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  payment_method text not null default 'cod',
  subtotal int not null,
  shipping int not null default 0,
  total int not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  price int not null,
  qty int not null
);

-- ---------- Security (RLS) ----------
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

drop policy if exists "public read categories" on categories;
drop policy if exists "public read products"   on categories;
drop policy if exists "public read products"   on products;
drop policy if exists "admin write categories" on categories;
drop policy if exists "admin write products"   on products;
drop policy if exists "anyone can place order" on orders;
drop policy if exists "admin read orders"      on orders;
drop policy if exists "admin update orders"    on orders;
drop policy if exists "anyone can add items"   on order_items;
drop policy if exists "admin read items"       on order_items;

-- Sab dekh sakte hain
create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);
-- Sirf login admin badal sakta hai
create policy "admin write categories" on categories for all to authenticated using (true) with check (true);
create policy "admin write products"   on products   for all to authenticated using (true) with check (true);
-- Customer order daal sakta hai, par parh nahi sakta
create policy "anyone can place order" on orders      for insert to anon, authenticated with check (true);
create policy "anyone can add items"   on order_items for insert to anon, authenticated with check (true);
-- Sirf admin orders dekh aur update kar sakta hai
create policy "admin read orders"   on orders      for select to authenticated using (true);
create policy "admin update orders" on orders      for update to authenticated using (true) with check (true);
create policy "admin read items"    on order_items for select to authenticated using (true);

-- ---------- Image storage ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "admin upload product images" on storage.objects;
drop policy if exists "admin delete product images" on storage.objects;
create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "admin delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

-- ---------- Sample data (sirf pehli baar) ----------
do $$
begin
  if not exists (select 1 from categories) then
    insert into categories (name, tagline, sort_order) values
      ('Tweezers','Shape Your Brows',1),
      ('Hair Scissors','Perfect Cuts',2),
      ('Eyebrow Razors','Clean & Smooth',3),
      ('Nail Care','Healthy Nails',4),
      ('Makeup Brushes','Blend Like a Pro',5),
      ('Eyelash Tools','Lift & Define',6),
      ('Accessories','Complete Your Kit',7);

    insert into products (category_id, name, price, badge, rating, reviews, description, is_best_seller) values
      ((select id from categories where name='Tweezers'),'Precision Tweezer Set',1299,'20% OFF',5,124,'Stainless steel tweezers with a fine, aligned tip for clean brow shaping.',true),
      ((select id from categories where name='Hair Scissors'),'Professional Hair Scissors',1899,'Best Seller',5,98,'Sharp, balanced scissors for smooth trims and precise cuts at home.',true),
      ((select id from categories where name='Eyebrow Razors'),'Eyebrow Razor (Pack of 3)',849,null,4.5,76,'Gentle razors that clean and define brows without irritation.',true),
      ((select id from categories where name='Nail Care'),'Nail Clipper Set',799,null,5,82,'Durable clippers with a clean cut for fingers and toes.',true),
      ((select id from categories where name='Makeup Brushes'),'Makeup Brush Set (5 Pcs.)',1599,'New',5,110,'Soft, dense bristles for even blending of face and eye makeup.',true),
      ((select id from categories where name='Eyelash Tools'),'Eyelash Curler',899,null,4.5,87,'Comfortable curve with a silicone pad for lifted, defined lashes.',true);
  end if;
end $$;

-- ---------- Site settings (hero image waghera) ----------
create table if not exists site_settings (
  key text primary key,
  value text
);
alter table site_settings enable row level security;
drop policy if exists "public read settings" on site_settings;
drop policy if exists "admin write settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
create policy "admin write settings" on site_settings for all to authenticated using (true) with check (true);
