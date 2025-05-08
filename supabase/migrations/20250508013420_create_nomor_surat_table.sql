-- Create table for nomor surat
CREATE TABLE IF NOT EXISTS nomor_surat (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tahun INTEGER NOT NULL,
    nomor_urut INTEGER NOT NULL,
    jenis_surat VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(tahun, jenis_surat)
);

-- Create index for faster searches
CREATE INDEX idx_nomor_surat_tahun ON nomor_surat(tahun);
CREATE INDEX idx_nomor_surat_jenis ON nomor_surat(jenis_surat);

-- Add RLS (Row Level Security) policies
ALTER TABLE nomor_surat ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON nomor_surat
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Enable insert for authenticated users" ON nomor_surat
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Enable update for authenticated users" ON nomor_surat
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_nomor_surat_updated_at
    BEFORE UPDATE ON nomor_surat
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for tahun 2025
INSERT INTO nomor_surat (tahun, nomor_urut, jenis_surat)
VALUES (2025, 1, 'KGB')
ON CONFLICT (tahun, jenis_surat) DO NOTHING; 