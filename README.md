# Sareli – Premium Beauty Tools (Dark Luxe, Blue)

## Chalana
    npm install
    npm run dev
Phir http://localhost:3000 kholo.

## Pages
- `/` home, `/shop` (category filter + search), `/product/[id]`
- `/cart`, `/checkout` (COD / JazzCash / Easypaisa), `/order-success`
- `/about`, `/contact`
- `/admin` (Orders, Products add/edit/delete + image, Categories add/edit/delete + image, Site images = hero image)

## Apni details badalna
`lib/config.ts` mein WhatsApp number, JazzCash/Easypaisa number, email, shipping fee badlo.
Rang badalna ho to `tailwind.config.ts` ka `accent`.

## Supabase setup (zaroori, warna orders save nahi honge)
1. supabase.com par project banao.
2. SQL Editor mein `supabase/schema.sql` ka poora code paste karke Run karo.
3. Project Settings > API se URL aur anon key copy karo.
4. `.env.local.example` ki copy banao, naam `.env.local` rakho, dono values daalo.
5. Terminal mein Ctrl+C karke `npm run dev` dobara chalao.

## Admin account
1. Supabase > Authentication > Users > Add user > Create new user (apna email + password, "Auto confirm" on).
2. Supabase > Authentication > Sign In / Providers (ya Settings) mein "Allow new users to sign up" band kar do,
   taake koi aur account na bana sake.
3. Site par /admin kholo aur usi email se login karo.

## Vercel par live
1. Code GitHub par push karo.
2. vercel.com > Add New > Project > repo import karo.
3. Environment Variables mein dono Supabase values daalo, Deploy dabao.
