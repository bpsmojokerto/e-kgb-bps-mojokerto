import React, { forwardRef, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const SuratKGBPPPK = forwardRef(({ data }, ref) => {
  const [penandatangan, setPenandatangan] = useState(null);

  useEffect(() => {
    const fetchPenandatangan = async () => {
      try {
        const { data: ttd, error } = await supabase
          .from('penandatangan')
          .select('*')
          .single();
        
        if (error) {
          console.error('Error fetching penandatangan:', error);
          return;
        }

        if (ttd) {
          console.log('Data penandatangan loaded:', ttd); // untuk debugging
          setPenandatangan(ttd);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPenandatangan();
  }, []);

  if (!data) return null;

  return (
    <div ref={ref} style={{ width: 700, margin: '0 auto', color: '#000', background: '#fff', padding: 30 }}>
      {/* ... kode lainnya tetap sama ... */}
      <div style={{ float: 'right', textAlign: 'center', marginTop: 40 }}>
        {penandatangan ? (
          <>
            {penandatangan.jabatan}<br /><br /><br /><br />
            <b>{penandatangan.nama}</b><br />
            NIP: {penandatangan.nip}
          </>
        ) : (
          <>
            Kepala BPS Kota Mojokerto<br /><br /><br /><br />
            <b>Menunggu data...</b><br />
            NIP: -
          </>
        )}
      </div>
      {/* ... kode lainnya tetap sama ... */}
    </div>
  );
});

export default SuratKGBPPPK;