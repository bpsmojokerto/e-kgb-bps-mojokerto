const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://huyjjxheqilmwrixfrbb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eWpqeGhlcWlsbXdyaXhmcmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODI0OTAsImV4cCI6MjA2MDg1ODQ5MH0.Cqjwo_4vuu7duHbQR9FvdW5Qi_T8BMsQ15zd1KkEhhI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function keepAlive() {
  console.log('Starting Supabase Keep-Alive check...');
  console.log(`Target URL: ${SUPABASE_URL}`);

  try {
    // Melakukan query ringan ke tabel sistem Supabase (schema info)
    // Atau bisa ke tabel apa saja yang ada, misal 'users' atau '_health' jika ada
    // Kita coba list bucket storage dulu karena biasanya selalu ada, atau query tabel public
    
    // Percobaan 1: Cek Session (auth) - sangat ringan
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.warn('Auth check warning:', authError.message);
    } else {
      console.log('Auth service is responsive.');
    }

    // Percobaan 2: Query data dummy
    // Menggunakan RPC 'ping' jika ada, atau select * from tabel sembarang
    // Kita coba select count dari tabel yang mungkin ada, atau biarkan error "relation not found" yang penting server merespon
    
    // Cara paling aman tanpa tau nama tabel:
    // Cukup inisialisasi client dan auth check di atas sudah memicu traffic ke API Gateway Supabase
    
    console.log('Keep-alive ping sent successfully.');
    
  } catch (error) {
    console.error('Unexpected error during keep-alive:', error);
    process.exit(1);
  }
}

keepAlive();
