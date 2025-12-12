import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponen halaman
import Dashboard from './components/Dashboard';
import DataASN from './components/DataASN';
import DataPPPK from './components/DataPPPK';
import DataBerkalaPNS from './components/DataBerkalaPNS';
import DataBerkalaPPPK from './components/DataBerkalaPPPK';
import TabelGajiPNS from './components/TabelGajiPNS';
import TabelGajiPPPK from './components/TabelGajiPPPK';
import PermohonanCuti from './components/PermohonanCuti';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Sidebar />
        <div
          className="container-fluid"
          style={{
            minHeight: '100vh',
            background: 'transparent',
            padding: 0,
            position: 'relative'
          }}
        >
          <header style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(15px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '1rem 2rem',
            margin: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/assets/bps-logo.png" alt="Logo BPS" style={{ height: 60, marginRight: 16 }} />
              <h2 style={{ margin: 0, color: '#ffffff', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>e-KGB BPS Mojokerto</h2>
            </div>
            {/* Tombol logout hanya muncul jika user sudah login */}
            {user && (
              <button 
                className="btn btn-outline-light" 
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                Logout
              </button>
            )}
          </header>
          <div style={{ padding: '2rem', background: 'transparent' }}>
            <Routes>
              <Route path="/data-berkala-pns" element={<DataBerkalaPNS />} />
              {user ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data-asn" element={<DataASN />} />
                  <Route path="/data-pppk" element={<DataPPPK />} />
                  <Route path="/data-berkala-pppk" element={<DataBerkalaPPPK />} />
                  <Route path="/tabel-gaji-pns" element={<TabelGajiPNS />} />
                  <Route path="/tabel-gaji-pppk" element={<TabelGajiPPPK />} />
                  <Route path="/permohonan-cuti" element={<PermohonanCuti />} />
                </>
              ) : (
                <Route path="*" element={<Login onLogin={setUser} />} />
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;