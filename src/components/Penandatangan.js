import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Penandatangan() {
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    nip: '',
    jabatan: '',
    pangkat: '',
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('penandatangan')
      .select('*')
      .single();
    
    if (data) {
      setData(data);
      setForm(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (data) {
      // Update existing data
      const { error } = await supabase
        .from('penandatangan')
        .update(form)
        .eq('id', data.id);
      
      if (!error) {
        setData(form);
        setIsEditing(false);
      }
    } else {
      // Insert new data
      const { data: newData, error } = await supabase
        .from('penandatangan')
        .insert([form])
        .select()
        .single();
      
      if (!error && newData) {
        setData(newData);
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="main-content">
      <h4 style={{color: '#0d47a1', fontWeight: 600}}>Data Penandatangan</h4>
      
      {!isEditing ? (
        <div className="card" style={{padding: '20px', marginTop: '20px'}}>
          <div className="row">
            <div className="col-md-8">
              <table className="table">
                <tbody>
                  <tr>
                    <td style={{width: '150px'}}><strong>Nama</strong></td>
                    <td>: {data?.nama || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>NIP</strong></td>
                    <td>: {data?.nip || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Jabatan</strong></td>
                    <td>: {data?.jabatan || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Pangkat</strong></td>
                    <td>: {data?.pangkat || '-'}</td>
                  </tr>
                </tbody>
              </table>
              <button 
                className="btn btn-warning" 
                onClick={() => setIsEditing(true)}
              >
                Edit Data
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{padding: '20px', marginTop: '20px'}}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nama Lengkap (dengan gelar)</label>
                <input
                  type="text"
                  className="form-control"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">NIP</label>
                <input
                  type="text"
                  className="form-control"
                  name="nip"
                  value={form.nip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Jabatan</label>
                <input
                  type="text"
                  className="form-control"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Pangkat</label>
                <input
                  type="text"
                  className="form-control"
                  name="pangkat"
                  value={form.pangkat}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2">
                Simpan
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setForm(data || {
                    nama: '',
                    nip: '',
                    jabatan: '',
                    pangkat: '',
                  });
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Penandatangan; 