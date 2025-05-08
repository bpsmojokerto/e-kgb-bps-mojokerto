import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti'; // Import library confetti

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [neonColor, setNeonColor] = useState('#0ff'); // Warna neon awal
  const [showPassword, setShowPassword] = useState(false); // State baru untuk toggle password
  const [isLoading, setIsLoading] = useState(false);

  const colors = ['#0ff', '#f0f', '#ff0', '#0f0']; // Daftar warna neon
  let colorIndex = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNeonColor(colors[colorIndex]);
      colorIndex = (colorIndex + 1) % colors.length;
    }, 500); // Ganti warna setiap 500ms (setengah detik)

    return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
  }, []);

  useEffect(() => {
    // Efek confetti berjatuhan dari atas seperti hujan
    const duration = 7 * 1000; // Durasi efek 7 detik
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: Math.random(), y: Math.random() < 0.3 ? Math.random() - 0.2 : 0 }, // Lebih fokus dari atas
        colors: colors,
        shapes: ['circle'],
        gravity: 0.5,
        scalar: 0.8,
        drift: 0.2,
      });

      confetti({
        ...defaults,
        particleCount: 25,
        origin: { x: Math.random(), y: Math.random() < 0.3 ? Math.random() - 0.2 : 0 }, // Lebih fokus dari atas
        colors: ['#fff', neonColor], // Tambahkan warna putih agar seperti kilauan
        shapes: ['star'],
        gravity: 0.7,
        scalar: 0.5,
        drift: -0.2,
      });

      if (Date.now() > animationEnd) {
        clearInterval(interval);
      }
    }, 100); // Interval antara setiap "frame" confetti

    return () => clearInterval(interval);
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validasi email dan password
    if (email !== 'magangbpskotamojokerto@gmail.com' || password !== 'bpskotamojokerto') {
      setError('Username atau password salah. Hanya admin yang berwenang yang dapat mengakses.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (loginError) {
        setError(loginError.message);
      } else {
        onLogin(data.user);
        // Trigger confetti effect on successful login
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-dark"
      style={{ height: '100vh', flexDirection: 'column' }}
    >
      <div
        className="p-4 rounded shadow-lg mb-4"
        style={{
          maxWidth: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
        }}
      >
        <div className="text-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-person-circle mb-2"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 11.37A7 7 0 0 0 8 1z"
            />
          </svg>
          <h4 className="mb-0">Login Admin</h4>
        </div>
        {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person-fill me-2"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              Username
            </label>
            <input
              type="email"
              className="form-control bg-transparent text-white border-white"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-lock me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
              </svg>
              Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-transparent text-white border-white pe-5"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-white"
                onClick={() => setShowPassword(!showPassword)}
                style={{ textDecoration: 'none' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.707 12 12-.708.707z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: '#fff' }}
            />
            <label className="form-check-label ms-2" htmlFor="rememberMe" style={{ color: '#ccc' }}>
              Remember me
            </label>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
      <div className="text-center" style={{ marginTop: '20px' }}>
        <a
          href="http://ekgbpsmojokerto.ct.ws/arissaharinandteam.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            fontSize: '1.2em',
            fontWeight: 'bold',
            color: neonColor,
            textShadow: `0 0 5px ${neonColor}, 0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
          }}
        >
          Created by : OUR TEAM
        </a>
      </div>
    </div>
  );
}

export default Login;