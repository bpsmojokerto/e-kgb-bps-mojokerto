import React from 'react';

function Dashboard() {
  return (
    <div className="main-content">
      <div className="d-flex align-items-center mb-3">
        <img src="https://www.bps.go.id/_next/image?url=%2Fassets%2Flogo-bps.png&w=96&q=75" alt="Logo BPS" style={{ height: 60, marginRight: 16 }} />
        <div>
          <h3 style={{ color: '#0d47a1', fontWeight: 700, marginBottom: 0 }}>Selamat Datang di Aplikasi e-KGB BPS Mojokerto</h3>
          <div style={{ fontSize: 18, color: '#333' }}>Gunakan menu di samping untuk mengelola data ASN dan KGB secara berkala.</div>
        </div>
      </div>
      <hr />
      <h5 className="mb-3" style={{ color: '#0d47a1', fontWeight: 600 }}>Fitur Utama:</h5>
      <ul style={{ fontSize: 16, marginLeft: 24 }}>
        <li>Manajemen Data ASN</li>
        <li>Data Berkala KGB</li>
        <li>Tabel Gaji PNS</li>
        <li>Ekspor/Print Data</li>
        <li>Login Aman</li>
      </ul>
      <div style={{ marginTop: 32, color: '#555', fontSize: 15 }}>
        Aplikasi ini dikembangkan untuk memudahkan pengelolaan KGB di lingkungan BPS Mojokerto.
      </div>
    </div>
  );
}

export default Dashboard;