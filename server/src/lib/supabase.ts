import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'dummy_key';

if (supabaseUrl === 'https://dummy.supabase.co' || supabaseKey === 'dummy_key') {
  console.warn('Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não estão definidas!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
