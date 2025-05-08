import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function TabelGajiPNS() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tabel_gaji_pns').select('*').order('golongan');
    if (!error) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (form) => {
    if (editData) {
      await supabase.from('tabel_gaji_pns').update(form).eq('id', editData.id);
    } else {
      await supabase.from('tabel_gaji_pns').insert([form]);
    }
    setShowForm(false);
    setEditData(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus data ini?')) {
      await supabase.from('tabel_gaji_pns').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div>
      <h4>Tabel Gaji PNS (PP No 5 Tahun 2024)</h4>
      <button className="btn btn-primary mb-3" onClick={() => { setEditData(null); setShowForm(true); }}>Tambah Data</button>
      {showForm && (
        <FormGaji
          initialData={editData}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Golongan</th>
              <th>Masa Kerja</th>
              <th>Gaji Pokok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id}>
                <td>{idx + 1}</td>
                <td>{row.golongan}</td>
                <td>{row.masa_kerja}</td>
                <td>{Number(row.gaji_pokok).toLocaleString('id-ID')}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => { setEditData(row); setShowForm(true); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FormGaji({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || {
    golongan: '', masa_kerja: '', gaji_pokok: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <>
      <div style={{color: 'red', fontWeight: 'bold', marginBottom: 10}}>
        !!!!..Hanya Dilakukan apabila ada Kenaikan Gaji Pokok Yang ditetapkan Pemerintah
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4"><label>Golongan</label><input name="golongan" className="form-control mb-2" value={form.golongan} onChange={handleChange} required /></div>
          <div className="col-md-4"><label>Masa Kerja</label><input name="masa_kerja" type="number" className="form-control mb-2" value={form.masa_kerja} onChange={handleChange} required /></div>
          <div className="col-md-4"><label>Gaji Pokok</label><input name="gaji_pokok" type="number" className="form-control mb-2" value={form.gaji_pokok} onChange={handleChange} required /></div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">Simpan</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
        </div>
      </form>
    </>
  );
}

export default TabelGajiPNS;