import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  const status = {
    app: {
      status: 'ok',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    },
    database: {
      status: 'checking',
      tables: {
        data_asn: null,
        data_berkala_pns: null,
        tabel_gaji_pns: null
      }
    }
  }

  try {
    // Check each table
    const tables = ['data_asn', 'data_berkala_pns', 'tabel_gaji_pns']
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      status.database.tables[table] = error ? 'error' : 'ok'
    }

    // Overall database status
    status.database.status = Object.values(status.database.tables).every(s => s === 'ok') 
      ? 'ok' 
      : 'partial'

    return res.status(200).json(status)
  } catch (error) {
    status.database.status = 'error'
    return res.status(200).json(status)
  }
} 