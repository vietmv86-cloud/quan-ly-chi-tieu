const SUPABASE_URL = 'https://snuwosjiokctecyzmqfd.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_PWzLc6re2sHUm4bE6GB4nw_AiJbXGFQ';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  }
);