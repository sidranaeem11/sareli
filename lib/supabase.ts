import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Agar keys nahi hain to null, aur site sample data se chalegi.
export const supabase = url && key ? createClient(url, key) : null;
