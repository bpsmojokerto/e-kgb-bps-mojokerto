-- Ubah tipe data kolom gaji_pokok_lama dan gaji_pokok_baru menjadi BIGINT
ALTER TABLE kgb_pns ALTER COLUMN gaji_pokok_lama TYPE BIGINT USING gaji_pokok_lama::BIGINT;
ALTER TABLE kgb_pns ALTER COLUMN gaji_pokok_baru TYPE BIGINT USING gaji_pokok_baru::BIGINT;

-- Tambah kolom nomor_surat jika belum ada
ALTER TABLE kgb_pns ADD COLUMN IF NOT EXISTS nomor_surat TEXT; 