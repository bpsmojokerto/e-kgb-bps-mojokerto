import React from 'react';

function Dashboard() {
  return (
    <div className="main-content" style={{ 
      minHeight: '100vh',
      background: 'url(/assets/bpskota.png) center center / cover no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }}>
      <div className="card" style={{ 
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: 700,
        width: '100%'
      }}>
        <div className="d-flex align-items-center mb-4">
          <img src="https://www.bps.go.id/_next/image?url=%2Fassets%2Flogo-bps.png&w=96&q=75" alt="Logo BPS" style={{ height: 60, marginRight: 16 }} />
          <div>
            <h3 style={{ color: '#0d47a1', fontWeight: 700, marginBottom: 8 }}>Selamat Datang di Aplikasi e-KGB BPS Mojokerto</h3>
            <div style={{ fontSize: 18, color: '#333' }}>Gunakan menu di samping untuk mengelola data ASN dan KGB secara berkala.</div>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(13, 71, 161, 0.2)' }} />
        <h5 className="mb-3" style={{ color: '#0d47a1', fontWeight: 600 }}>Fitur Utama:</h5>
        <div className="row">
          <div className="col-md-6">
            <ul style={{ fontSize: 16, marginLeft: 24, color: '#333' }}>
              <li style={{ marginBottom: '8px' }}>Manajemen Data ASN</li>
              <li style={{ marginBottom: '8px' }}>Data Berkala KGB</li>
              <li style={{ marginBottom: '8px' }}>Tabel Gaji PNS</li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul style={{ fontSize: 16, marginLeft: 24, color: '#333' }}>
              <li style={{ marginBottom: '8px' }}>Ekspor/Print Data</li>
              <li style={{ marginBottom: '8px' }}>Login Aman</li>
              <li style={{ marginBottom: '8px' }}>Dashboard Responsif</li>
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: 32, 
          color: '#555', 
          fontSize: 15,
          padding: '1rem',
          background: 'rgba(13, 71, 161, 0.05)',
          borderRadius: '8px',
          borderLeft: '4px solid #0d47a1'
        }}>
          Aplikasi ini dikembangkan untuk memudahkan pengelolaan KGB di lingkungan BPS Mojokerto.
        </div>
      </div>
    </div>
  );
}

export default Dashboard;