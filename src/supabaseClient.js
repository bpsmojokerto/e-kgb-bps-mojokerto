import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://huyjjxheqilmwrixfrbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eWpqeGhlcWlsbXdyaXhmcmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODI0OTAsImV4cCI6MjA2MDg1ODQ5MH0.Cqjwo_4vuu7duHbQR9FvdW5Qi_T8BMsQ15zd1KkEhhI';

export const supabase = createClient(supabaseUrl, supabaseKey);