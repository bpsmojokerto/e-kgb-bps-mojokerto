import React, { forwardRef } from 'react';

const SuratKGB = forwardRef(({ data }, ref) => {
  if (!data) return null;

  console.log('Data yang diterima SuratKGB:', data);
  console.log('Format tmt_baru:', data.tmt_baru);

  // Format tanggal ke format Indonesia
  const formatTanggal = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const hari = date.toLocaleString('id-ID', { weekday: 'long' });
      const tanggal = date.getDate();
      const bulan = date.toLocaleString('id-ID', { month: 'long' });
      const tahun = date.getFullYear();
      return `${hari}, ${tanggal} ${bulan} ${tahun}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format tanggal ke format Indonesia tanpa hari
  const formatTanggalTanpaHari = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const tanggal = String(date.getDate()).padStart(2, '0');
      const bulanNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const bulan = bulanNames[date.getMonth()];
      const tahun = date.getFullYear();
      return `${tanggal} ${bulan} ${tahun}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if parsing fails
    }
  };

  // Fungsi untuk memformat angka ke format rupiah
  const formatRupiah = (angka) => {
    if (!angka) return 'Rp. 0,-';
    try {
      // Pastikan input adalah string dan bersihkan dari karakter non-digit
      const cleanInput = String(angka).replace(/\D/g, '');
      
      // Konversi ke number
      const num = parseInt(cleanInput, 10);
      if (isNaN(num)) return 'Rp. 0,-';
      
      // Format dengan pemisah ribuan
      const formatted = num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      
      return `Rp. ${formatted},-`;
    } catch (error) {
      console.error('Error formatting number:', error);
      return 'Rp. 0,-';
    }
  };

  // Fungsi untuk memformat NIP (menghapus spasi)
  const formatNIP = (nip) => {
    if (!nip) return '-';
    return nip.replace(/\s/g, '');
  };

  // Format nomor surat
  const formatNomorSurat = (nomor) => {
    if (!nomor) return '';
    return nomor;
  };

  // Format bulan dan tahun
  const formatBulan = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting month:', error);
      return '';
    }
  };

  // Fungsi untuk memformat masa kerja
  const formatMasaKerja = (tahun, bulan) => {
    console.log('Formatting masa kerja:', tahun, 'tahun', bulan, 'bulan');
    if (!tahun && !bulan) return '0 Tahun 0 Bulan';
    const tahunStr = tahun ? `${tahun} Tahun` : '';
    const bulanStr = bulan ? `${bulan} Bulan` : '';
    return [tahunStr, bulanStr].filter(Boolean).join(' ');
  };

  // Tambahkan console.log untuk debugging
  console.log('Data yang diterima SuratKGB:', data);
  console.log('Tanggal cetak:', data.tanggal_cetak);
  console.log('Format tanggal cetak:', formatTanggal(data.tanggal_cetak));
  console.log('Masa Kerja Lama:', data.masa_kerja_lama_tahun, 'tahun', data.masa_kerja_lama_bulan, 'bulan');
  console.log('Masa Kerja Baru:', data.masa_kerja_baru_tahun, 'tahun', data.masa_kerja_baru_bulan);

  return (
    <div ref={ref} style={{
      width: '210mm',
      maxHeight: '297mm',
      margin: '0 auto',
      color: '#000',
      background: '#fff',
      padding: '5mm 15mm',
      fontSize: '9.5pt',
      lineHeight: '1.2',
      fontFamily: 'Arial, sans-serif',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2mm' }}>
        <img
          src="../assets/bps-logo.png"
          alt="Logo BPS"
          style={{
            height: '20mm',
            width: '23mm',
            marginBottom: '1mm',
            display: 'inline-block',
            mixBlendMode: 'multiply',
            backgroundColor: 'transparent'
          }}
          crossOrigin="anonymous"
        />
        <div style={{
          borderBottom: '2.25pt solid black',
          padding: '2mm 0',
          marginBottom: '2mm'
        }}>
          <h5 style={{
            margin: '1mm 0',
            fontWeight: 'bold',
            marginBottom: '1mm'
          }}>
            BADAN PUSAT STATISTIK<br />KOTA MOJOKERTO
          </h5>
        </div>
      </div>

      {data && (
        <>
          <div style={{ marginBottom: '2mm' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr style={{ lineHeight: '1' }}>
                  <td style={{ width: '70px' }}>Nomor</td>
                  <td style={{ width: '250px' }}>: {formatNomorSurat(data.nomor_surat)}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Mojokerto, {formatTanggalTanpaHari(data.tanggal_cetak)}</td>
                </tr>
                <tr style={{ lineHeight: '1' }}>
                  <td>Lampiran</td>
                  <td>: -</td>
                </tr>
                <tr style={{ lineHeight: '1' }}>
                  <td>Perihal</td>
                  <td>: Kenaikan Gaji Berkala</td>
                </tr>
                <tr style={{ lineHeight: '1' }}>
                  <td>Bulan</td>
                  <td>: {formatBulan(data.tmt_baru)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ height: '10mm' }}></div>

          <div style={{ marginBottom: 4 }}>
            <p style={{ marginBottom: 2 }}>Kepada Yth.<br />
              Kepala Kantor Pelayanan<br />
              Perbendaharaan Negara Mojokerto<br />
              Jl. Gajahmada No. 147<br />
              di<br />
              <b>MOJOKERTO</b>
            </p>
          </div>

          <div style={{ height: '10mm' }}></div>

          <div style={{ marginBottom: 4 }}>
            <p style={{ marginBottom: '2mm' }}>
              Dengan ini diberitahukan bahwa berhubung dengan telah dipenuhinya masa kerja dan syarat lainnya kepada:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>1. Nama</td>
                  <td style={{ width: '5%' }}>:</td>
                  <td>{data.nama}</td>
                </tr>
                <tr>
                  <td>2. Nomor Induk Pegawai (NIP)</td>
                  <td>:</td>
                  <td>{formatNIP(data.nip)}</td>
                </tr>
                <tr>
                  <td>3. Pangkat/Jabatan</td>
                  <td>:</td>
                  <td>{data.pangkat} / {data.jabatan}</td>
                </tr>
                <tr>
                  <td>4. Kantor/Tempat</td>
                  <td>:</td>
                  <td>{data.kantor}</td>
                </tr>
                <tr>
                  <td>5. Gaji Pokok Lama</td>
                  <td>:</td>
                  <td>{formatRupiah(data.gaji_pokok_lama)}</td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginBottom: '2mm' }}>(Atas dasar S.K.P terakhir tentang gaji/pangkat yang ditentukan)</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%', paddingLeft: '20px' }}>a. Oleh Pejabat</td>
                  <td style={{ width: '5%' }}>:</td>
                  <td>Presiden Republik Indonesia</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>b. Tanggal, Nomor</td>
                  <td>:</td>
                  <td>{formatTanggalTanpaHari(data.sk_tanggal)} Nomor : {data.sk_nomor}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>c. Tanggal mulai berlakunya</td>
                  <td>:</td>
                  <td>{formatTanggalTanpaHari(data.tmt_lama)}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '40px' }}>gaji tersebut</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '40px' }}>Masa kerja golongan pada</td>
                  <td>:</td>
                  <td>{data.masa_kerja_lama_tahun} Tahun {data.masa_kerja_lama_bulan} Bulan</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '40px' }}>tanggal tsb.</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginBottom: '2mm' }}>Diberikan kenaikan gaji berkala hingga memperoleh:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>6. Gaji Pokok Baru</td>
                  <td style={{ width: '5%' }}>:</td>
                  <td>{formatRupiah(data.gaji_pokok_baru)}</td>
                </tr>
                <tr>
                  <td>7. Berdasarkan Masa Kerja</td>
                  <td>:</td>
                  <td>{data.masa_kerja_baru_tahun} Tahun {data.masa_kerja_baru_bulan} Bulan</td>
                </tr>
                <tr>
                  <td>8. Dalam Golongan</td>
                  <td>:</td>
                  <td>{data.golongan}</td>
                </tr>
                <tr>
                  <td>9. Mulai Tanggal</td>
                  <td>:</td>
                  <td>{formatTanggalTanpaHari(data.tmt_baru)}</td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginBottom: 2 }}>
              Diharapkan agar sesuai dengan Peraturan Pemerintah Nomor 5 Tahun 2024, gaji pokok Pegawai Negeri tersebut
              dapat dibayarkan mulai tanggal tersebut di atas.
            </p>
          </div>

          <div style={{ height: '2mm' }}></div>

          <div style={{ marginBottom: '2mm' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ textAlign: 'right' }}>
                    Kepala BPS Kota Mojokerto<br />
                    <div style={{ height: '12mm' }}></div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', textAlign: 'right', marginRight: '1mm' }}>
                        <div><b>Hasan As'ari S.Si, M.E</b></div>
                        <div>NIP: 19740808199611001</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '3mm' }}>
            <b>Tembusan: disampaikan kepada Yth.</b>
            <ol style={{ margin: 0, paddingLeft: '15px', fontSize: '9pt' }}>
              <li style={{ marginBottom: '0.5mm' }}>Kepala Badan Pusat Statistik di Jakarta.</li>
              <li style={{ marginBottom: '0.5mm' }}>Kepala Kantor Pelayanan Perbendaharaan Negara Kota Mojokerto</li>
              <li style={{ marginBottom: '0.5mm' }}>Kepala Kantor Regional BKN, Jl. Letjen S. Parman, Waru di Sidoarjo</li>
              <li style={{ marginBottom: '0.5mm' }}>Kepala Kantor PT. TASPEN (PERSERO), Jl. Raya Diponegoro 193 Surabaya</li>
              <li style={{ marginBottom: '0.5mm' }}>Pembuat Daftar Gaji yang bersangkutan</li>
              <li style={{ marginBottom: '0.5mm' }}>Pegawai yang bersangkutan.</li>
              <li style={{ marginBottom: '0.5mm' }}>Arsip</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
});

export default SuratKGB;