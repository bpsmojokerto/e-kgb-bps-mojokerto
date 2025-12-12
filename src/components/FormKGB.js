import React, { useState, useEffect } from 'react';

const initialState = {
  nama: '',
  nip: '',
  pangkat: '',
  jabatan: '',
  kantor: '',
  gaji_pokok_lama: '',
  tmt_lama: '',
  masa_kerja_lama_tahun: '',
  masa_kerja_lama_bulan: '',
  gaji_pokok_baru: '',
  tmt_baru: '',
  masa_kerja_baru_tahun: '',
  masa_kerja_baru_bulan: '',
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
      // Jika data menggunakan format lama, konversi ke format baru
      if (initialData.masa_kerja_lama && !initialData.masa_kerja_lama_tahun) {
        const masaKerjaLama = parseFloat(initialData.masa_kerja_lama) || 0;
        const masaKerjaBaru = parseFloat(initialData.masa_kerja_baru) || 0;
        
        setForm({
          ...initialData,
          masa_kerja_lama_tahun: Math.floor(masaKerjaLama),
          masa_kerja_lama_bulan: Math.round((masaKerjaLama % 1) * 12),
          masa_kerja_baru_tahun: Math.floor(masaKerjaBaru),
          masa_kerja_baru_bulan: Math.round((masaKerjaBaru % 1) * 12)
        });
      } else {
        setForm({
          ...initialData,
          masa_kerja_lama_tahun: initialData.masa_kerja_lama_tahun || 0,
          masa_kerja_lama_bulan: initialData.masa_kerja_lama_bulan || 0,
          masa_kerja_baru_tahun: initialData.masa_kerja_baru_tahun || 0,
          masa_kerja_baru_bulan: initialData.masa_kerja_baru_bulan || 0
        });
      }
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

    // Konversi masa kerja ke format yang benar
    const masaKerjaLamaTahun = Number(form.masa_kerja_lama_tahun) || 0;
    const masaKerjaLamaBulan = Number(form.masa_kerja_lama_bulan) || 0;
    const masaKerjaBaruTahun = Number(form.masa_kerja_baru_tahun) || 0;
    const masaKerjaBaruBulan = Number(form.masa_kerja_baru_bulan) || 0;

    console.log('Masa Kerja Lama:', masaKerjaLamaTahun, 'tahun', masaKerjaLamaBulan, 'bulan');
    console.log('Masa Kerja Baru:', masaKerjaBaruTahun, 'tahun', masaKerjaBaruBulan, 'bulan');
    
    // Konversi gaji ke number sebelum dikirim
    const dataToSubmit = {
      ...form,
      gaji_pokok_lama: form.gaji_pokok_lama.toString(),
      gaji_pokok_baru: form.gaji_pokok_baru.toString(),
      tmt_lama: form.tmt_lama ? new Date(form.tmt_lama).toISOString().split('T')[0] : null,
      tmt_baru: form.tmt_baru ? new Date(form.tmt_baru).toISOString().split('T')[0] : null,
      masa_kerja_lama_tahun: masaKerjaLamaTahun,
      masa_kerja_lama_bulan: masaKerjaLamaBulan,
      masa_kerja_baru_tahun: masaKerjaBaruTahun,
      masa_kerja_baru_bulan: masaKerjaBaruBulan,
      sk_tanggal: form.sk_tanggal ? new Date(form.sk_tanggal).toISOString().split('T')[0] : null,
      sk_nomor: form.sk_nomor || null,
      tanggal_cetak: form.tanggal_cetak ? new Date(form.tanggal_cetak).toISOString().split('T')[0] : null
    };

    // Hapus field lama jika ada
    delete dataToSubmit.masa_kerja_lama;
    delete dataToSubmit.masa_kerja_baru;
    
    console.log('Data yang akan disimpan ke Supabase:', dataToSubmit);
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
                <div className="row">
                  <div className="col-6">
                    <input 
                      name="masa_kerja_lama_tahun" 
                      type="number" 
                      className="form-control mb-2" 
                      value={form.masa_kerja_lama_tahun || ''} 
                      onChange={handleChange}
                      placeholder="Tahun"
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      name="masa_kerja_lama_bulan" 
                      type="number" 
                      className="form-control mb-2" 
                      value={form.masa_kerja_lama_bulan || ''} 
                      onChange={handleChange}
                      placeholder="Bulan"
                      min="0"
                      max="11"
                    />
                  </div>
                </div>
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
                <div className="row">
                  <div className="col-6">
                    <input 
                      name="masa_kerja_baru_tahun" 
                      type="number" 
                      className="form-control mb-2" 
                      value={form.masa_kerja_baru_tahun || ''} 
                      onChange={handleChange}
                      placeholder="Tahun"
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      name="masa_kerja_baru_bulan" 
                      type="number" 
                      className="form-control mb-2" 
                      value={form.masa_kerja_baru_bulan || ''} 
                      onChange={handleChange}
                      placeholder="Bulan"
                      min="0"
                      max="11"
                    />
                  </div>
                </div>
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