import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dauhjaidotzahufwiaqd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_yetWM2mTmzXi9Bovk7r4KQ_h4Lq1b2Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
