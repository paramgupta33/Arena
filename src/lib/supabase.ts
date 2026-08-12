import { createClient } from '@supabase/supabase-js';

const getValidUrl = (urlStr: string | undefined): string => {
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.trim()) {
    return 'https://vxcmkknhnzdiqwupuvsw.supabase.co';
  }
  let trimmed = urlStr.trim();
  if (trimmed.startsWith('//')) {
    trimmed = 'https:' + trimmed;
  } else if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.toString();
  } catch {
    return 'https://vxcmkknhnzdiqwupuvsw.supabase.co';
  }
};

const supabaseUrl = getValidUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.trim()) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.trim()) ||
  'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


