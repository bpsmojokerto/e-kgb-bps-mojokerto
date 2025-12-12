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
    
    if (!error) {
      // Konversi data lama ke format baru jika diperlukan
      const convertedData = kgbData.map(item => {
        if (item.masa_kerja_lama && !item.masa_kerja_lama_tahun) {
          const masaKerjaLama = parseFloat(item.masa_kerja_lama) || 0;
          const masaKerjaBaru = parseFloat(item.masa_kerja_baru) || 0;
          
          return {
            ...item,
            masa_kerja_lama_tahun: Math.floor(masaKerjaLama),
            masa_kerja_lama_bulan: Math.round((masaKerjaLama % 1) * 12),
            masa_kerja_baru_tahun: Math.floor(masaKerjaBaru),
            masa_kerja_baru_bulan: Math.round((masaKerjaBaru % 1) * 12)
          };
        }
        return item;
      });
      
      console.log('Data KGB dari Supabase:', convertedData);
      setData(convertedData);
    }
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
        masa_kerja_lama_tahun: parseInt(form.masa_kerja_lama_tahun) || 0,
        masa_kerja_lama_bulan: parseInt(form.masa_kerja_lama_bulan) || 0,
        gaji_pokok_baru: parseInt(form.gaji_pokok_baru.toString().replace(/[^0-9]/g, '')) || 0,
        tmt_baru: form.tmt_baru,
        masa_kerja_baru_tahun: parseInt(form.masa_kerja_baru_tahun) || 0,
        masa_kerja_baru_bulan: parseInt(form.masa_kerja_baru_bulan) || 0,
        golongan: form.golongan,
        tanggal_cetak: form.tanggal_cetak,
        sk_tanggal: form.sk_tanggal,
        sk_nomor: form.sk_nomor,
        nomor_surat: form.nomor_surat || null
      };

      console.log('Data yang akan disimpan:', dataToSave);

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
    const tanggalSekarang = new Date();
    // Format tanggal dalam bentuk YYYY-MM-DD untuk konsistensi
    const tanggalCetak = tanggalSekarang.toISOString().split('T')[0];
    const dataUntukCetak = { ...selectedData, tanggal_cetak: tanggalCetak };
    setSelectedData(dataUntukCetak);

    setTimeout(() => {
      const element = printRef.current;
      console.log('Element height:', element.offsetHeight);
      
      const opt = {
        margin: 0,
        filename: `Surat_KGB_${selectedData.nama}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          avoid: 'div',
          mode: ['avoid-all', 'css', 'legacy']
        }
      };
      html2pdf().set(opt).from(element).save();
    }, 100);
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
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table className="table table-striped table-bordered table-hover" style={{ minWidth: '1200px', fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ width: '50px', minWidth: '50px' }}>No</th>
                <th style={{ width: '200px', minWidth: '200px' }}>Nama</th>
                <th style={{ width: '150px', minWidth: '150px' }}>NIP</th>
                <th style={{ width: '250px', minWidth: '250px' }}>Pangkat/Jabatan</th>
                <th style={{ width: '150px', minWidth: '150px' }}>Kantor</th>
                <th style={{ width: '150px', minWidth: '150px' }}>Gaji Pokok Baru</th>
                <th style={{ width: '120px', minWidth: '120px' }}>TMT Baru</th>
                <th style={{ width: '150px', minWidth: '150px' }}>Masa Kerja Baru</th>
                <th style={{ width: '200px', minWidth: '200px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{idx + 1}</td>
                  <td style={{ verticalAlign: 'middle', wordWrap: 'break-word', maxWidth: '200px' }}>{row.nama}</td>
                  <td style={{ verticalAlign: 'middle', fontFamily: 'monospace', fontSize: '13px' }}>{row.nip}</td>
                  <td style={{ verticalAlign: 'middle', wordWrap: 'break-word', maxWidth: '250px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{row.pangkat}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{row.jabatan}</div>
                  </td>
                  <td style={{ verticalAlign: 'middle', wordWrap: 'break-word', maxWidth: '150px' }}>{row.kantor}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>
                    {row.gaji_pokok_baru?.toLocaleString('id-ID')}
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: '13px' }}>{row.tmt_baru}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: '13px' }}>
                    {`${row.masa_kerja_baru_tahun || 0} Tahun ${row.masa_kerja_baru_bulan || 0} Bulan`}
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button className="btn btn-sm btn-warning" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => { setEditData(row); setShowForm(true); }}>Edit</button>
                      <button className="btn btn-sm btn-danger" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => handleDelete(row.id)}>Hapus</button>
                      <button className="btn btn-sm btn-success" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => setSelectedData(row)}>Print/Ekspor</button>
                    </div>
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