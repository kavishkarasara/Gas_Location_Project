-- 1. Create Sellers Table
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Gas Stations Table
CREATE TABLE gas_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  litro12_5kg BOOLEAN DEFAULT false,
  litro5kg BOOLEAN DEFAULT false,
  laugfs12_5kg BOOLEAN DEFAULT false,
  laugfs5kg BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We are allowing all operations for now (Disabling RLS) so our Next.js backend API routes can access it directly. 
-- In a real, highly secure production app, we would enable RLS and use Service Role Keys for the API.
ALTER TABLE sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE gas_stations DISABLE ROW LEVEL SECURITY;
