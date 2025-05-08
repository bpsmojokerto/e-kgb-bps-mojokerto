import React, { forwardRef } from 'react';

const SuratKGB = forwardRef(({ data }, ref) => {
  if (!data) return null;

  // Format tanggal ke format Indonesia
  const formatTanggal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const bulan = date.toLocaleString('id-ID', { month: 'long' });
    return `${date.getDate()} ${bulan} ${date.getFullYear()}`;
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

  return (
    <div ref={ref} style={{
      width: '210mm',
      minHeight: '280mm',
      margin: '0 auto',
      color: '#000',
      background: '#fff',
      padding: '5mm 15mm',
      fontSize: '10pt',
      lineHeight: '1.3',
      fontFamily: 'Arial, sans-serif',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      boxSizing: 'border-box',
      overflow: 'hidden',
      pageBreakInside: 'avoid',
      pageBreakAfter: 'avoid',
      pageBreakBefore: 'avoid'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 3 }}>
        <img
          src={require('../assets/bps-logo.png')}
          alt="Logo BPS"
          style={{
            height: '25mm',
            width: '28mm',
            marginBottom: '2mm',
            display: 'inline-block'
          }}
        />
        <div style={{
          borderBottom: '2.25pt solid black',
          padding: '3mm 0',
          marginBottom: '3mm'
        }}>
          <h5 style={{
            margin: '2px 0',
            fontWeight: 'bold',
            marginBottom: '2mm'
          }}>
            BADAN PUSAT STATISTIK<br />KOTA MOJOKERTO
          </h5>
        </div>
      </div>

      {data && (
        <>
          <div style={{ marginBottom: 4 }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr style={{ lineHeight: '1' }}>
                  <td style={{ width: '70px' }}>Nomor</td>
                  <td style={{ width: '250px' }}>: {formatNomorSurat(data.nomor_surat)}</td>
                  <td style={{ textAlign: 'right' }}>Mojokerto, {formatTanggal(data.tanggal_cetak)}</td>
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
                  <td></td>
                  <td>Bulan : {data.tmt_baru && new Date(data.tmt_baru).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 4 }}>
            <p style={{ marginBottom: 2 }}>Kepada Yth.<br />
              Kepala Kantor Pelayanan<br />
              Perbendaharaan Negara Mojokerto<br />
              Jl. Gajahmada No. 147<br />
              di<br />
              <b>MOJOKERTO</b>
            </p>
          </div>

          <div style={{ marginBottom: 4 }}>
            <p style={{ marginBottom: 2 }}>
              Dengan ini diberitahukan bahwa berhubung dengan telah dipenuhinya masa kerja dan syarat lainnya kepada :
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '8mm' }}>1.</td>
                  <td style={{ width: '65mm', whiteSpace: 'nowrap' }}>N a m a</td>
                  <td style={{ width: '5mm', textAlign: 'right' }}>:</td>
                  <td>{data.nama}</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Nomor Induk Pegawai (NIP)</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{formatNIP(data.nip)}</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Pangkat/Jabatan</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{data.pangkat} / {data.jabatan}</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Kantor/Tempat</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{data.kantor}</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Gaji Pokok Lama</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{formatRupiah(data.gaji_pokok_lama)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="3">( Atas dasar S.K.P terakhir tentang gaji/pangkat yang ditentukan )</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ whiteSpace: 'nowrap' }}>a. Oleh Pejabat</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>Presiden Republik Indonesia</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ whiteSpace: 'nowrap' }}>b. Tanggal, Nomor</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{formatTanggal(data.sk_tanggal)} Nomor : {data.sk_nomor || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ whiteSpace: 'nowrap' }}>c. Tanggal mulai berlakunya gaji tersebut</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{formatTanggal(data.tmt_lama)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ whiteSpace: 'nowrap' }}>Masa kerja golongan pada tanggal tsb.</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{data.masa_kerja_lama} Tahun</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 4 }}>
            <p style={{ marginBottom: 2 }}>
              Diberikan kenaikan gaji berkala hingga memperoleh:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '8mm' }}>6.</td>
                  <td style={{ width: '65mm', whiteSpace: 'nowrap' }}>Gaji Pokok Baru</td>
                  <td style={{ width: '5mm', textAlign: 'right' }}>:</td>
                  <td>{formatRupiah(data.gaji_pokok_baru)}</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Berdasarkan Masa Kerja</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{data.masa_kerja_baru} Tahun</td>
                </tr>
                <tr>
                  <td>8.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Dalam Golongan</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{data.golongan}</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td style={{ whiteSpace: 'nowrap' }}>Mulai Tanggal</td>
                  <td style={{ textAlign: 'right' }}>:</td>
                  <td>{formatTanggal(data.tmt_baru)}</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginBottom: 2, marginTop: 2 }}>
              Diharapkan agar sesuai dengan Peraturan Pemerintah Nomor 5 Tahun 2024, gaji pokok Pegawai Negeri tersebut dapat dibayarkan mulai tanggal tersebut di atas.
            </p>
          </div>

          <div style={{ marginBottom: 4 }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ textAlign: 'right' }}>
                    Kepala BPS Kota Mojokerto<br /><br />
                    <b>Hasan As'ari S.Si, M.E</b><br />
                    NIP: 19740808199611001
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ clear: 'both', marginTop: 6 }}>
            <b>Tembusan:</b>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 1 }}>Kepala Kantor Pelayanan Perbendaharaan Negara Kota Mojokerto</li>
              <li style={{ marginBottom: 1 }}>Kepala BPS Provinsi Jawa Timur</li>
              <li style={{ marginBottom: 1 }}>Kepala Kantor Cabang BSI, Jl. Empunala No. 9, Surodinawan, Kota Mojokerto</li>
              <li style={{ marginBottom: 1 }}>Kepala Kantor PT. TASPEN (PERSERO), Jl. Raya Diponegoro 193 Surabaya</li>
              <li style={{ marginBottom: 1 }}>Arsip</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
});

export default SuratKGB;