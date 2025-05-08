import React, { useState, useEffect } from 'react';
import logo from './assets/bps-logo.png';
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

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <Sidebar />
        <div
          className="container-fluid"
          style={{
            minHeight: '100vh',
            background: 'transparent',
            padding: 0,
          }}
        >
          <header className="my-4 text-center">
            <img src={logo} alt="Logo BPS" style={{ height: 80 }} />
            <h2>e-KGB BPS Mojokerto</h2>
            <button className="btn btn-outline-danger float-end" onClick={handleLogout}>
              Logout
            </button>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-asn" element={<DataASN />} />
            <Route path="/data-pppk" element={<DataPPPK />} />
            <Route path="/data-berkala-pns" element={<DataBerkalaPNS />} />
            <Route path="/data-berkala-pppk" element={<DataBerkalaPPPK />} />
            <Route path="/tabel-gaji-pns" element={<TabelGajiPNS />} />
            <Route path="/tabel-gaji-pppk" element={<TabelGajiPPPK />} />
            <Route path="/permohonan-cuti" element={<PermohonanCuti />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;