import { supabase } from './supabase';

const BUCKET = 'product-images';

export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase connect nahi hai');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image 5MB se choti honi chahiye');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error('Upload nahi hui: ' + error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteImage(url?: string | null) {
  if (!supabase || !url) return;
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  await supabase.storage.from(BUCKET).remove([url.slice(i + marker.length)]);
}
