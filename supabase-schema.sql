-- =============================================
-- EMBROIDERY GALLERY - SUPABASE DATABASE SCHEMA
-- =============================================
-- Run this in your Supabase SQL Editor (supabase.com)
-- Go to: SQL Editor > New Query > Paste this > Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DESIGNS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  available_sizes TEXT[] DEFAULT '{"S", "M", "L", "XL"}',
  available_textiles TEXT[] DEFAULT '{"T-Shirt", "Hoodie"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  design_id UUID REFERENCES designs(id),
  design_name VARCHAR(255) NOT NULL,
  twitch_username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  textile_type VARCHAR(100) NOT NULL,
  size VARCHAR(20) NOT NULL,
  redemption_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- REDEMPTION CODES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS redemption_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_used BOOLEAN DEFAULT false,
  used_by VARCHAR(255),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemption_codes ENABLE ROW LEVEL SECURITY;

-- Designs: Anyone can read active designs
CREATE POLICY "Public can view active designs" ON designs
  FOR SELECT USING (is_active = true);

-- Orders: Only allow insert (submission) from public
CREATE POLICY "Public can submit orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders: Admin can view all (you'll use service role key for admin)
CREATE POLICY "Service role can view orders" ON orders
  FOR SELECT USING (auth.role() = 'service_role');

-- Redemption codes: Public can read for validation
CREATE POLICY "Public can validate codes" ON redemption_codes
  FOR SELECT USING (true);

-- Redemption codes: Public can update (mark as used)
CREATE POLICY "Public can use codes" ON redemption_codes
  FOR UPDATE USING (true);

-- =============================================
-- ENABLE REALTIME FOR STREAM OVERLAY
-- =============================================

-- This enables real-time subscriptions for the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================
-- Uncomment and run these to add sample designs

/*
INSERT INTO designs (name, description, image_url, category, available_sizes, available_textiles) VALUES
  ('The Bird', 'A delicate songbird perched on a flowering branch. Perfect for nature lovers.', 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=400&h=400&fit=crop', 'Nature', '{"S", "M", "L", "XL", "2XL"}', '{"T-Shirt", "Hoodie", "Tote Bag", "Cap"}'),
  ('Floral Mandala', 'Intricate mandala pattern with floral elements. A statement piece.', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop', 'Abstract', '{"S", "M", "L", "XL"}', '{"T-Shirt", "Sweatshirt", "Pillow Cover"}'),
  ('Mountain Sunset', 'Layered mountain silhouettes against a gradient sunset sky.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', 'Landscape', '{"M", "L", "XL", "2XL"}', '{"T-Shirt", "Hoodie", "Jacket"}'),
  ('Celestial Moon', 'Mystical crescent moon surrounded by stars and cosmic elements.', 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop', 'Celestial', '{"XS", "S", "M", "L", "XL"}', '{"T-Shirt", "Tank Top", "Beanie"}'),
  ('Botanical Garden', 'Lush botanical illustration featuring exotic leaves and flowers.', 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop', 'Nature', '{"S", "M", "L"}', '{"T-Shirt", "Tote Bag", "Apron"}'),
  ('Geometric Fox', 'Modern geometric interpretation of a fox. Bold and contemporary.', 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop', 'Animals', '{"S", "M", "L", "XL", "2XL"}', '{"T-Shirt", "Hoodie", "Snapback"}');
*/

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_codes_code ON redemption_codes(code);
CREATE INDEX IF NOT EXISTS idx_designs_category ON designs(category);
