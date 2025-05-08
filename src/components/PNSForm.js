import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function PNSForm() {
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    jabatan: '',
    golongan: '',
    unitKerja: '',
    tanggalLahir: '',
    tanggalPengangkatan: '',
    nomorSK: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('pns_data')
        .insert([formData]);

      if (error) throw error;

      setSuccess('Data PNS berhasil disimpan!');
      setFormData({
        nama: '',
        nip: '',
        pangkat: '',
        jabatan: '',
        golongan: '',
        unitKerja: '',
        tanggalLahir: '',
        tanggalPengangkatan: '',
        nomorSK: ''
      });
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Form Pendaftaran PNS</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nama"
                      value={formData.nama}
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
                      value={formData.nip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pangkat</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pangkat"
                      value={formData.pangkat}
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
                      value={formData.jabatan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Golongan</label>
                    <input
                      type="text"
                      className="form-control"
                      name="golongan"
                      value={formData.golongan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unit Kerja</label>
                    <input
                      type="text"
                      className="form-control"
                      name="unitKerja"
                      value={formData.unitKerja}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tanggal Lahir</label>
                    <input
                      type="date"
                      className="form-control"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tanggal Pengangkatan</label>
                    <input
                      type="date"
                      className="form-control"
                      name="tanggalPengangkatan"
                      value={formData.tanggalPengangkatan}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Nomor SK</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nomorSK"
                      value={formData.nomorSK}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Data'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PNSForm; 