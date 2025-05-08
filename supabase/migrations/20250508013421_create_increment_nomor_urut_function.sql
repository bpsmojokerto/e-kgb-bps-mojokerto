-- Create function to increment nomor urut
CREATE OR REPLACE FUNCTION increment_nomor_urut()
RETURNS INTEGER AS $$
DECLARE
    current_nomor INTEGER;
BEGIN
    -- Get current nomor urut
    SELECT nomor_urut INTO current_nomor
    FROM nomor_surat
    WHERE tahun = EXTRACT(YEAR FROM CURRENT_DATE)
    AND jenis_surat = 'KGB'
    FOR UPDATE;

    -- Increment nomor urut
    RETURN current_nomor + 1;
END;
$$ LANGUAGE plpgsql; 