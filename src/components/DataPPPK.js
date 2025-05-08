import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import html2pdf from 'html2pdf.js';

// Komponen utama
function DataPPPK() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('asn_pppk').select('*').order('nama');
    if (!error) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (form) => {
    if (editData) {
      await supabase.from('asn_pppk').update(form).eq('id', editData.id);
    } else {
      await supabase.from('asn_pppk').insert([form]);
    }
    setShowForm(false);
    setEditData(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus data ini?')) {
      await supabase.from('asn_pppk').delete().eq('id', id);
      fetchData();
    }
  };

  // FUNGSI PRINT/EKSPOR PDF
  const handlePrint = () => {
    const element = document.getElementById("print-area");
    html2pdf().from(element).save();
  };

  return (
    <div>
      <h4>Daftar PPPK</h4>
      <button className="btn btn-success mb-3" onClick={handlePrint}>Print/Ekspor PDF</button>
      <button className="btn btn-primary mb-3 ms-2" onClick={() => { setEditData(null); setShowForm(true); }}>Tambah Data</button>
      {showForm && (
        <FormPPPK
          initialData={editData}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div id="print-area">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIP</th>
                <th>Jabatan</th>
                <th>Golongan</th>
                <th>Unit Kerja</th>
                <th>Tanggal Lahir</th>
                <th>Tanggal Pengangkatan</th>
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
                  <td>{row.tanggal_lahir}</td>
                  <td>{row.tanggal_pengangkatan}</td>
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

// Komponen form PPPK
function FormPPPK({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || {
    nama: '', nip: '', jabatan: '', golongan: '', unit_kerja: '', tanggal_lahir: '', tanggal_pengangkatan: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6"><label>Nama</label><input name="nama" className="form-control mb-2" value={form.nama} onChange={handleChange} required /></div>
        <div className="col-md-6"><label>NIP</label><input name="nip" className="form-control mb-2" value={form.nip} onChange={handleChange} required /></div>
        <div className="col-md-6"><label>Jabatan</label><input name="jabatan" className="form-control mb-2" value={form.jabatan} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Golongan</label><input name="golongan" className="form-control mb-2" value={form.golongan} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Unit Kerja</label><input name="unit_kerja" className="form-control mb-2" value={form.unit_kerja} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Tanggal Lahir</label><input name="tanggal_lahir" type="date" className="form-control mb-2" value={form.tanggal_lahir} onChange={handleChange} /></div>
        <div className="col-md-6"><label>Tanggal Pengangkatan</label><input name="tanggal_pengangkatan" type="date" className="form-control mb-2" value={form.tanggal_pengangkatan} onChange={handleChange} /></div>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary me-2">Simpan</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default DataPPPK;