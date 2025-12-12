import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Hanya terima method GET
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  try {
    // Coba query ke beberapa tabel untuk memastikan koneksi aktif
    const promises = [
      supabase.from('data_asn').select('count'),
      supabase.from('data_berkala_pns').select('count'),
      supabase.from('tabel_gaji_pns').select('count')
    ]

    const results = await Promise.allSettled(promises)
    
    // Cek apakah minimal satu query berhasil
    const hasSuccess = results.some(result => result.status === 'fulfilled')
    
    if (hasSuccess) {
      return res.status(200).json({
        status: 'ok',
        message: 'Database connection active',
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error('Failed to connect to any database table')
    }
  } catch (error) {
    console.error('Ping error:', error)
    
    // Tetap return 200 agar cron-job tidak menganggap ini sebagai kegagalan
    return res.status(200).json({
      status: 'error',
      message: 'Database connection check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
} 