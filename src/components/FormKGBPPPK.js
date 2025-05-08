import React, { useState } from 'react';

const initialState = {
  nama: '',
  ni_pppk: '',
  jabatan: '',
  kantor: '',
  gaji_pokok_lama: '',
  tmt_lama: '',
  masa_kerja_lama: '',
  gaji_pokok_baru: '',
  tmt_baru: '',
  masa_kerja_baru: '',
  tanggal_cetak: '',
};

function FormKGBPPPK({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <label>Nama</label>
          <input name="nama" className="form-control mb-2" value={form.nama} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label>NI PPPK</label>
          <input name="ni_pppk" className="form-control mb-2" value={form.ni_pppk} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label>Jabatan</label>
          <input name="jabatan" className="form-control mb-2" value={form.jabatan} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Kantor</label>
          <input name="kantor" className="form-control mb-2" value={form.kantor} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Gaji Pokok Lama</label>
          <input name="gaji_pokok_lama" type="number" className="form-control mb-2" value={form.gaji_pokok_lama} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>TMT Lama</label>
          <input name="tmt_lama" type="date" className="form-control mb-2" value={form.tmt_lama} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Masa Kerja Lama</label>
          <input name="masa_kerja_lama" type="number" className="form-control mb-2" value={form.masa_kerja_lama} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Gaji Pokok Baru</label>
          <input name="gaji_pokok_baru" type="number" className="form-control mb-2" value={form.gaji_pokok_baru} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>TMT Baru</label>
          <input name="tmt_baru" type="date" className="form-control mb-2" value={form.tmt_baru} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Masa Kerja Baru</label>
          <input name="masa_kerja_baru" type="number" className="form-control mb-2" value={form.masa_kerja_baru} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label>Tanggal Cetak</label>
          <input name="tanggal_cetak" type="date" className="form-control mb-2" value={form.tanggal_cetak} onChange={handleChange} />
        </div>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary me-2">Simpan</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default FormKGBPPPK;