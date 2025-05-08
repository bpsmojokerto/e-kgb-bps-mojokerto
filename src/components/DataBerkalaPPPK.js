import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function DataBerkalaPPPK() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('kgb_pppk').select('*').order('tanggal_cetak', { ascending: false });
    if (!error) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (form) => {
    if (editData) {
      await supabase.from('kgb_pppk').update(form).eq('id', editData.id);
    } else {
      await supabase.from('kgb_pppk').insert([form]);
    }
    setShowForm(false);
    setEditData(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus data ini?')) {
      await supabase.from('kgb_pppk').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="main-content">
      <h4 style={{color: '#0d47a1', fontWeight: 600}}>Data Berkala PPPK</h4>
      <button className="btn btn-primary mb-3" onClick={() => { setEditData(null); setShowForm(true); }}>Tambah Data</button>
      {showForm && (
        <FormKGBPPPK
          initialData={editData}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIP</th>
                <th>Jabatan</th>
                <th>Golongan</th>
                <th>Unit Kerja</th>
                <th>Gaji Pokok Baru</th>
                <th>TMT Baru</th>
                <th>Masa Kerja Baru</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id}>
                  <td>{idx + 1}</td>
                  <td>{row.nama}</td>
                  <td>{row.nip}</td>
                  <td>{row.jabatan}</td>
                  <td>{row.golongan}</td>
                  <td>{row.unit_kerja}</td>
                  <td>{row.gaji_pokok_baru}</td>
                  <td>{row.tmt_baru}</td>
                  <td>{row.masa_kerja_baru}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => { setEditData(row); setShowForm(true); }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FormKGBPPPK({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || {
    nama: '', nip: '', jabatan: '', golongan: '', unit_kerja: '', gaji_pokok_lama: '', tmt_lama: '', masa_kerja_lama: '', gaji_pokok_baru: '', tmt_baru: '', masa_kerja_baru: '', tanggal_cetak: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} style={{background: '#f5f7fa', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
      <div className="row">
        <div className="col-md-6"><label>Nama</label><input name="nama" className="form-control mb-2" value={form.nama} onChange={handleChange} required /></div>
        <div className="col-md-6"><label>NIP</label><input name="nip" className="form-control mb-2" value={form.nip} onChange={handleChange} required /></div>
        <div className="col-md-6"><label>Jabatan</label><input name="jabatan" className="form-control mb-2" value={form.jabatan} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Golongan</label><input name="golongan" className="form-control mb-2" value={form.golongan} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Unit Kerja</label><input name="unit_kerja" className="form-control mb-2" value={form.unit_kerja} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Gaji Pokok Lama</label><input name="gaji_pokok_lama" type="number" className="form-control mb-2" value={form.gaji_pokok_lama} onChange={handleChange} /></div>
        <div className="col-md-6"><label>TMT Lama</label><input name="tmt_lama" type="date" className="form-control mb-2" value={form.tmt_lama} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Masa Kerja Lama</label><input name="masa_kerja_lama" type="number" className="form-control mb-2" value={form.masa_kerja_lama} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Gaji Pokok Baru</label><input name="gaji_pokok_baru" type="number" className="form-control mb-2" value={form.gaji_pokok_baru} onChange={handleChange} /></div>
        <div className="col-md-6"><label>TMT Baru</label><input name="tmt_baru" type="date" className="form-control mb-2" value={form.tmt_baru} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Masa Kerja Baru</label><input name="masa_kerja_baru" type="number" className="form-control mb-2" value={form.masa_kerja_baru} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Tanggal Cetak</label><input name="tanggal_cetak" type="date" className="form-control mb-2" value={form.tanggal_cetak} onChange={handleChange} /></div>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary me-2">Simpan</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default DataBerkalaPPPK;