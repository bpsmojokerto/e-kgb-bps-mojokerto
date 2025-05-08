import React, { useState, useEffect } from 'react';

const initialState = {
  nama: '',
  nip: '',
  pangkat: '',
  jabatan: '',
  kantor: '',
  gaji_pokok_lama: '',
  tmt_lama: '',
  masa_kerja_lama: '',
  gaji_pokok_baru: '',
  tmt_baru: '',
  masa_kerja_baru: '',
  golongan: '',
  tanggal_cetak: new Date().toISOString().slice(0, 10),
  sk_tanggal: '',
  sk_nomor: '',
  nomor_surat: '',
};

function FormKGB({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Khusus untuk field gaji, bersihkan input dari karakter non-digit
    if (name === 'gaji_pokok_lama' || name === 'gaji_pokok_baru') {
      const cleanValue = value.replace(/\D/g, '');
      setForm(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!form.nama || !form.nip || !form.gaji_pokok_lama || !form.gaji_pokok_baru) {
      setError('Mohon lengkapi semua field yang wajib diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    // Konversi gaji ke number sebelum dikirim
    const dataToSubmit = {
      ...form,
      gaji_pokok_lama: form.gaji_pokok_lama.toString(),
      gaji_pokok_baru: form.gaji_pokok_baru.toString(),
      tmt_lama: form.tmt_lama || null,
      tmt_baru: form.tmt_baru || null,
      masa_kerja_lama: form.masa_kerja_lama || null,
      masa_kerja_baru: form.masa_kerja_baru || null,
      sk_tanggal: form.sk_tanggal || null,
      sk_nomor: form.sk_nomor || null
    };
    
    onSubmit(dataToSubmit);
  };

  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Nomor Surat</label>
                <input 
                  name="nomor_surat" 
                  className="form-control mb-2" 
                  value={form.nomor_surat || ''} 
                  onChange={handleChange} 
                  placeholder="Contoh: 001/3576/KP.800/TAHUN 2025"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Nama</label>
                <input 
                  name="nama" 
                  className="form-control mb-2" 
                  value={form.nama || ''} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>NIP</label>
                <input 
                  name="nip" 
                  className="form-control mb-2" 
                  value={form.nip || ''} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Pangkat</label>
                <input 
                  name="pangkat" 
                  className="form-control mb-2" 
                  value={form.pangkat || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Jabatan</label>
                <input 
                  name="jabatan" 
                  className="form-control mb-2" 
                  value={form.jabatan || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Kantor</label>
                <input 
                  name="kantor" 
                  className="form-control mb-2" 
                  value={form.kantor || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Gaji Pokok Lama</label>
                <input 
                  name="gaji_pokok_lama" 
                  type="text" 
                  className="form-control mb-2" 
                  value={form.gaji_pokok_lama || ''} 
                  onChange={handleChange}
                  placeholder="Contoh: 5000000"
                  required
                />
              </div>
              <div className="form-group">
                <label>TMT Lama</label>
                <input 
                  name="tmt_lama" 
                  type="date" 
                  className="form-control mb-2" 
                  value={form.tmt_lama || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Masa Kerja Lama</label>
                <input 
                  name="masa_kerja_lama" 
                  type="number" 
                  className="form-control mb-2" 
                  value={form.masa_kerja_lama || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Gaji Pokok Baru</label>
                <input 
                  name="gaji_pokok_baru" 
                  type="text" 
                  className="form-control mb-2" 
                  value={form.gaji_pokok_baru || ''} 
                  onChange={handleChange}
                  placeholder="Contoh: 6000000"
                  required
                />
              </div>
              <div className="form-group">
                <label>TMT Baru</label>
                <input 
                  name="tmt_baru" 
                  type="date" 
                  className="form-control mb-2" 
                  value={form.tmt_baru || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Masa Kerja Baru</label>
                <input 
                  name="masa_kerja_baru" 
                  type="number" 
                  className="form-control mb-2" 
                  value={form.masa_kerja_baru || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Golongan</label>
                <input 
                  name="golongan" 
                  className="form-control mb-2" 
                  value={form.golongan || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Tanggal Cetak</label>
                <input 
                  name="tanggal_cetak" 
                  type="date" 
                  className="form-control mb-2" 
                  value={form.tanggal_cetak || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Tanggal SKP</label>
                <input 
                  name="sk_tanggal" 
                  type="date" 
                  className="form-control mb-2" 
                  value={form.sk_tanggal || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Nomor SKP</label>
                <input 
                  name="sk_nomor" 
                  type="text" 
                  className="form-control mb-2" 
                  value={form.sk_nomor || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary me-2">Simpan</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormKGB;