import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import FormKGB from './FormKGB';
import SuratKGB from './SuratKGB';
import html2pdf from 'html2pdf.js';

function DataBerkalaPNS() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const printRef = useRef();
  const [error, setError] = useState(null);

  // Ambil data dari Supabase
  const fetchData = async () => {
    setLoading(true);
    const { data: kgbData, error } = await supabase
      .from('kgb_pns')
      .select('*')
      .order('tanggal_cetak', { ascending: false });
    if (!error) setData(kgbData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah/Edit Data
  const handleSave = async (form) => {
    try {
      // Validasi form
      if (!form.nama || !form.nip || !form.gaji_pokok_lama || !form.gaji_pokok_baru || !form.nomor_surat) {
        setError('Semua field harus diisi');
        return;
      }

      // Siapkan data untuk disimpan
      const dataToSave = {
        nama: form.nama,
        nip: form.nip,
        pangkat: form.pangkat,
        jabatan: form.jabatan,
        kantor: form.kantor,
        gaji_pokok_lama: parseInt(form.gaji_pokok_lama.toString().replace(/[^0-9]/g, '')) || 0,
        tmt_lama: form.tmt_lama,
        masa_kerja_lama: parseInt(form.masa_kerja_lama) || 0,
        gaji_pokok_baru: parseInt(form.gaji_pokok_baru.toString().replace(/[^0-9]/g, '')) || 0,
        tmt_baru: form.tmt_baru,
        masa_kerja_baru: parseInt(form.masa_kerja_baru) || 0,
        golongan: form.golongan,
        tanggal_cetak: form.tanggal_cetak,
        sk_tanggal: form.sk_tanggal,
        sk_nomor: form.sk_nomor,
        nomor_surat: form.nomor_surat || null
      };

      if (editData) {
        const { error } = await supabase
          .from('kgb_pns')
          .update(dataToSave)
          .eq('id', editData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kgb_pns')
          .insert([dataToSave]);
        
        if (error) throw error;
      }
      
      setShowForm(false);
      setEditData(null);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  // Hapus Data
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus data ini?')) {
      await supabase.from('kgb_pns').delete().eq('id', id);
      fetchData();
    }
  };

  const handlePrint = () => {
    try {
      const tanggalCetak = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      // Buat salinan selectedData dan tambahkan tanggal cetak saat ini
      const dataUntukCetak = { ...selectedData, tanggal_cetak: tanggalCetak };
      setSelectedData(dataUntukCetak); // Update state agar SuratKGB menerima tanggal baru

      // Berikan sedikit waktu agar SuratKGB me-render ulang dengan data baru
      setTimeout(() => {
        const element = printRef.current;
        const opt = {
          margin: 0,
          filename: `Surat_KGB_${selectedData.nama}.pdf`,
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
      }, 100);
    } catch (error) {
      console.error('Error printing:', error);
      alert('Terjadi kesalahan saat mencetak surat');
    }
  };

  return (
    <div className="main-content">
      <h4 style={{ color: '#0d47a1', fontWeight: 600 }}>Data Berkala PNS</h4>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => { setEditData(null); setShowForm(true); }}>Tambah Data</button>
      </div>
      {showForm && (
        <FormKGB
          initialData={editData}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {selectedData && (
        <div className="mb-3">
          <button className="btn btn-secondary me-2" onClick={() => setSelectedData(null)}>Tutup Surat</button>
          <button className="btn btn-success me-2" onClick={handlePrint}>Download PDF</button>
          {/* Tombol Download Word Dihapus */}
          <div ref={printRef} style={{ marginTop: 16 }}>
            <SuratKGB data={selectedData} />
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIP</th>
                <th>Pangkat/Jabatan</th>
                <th>Kantor</th>
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
                  <td>{row.pangkat} / {row.jabatan}</td>
                  <td>{row.kantor}</td>
                  <td>{row.gaji_pokok_baru}</td>
                  <td>{row.tmt_baru}</td>
                  <td>{row.masa_kerja_baru}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => { setEditData(row); setShowForm(true); }}>Edit</button>
                    <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}>Hapus</button>
                    <button className="btn btn-sm btn-success" onClick={() => setSelectedData(row)}>Print/Ekspor</button>
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

export default DataBerkalaPNS;