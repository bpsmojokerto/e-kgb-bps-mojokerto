-- Add nomor_surat column to kgb_pns table
ALTER TABLE kgb_pns
ADD COLUMN nomor_surat VARCHAR(50);

-- Update existing records with default format
UPDATE kgb_pns
SET nomor_surat = CONCAT(
    LPAD(CAST(ROW_NUMBER() OVER (ORDER BY created_at) AS TEXT), 3, '0'),
    '/3576/KP.800/TAHUN ',
    EXTRACT(YEAR FROM created_at)
)
WHERE nomor_surat IS NULL; 