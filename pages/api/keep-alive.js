import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Lakukan query sederhana ke Supabase
    const { data, error } = await supabase
      .from('keep_alive')
      .select('count')
      .single()

    if (error) throw error

    return res.status(200).json({ status: 'Database connection active' })
  } catch (error) {
    console.error('Keep-alive check failed:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 