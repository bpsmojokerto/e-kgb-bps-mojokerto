-- Create table for PNS data
CREATE TABLE IF NOT EXISTS pns_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(18) NOT NULL UNIQUE,
    pangkat VARCHAR(100) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    golongan VARCHAR(50) NOT NULL,
    unit_kerja VARCHAR(255) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    tanggal_pengangkatan DATE NOT NULL,
    nomor_sk VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_pns_nip ON pns_data(nip);
CREATE INDEX idx_pns_nama ON pns_data(nama);

-- Add RLS (Row Level Security) policies
ALTER TABLE pns_data ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON pns_data
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Enable insert for authenticated users" ON pns_data
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Enable update for authenticated users" ON pns_data
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Enable delete for authenticated users" ON pns_data
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pns_data_updated_at
    BEFORE UPDATE ON pns_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
