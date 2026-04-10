-- SQL to create the blogs table in Supabase

CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meta TEXT, -- e.g., "Featured Publication"
  image_url TEXT,
  pdf_url TEXT,
  read_url TEXT,
  theme TEXT DEFAULT 'light', -- 'dark' or 'light'
  is_coming_soon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_index SERIAL -- to maintain the display order
);

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON blogs
  FOR SELECT USING (true);
