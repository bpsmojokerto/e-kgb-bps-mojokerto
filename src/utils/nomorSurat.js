import { supabase } from '../supabaseClient';

export const getNomorSurat = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get current nomor urut
    const { data, error } = await supabase
      .from('nomor_surat')
      .select('nomor_urut')
      .eq('tahun', currentYear)
      .eq('jenis_surat', 'KGB')
      .single();

    if (error) throw error;

    // Format nomor surat
    const nomorUrut = data.nomor_urut.toString().padStart(3, '0');
    return `${nomorUrut}/3576/KP.800/TAHUN ${currentYear}`;
  } catch (error) {
    console.error('Error getting nomor surat:', error);
    return null;
  }
};

export const incrementNomorSurat = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Update nomor urut
    const { data, error } = await supabase
      .from('nomor_surat')
      .update({ nomor_urut: supabase.rpc('increment_nomor_urut') })
      .eq('tahun', currentYear)
      .eq('jenis_surat', 'KGB')
      .select()
      .single();

    if (error) throw error;

    // Format nomor surat
    const nomorUrut = data.nomor_urut.toString().padStart(3, '0');
    return `${nomorUrut}/3576/KP.800/TAHUN ${currentYear}`;
  } catch (error) {
    console.error('Error incrementing nomor surat:', error);
    return null;
  }
}; 