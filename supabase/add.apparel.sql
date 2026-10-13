-- Jackets & Hoodies ke liye. Dobara chalana bhi safe hai.
alter table categories  add column if not exists section text default 'beauty';
alter table products    add column if not exists section text default 'beauty';
alter table products    add column if not exists sizes text;
alter table order_items add column if not exists size text;

do $$
begin
  if not exists (select 1 from categories where section = 'apparel') then
    insert into categories (name, tagline, sort_order, section) values
      ('Jackets', 'Layer Up in Style', 8, 'apparel'),
      ('Hoodies', 'Soft, Warm, Everyday', 9, 'apparel');

    insert into products (category_id, name, price, badge, rating, reviews, description, is_best_seller, section, sizes) values
      ((select id from categories where name='Hoodies' and section='apparel'),'Classic Pullover Hoodie',3499,'New',5,64,'Soft fleece-lined hoodie with a relaxed everyday fit.',false,'apparel','S,M,L,XL'),
      ((select id from categories where name='Hoodies' and section='apparel'),'Zip-Up Hoodie',3999,null,4.5,41,'Midweight zip hoodie with front pockets and a clean finish.',false,'apparel','S,M,L,XL'),
      ((select id from categories where name='Jackets' and section='apparel'),'Quilted Winter Jacket',6499,'Best Seller',5,38,'Warm quilted jacket with a soft lining for cold days.',false,'apparel','S,M,L,XL'),
      ((select id from categories where name='Jackets' and section='apparel'),'Denim Jacket',4999,null,4.5,27,'Classic denim jacket that layers over anything.',false,'apparel','S,M,L,XL');
  end if;
end $$;
