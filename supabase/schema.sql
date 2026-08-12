-- =========================================================
-- ARENA GAMING PARLOUR - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  scrap_balance INTEGER DEFAULT 1000 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GAMING STATIONS TABLE
CREATE TABLE IF NOT EXISTS public.gaming_stations (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  station_code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved')) NOT NULL,
  gpu TEXT NOT NULL,
  cpu TEXT NOT NULL,
  monitor TEXT NOT NULL,
  refresh_rate TEXT DEFAULT '240Hz',
  resolution TEXT DEFAULT '1440p',
  peripherals TEXT,
  price_per_hour NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER DEFAULT 1 NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'active', 'cancelled', 'completed')) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cash_or_arena' CHECK (payment_method IN ('pay_online', 'cash_or_arena', 'scrap', 'qr')) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKING STATIONS (MULTI-PC JUNCTION TABLE)
CREATE TABLE IF NOT EXISTS public.booking_stations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  station_id TEXT REFERENCES public.gaming_stations(id) ON DELETE CASCADE NOT NULL,
  station_name TEXT NOT NULL,
  room_id TEXT NOT NULL,
  price_per_hour NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BOOKING HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.booking_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  station_id TEXT NOT NULL,
  station_name TEXT NOT NULL,
  hours INTEGER NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Food', 'Drinks', 'Snacks', 'Energy Shots', 'Hot Meals')),
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  available BOOLEAN DEFAULT TRUE NOT NULL,
  stock INTEGER DEFAULT 50 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE (FOOD ORDERS TIED TO ACTIVE SESSION)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL NOT NULL,
  station_id TEXT NOT NULL,
  room_id TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'session_bill' CHECK (payment_method IN ('pay_online', 'scrap', 'session_bill')) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'added_to_bill')) NOT NULL,
  status TEXT DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  food_item_id TEXT REFERENCES public.food_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- 10. HELPDESK QUERIES TABLE
CREATE TABLE IF NOT EXISTS public.helpdesk_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  coupon_code TEXT NOT NULL UNIQUE,
  reward_type TEXT CHECK (reward_type IN ('pc', 'ps5', 'food')) NOT NULL,
  reward_title TEXT NOT NULL,
  reward_value NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'UNUSED' CHECK (status IN ('UNUSED', 'USED', 'EXPIRED')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_gaming_stations_room_id ON public.gaming_stations(room_id);
CREATE INDEX IF NOT EXISTS idx_gaming_stations_status ON public.gaming_stations(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time ON public.bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_booking_stations_booking ON public.booking_stations(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_stations_station ON public.booking_stations(station_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_booking_id ON public.orders(booking_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_helpdesk_queries_user_id ON public.helpdesk_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Public Read Access for Catalogs
CREATE POLICY "Allow public read on rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read on gaming_stations" ON public.gaming_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read on food_items" ON public.food_items FOR SELECT USING (true);

-- User-Specific Profiles Access
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Bookings & Booking Stations Access
CREATE POLICY "Allow public read on bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read on booking stations" ON public.booking_stations FOR SELECT USING (true);
CREATE POLICY "Users insert booking stations" ON public.booking_stations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings WHERE public.bookings.id = booking_stations.booking_id AND public.bookings.user_id = auth.uid())
);

-- User-Specific Booking History Access
CREATE POLICY "Users view own booking history" ON public.booking_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own booking history" ON public.booking_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-Specific Orders Access
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- User-Specific Order Items Access
CREATE POLICY "Users view order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
);
CREATE POLICY "Users insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
);

-- User-Specific Helpdesk Queries Access
CREATE POLICY "Users view own helpdesk queries" ON public.helpdesk_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own helpdesk queries" ON public.helpdesk_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-Specific Feedback Access
CREATE POLICY "Users view own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-Specific Coupons Access
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own coupons" ON public.coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own coupons" ON public.coupons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own coupons" ON public.coupons FOR UPDATE USING (auth.uid() = user_id);

-- =========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, full_name, email, scrap_balance)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    1000
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- AVAILABILITY RPC FUNCTIONS
-- =========================================================

-- 1. Get currently occupied stations for live 3D floor map
CREATE OR REPLACE FUNCTION public.get_current_station_availability()
RETURNS TABLE (
  station_id TEXT,
  end_time TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT bs.station_id, b.end_time
  FROM public.bookings b
  JOIN public.booking_stations bs ON bs.booking_id = b.id
  WHERE b.status IN ('confirmed', 'active', 'pending')
    AND b.start_time <= NOW()
    AND b.end_time > NOW()
  UNION
  SELECT DISTINCT b.station_id, b.end_time
  FROM public.bookings b
  WHERE b.station_id IS NOT NULL
    AND b.status IN ('confirmed', 'active', 'pending')
    AND b.start_time <= NOW()
    AND b.end_time > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Check station availability for future booking slot intervals
CREATE OR REPLACE FUNCTION public.check_station_availability(
  p_station_ids TEXT[],
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
)
RETURNS TABLE (
  station_id TEXT,
  available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS station_id,
    NOT EXISTS (
      SELECT 1
      FROM public.bookings b
      LEFT JOIN public.booking_stations bs ON bs.booking_id = b.id
      WHERE (b.station_id = s.id OR bs.station_id = s.id)
        AND b.status IN ('confirmed', 'active', 'pending')
        AND b.start_time < p_end_time
        AND b.end_time > p_start_time
    ) AS available
  FROM unnest(p_station_ids) AS s(id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- SEED DATA
-- =========================================================

-- 1. ROOMS
INSERT INTO public.rooms (id, name, type, description, capacity) VALUES
('entry', 'ENTRY / EXIT', 'entry', 'Exit Arena & Sign Out', 0),
('reception', 'RECEPTION', 'reception', 'Queries, Support & Member Helpdesk', 1),
('sphere1', 'SPHERE 1', 'pc', '10x RTX 4070 Rigs @ 240Hz 1440p displays', 10),
('sphere2', 'SPHERE 2', 'pc', '10x RTX 4080 Rigs @ 360Hz QD-OLED displays', 10),
('elite', 'SPHERE ELITE', 'pc', '6x RTX 4090 24GB VIP Suites with 540Hz QD-OLEDs', 6),
('lounge', 'LOUNGE', 'console', '6x PS5 Booths with 65" 4K 120Hz OLEDs & Leather Sofas', 6),
('kitchen', 'KITCHEN', 'kitchen', 'Fresh gaming burgers, fries, pizza, energy drinks & cold brews', 20)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity;

-- 2. GAMING STATIONS
INSERT INTO public.gaming_stations (id, room_id, station_code, name, status, gpu, cpu, monitor, refresh_rate, resolution, peripherals, price_per_hour) VALUES
-- Sphere 1 (10 PCs)
('PC-01', 'sphere1', 'PC-01', 'Alpha Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'Logitech G Pro Superlight', 15.00),
('PC-02', 'sphere1', 'PC-02', 'Bravo Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'Razer Viper V2 Pro', 15.00),
('PC-03', 'sphere1', 'PC-03', 'Charlie Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'Logitech G Pro Superlight', 15.00),
('PC-04', 'sphere1', 'PC-04', 'Delta Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'SteelSeries Apex Pro', 15.00),
('PC-05', 'sphere1', 'PC-05', 'Echo Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'Razer DeathAdder V3', 15.00),
('PC-06', 'sphere1', 'PC-06', 'Foxtrot Rig', 'Available', 'RTX 4070', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'Logitech G Pro Superlight', 15.00),
('PC-07', 'sphere1', 'PC-07', 'Golf Rig', 'Available', 'RTX 4070 Super', 'AMD Ryzen 7 7800X3D', '27" Esports Display', '240Hz', '1440p', 'HyperX Pulsefire Haste', 15.00),
('PC-08', 'sphere1', 'PC-08', 'Hotel Rig', 'Available', 'RTX 4070 Super', 'AMD Ryzen 7 7800X3D', '27" Esports Display', '240Hz', '1440p', 'Logitech G502 X', 15.00),
('PC-09', 'sphere1', 'PC-09', 'India Rig', 'Available', 'RTX 4070', 'Intel i7-13700K', '27" Esports Display', '240Hz', '1440p', 'Razer Viper Ultimate', 15.00),
('PC-10', 'sphere1', 'PC-10', 'Juliet Rig', 'Available', 'RTX 4070 Super', 'Intel i7-14700K', '27" Esports Display', '240Hz', '1440p', 'SteelSeries Prime', 15.00),

-- Sphere 2 (10 PCs)
('PC-11', 'sphere2', 'PC-11', 'Squad Pro 1', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" QD-OLED', '360Hz', '1440p', 'Wooting 60HE Keyboard', 20.00),
('PC-12', 'sphere2', 'PC-12', 'Squad Pro 2', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" QD-OLED', '360Hz', '1440p', 'Logitech G Pro X', 20.00),
('PC-13', 'sphere2', 'PC-13', 'Squad Pro 3', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" QD-OLED', '360Hz', '1440p', 'Wooting 60HE Keyboard', 20.00),
('PC-14', 'sphere2', 'PC-14', 'Squad Pro 4', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" QD-OLED', '360Hz', '1440p', 'Razer DeathAdder V3', 20.00),
('PC-15', 'sphere2', 'PC-15', 'Squad Pro 5', 'Available', 'RTX 4080 Super', 'Intel i9-13900K', '27" QD-OLED', '360Hz', '1440p', 'Logitech G Pro X Superlight 2', 20.00),
('PC-16', 'sphere2', 'PC-16', 'Squad Pro 6', 'Available', 'RTX 4080 Super', 'Intel i9-13900K', '27" QD-OLED', '360Hz', '1440p', 'Razer Huntsman V3 Pro', 20.00),
('PC-17', 'sphere2', 'PC-17', 'Squad Pro 7', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" Fast IPS', '360Hz', '1440p', 'SteelSeries Apex Pro TKL', 20.00),
('PC-18', 'sphere2', 'PC-18', 'Squad Pro 8', 'Available', 'RTX 4080', 'AMD Ryzen 7 7800X3D', '27" Fast IPS', '360Hz', '1440p', 'Asus ROG Harpe Ace', 20.00),
('PC-19', 'sphere2', 'PC-19', 'Squad Pro 9', 'Available', 'RTX 4080 Super', 'Intel i9-14900K', '27" QD-OLED', '360Hz', '1440p', 'Logitech G Pro X Superlight 2', 20.00),
('PC-20', 'sphere2', 'PC-20', 'Squad Pro 10', 'Available', 'RTX 4080 Super', 'Intel i9-14900K', '27" QD-OLED', '360Hz', '1440p', 'Wooting 80Hz Keyboard', 20.00),

-- Sphere Elite (6 Premium VIP Suites)
('VIP-PC-01', 'elite', 'VIP-01', 'VIP Suite Apex', 'Available', 'RTX 4090 24GB', 'Intel i9-14900KS', '32" Dual-Mode QD-OLED', '540Hz', '4K / 1080p', 'Custom Magnetic Hall Effect Keyboard', 30.00),
('VIP-PC-02', 'elite', 'VIP-02', 'VIP Suite Titan', 'Available', 'RTX 4090 24GB', 'Intel i9-14900KS', '32" Dual-Mode QD-OLED', '540Hz', '4K / 1080p', 'Custom Magnetic Hall Effect Keyboard', 30.00),
('VIP-PC-03', 'elite', 'VIP-03', 'VIP Suite Omega', 'Available', 'RTX 4090 24GB', 'Intel i9-14900KS', '32" Dual-Mode QD-OLED', '540Hz', '4K / 1080p', 'Custom Magnetic Hall Effect Keyboard', 30.00),
('VIP-PC-04', 'elite', 'VIP-04', 'VIP Suite Matrix', 'Available', 'RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '34" Curved Ultrawide OLED', '175Hz', '1440p Ultrawide', 'Finalmouse UltralightX', 30.00),
('VIP-PC-05', 'elite', 'VIP-05', 'VIP Suite Phantom', 'Available', 'RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '34" Curved Ultrawide OLED', '175Hz', '1440p Ultrawide', 'Logitech G Pro X TKL', 30.00),
('VIP-PC-06', 'elite', 'VIP-06', 'VIP Suite Valkyrie', 'Available', 'RTX 4090 24GB', 'Intel i9-14900KS', '32" 4K QD-OLED', '240Hz', '4K', 'Custom Lubed Mechanical Keyboard', 30.00),

-- Console Lounge (6 PS5 Booths)
('PS5-01', 'lounge', 'PS5-01', 'Console Pod 1', 'Available', 'PS5 Custom RDNA 2', 'AMD Zen 2 Custom', '65" 4K 120Hz OLED', '120Hz', '4K HDR', 'DualSense Edge Controllers', 18.00),
('PS5-02', 'lounge', 'PS5-02', 'Console Pod 2', 'Available', 'PS5 Custom RDNA 2', 'AMD Zen 2 Custom', '65" 4K 120Hz OLED', '120Hz', '4K HDR', 'DualSense Edge Controllers & Pulse 3D', 18.00),
('PS5-03', 'lounge', 'PS5-03', 'Console Pod 3', 'Available', 'PS5 Custom RDNA 2', 'AMD Zen 2 Custom', '65" 4K 120Hz OLED', '120Hz', '4K HDR', 'Recliner Pod & DualSense Controllers', 18.00),
('PS5-04', 'lounge', 'PS5-04', 'Console Pod 4', 'Available', 'PS5 Custom RDNA 2', 'AMD Zen 2 Custom', '65" 4K 120Hz OLED', '120Hz', '4K HDR', 'DualSense Controllers', 18.00),
('PS5-05', 'lounge', 'PS5-05', 'Console Pod 5', 'Available', 'PS5 Pro Custom RDNA 3', 'AMD Zen 2 Custom', '75" Sony Bravia 4K OLED', '120Hz', '4K HDR', 'DualSense Pro Controllers', 18.00),
('PS5-06', 'lounge', 'PS5-06', 'Console Pod 6', 'Available', 'PS5 Pro Custom RDNA 3', 'AMD Zen 2 Custom', '75" Sony Bravia 4K OLED', '120Hz', '4K HDR', 'DualSense Pro Controllers & Racing Wheel', 18.00)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  gpu = EXCLUDED.gpu,
  price_per_hour = EXCLUDED.price_per_hour;

-- 3. FOOD ITEMS
INSERT INTO public.food_items (id, name, category, description, price, available, stock, image_url) VALUES
-- Food & Snacks
('F-01', 'Classic Loaded Burger', 'Snacks', 'Grilled patty with cheese, caramelized onions & house special sauce', 8.50, true, 50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'),
('F-02', 'Crispy Paneer Burger', 'Snacks', 'Spicy paneer patty, crunchy lettuce & mint mayo', 7.50, true, 50, 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=400&q=80'),
('F-03', 'Peri Peri Fries', 'Snacks', 'Crispy golden fries tossed in hot peri peri seasoning', 4.50, true, 100, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=400&q=80'),
('F-04', 'Pepperoni Loaded Pizza', 'Hot Meals', 'Mozzarella, spicy pepperoni, oregano & chili flakes', 14.00, true, 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'),
('F-05', 'Farmhouse Veg Pizza', 'Hot Meals', 'Capsicum, onion, mushroom, corn & mozzarella cheese', 12.00, true, 30, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80'),
('F-06', 'Tactical Buffalo Wings (8pcs)', 'Food', 'Crispy jumbo wings tossed in signature fiery buffalo sauce', 11.00, true, 40, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80'),
('F-07', 'Overdrive Tonkotsu Ramen', 'Hot Meals', 'Rich pork broth, chashu, ajitama egg & fresh noodles', 14.50, true, 25, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80'),
('F-08', 'Esports Mozzarella Sticks', 'Snacks', 'Golden fried mozzarella sticks served with marinara sauce', 7.50, true, 60, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=400&q=80'),

-- Drinks & Energy Shots
('D-01', 'Monster Energy Drink (500ml)', 'Energy Shots', 'Original Green Energy Blend for marathon gaming sessions', 4.00, true, 200, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=400&q=80'),
('D-02', 'Red Bull Energy Drink (250ml)', 'Energy Shots', 'Vitalizes body and mind with invigorating energy formula', 3.50, true, 200, 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=400&q=80'),
('D-03', 'Chilled Cold Brew Coffee', 'Drinks', 'Rich dark roast cold brew infused with nitrogen foam', 4.50, true, 80, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80'),
('D-04', 'Chilled Cola (500ml)', 'Drinks', 'Crisp chilled carbonated soft drink', 2.50, true, 150, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'),
('D-05', 'Dragonfruit Lemonade', 'Drinks', 'Electrolyte-charged dragonfruit lemonade over crushed ice', 4.25, true, 75, 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  available = EXCLUDED.available;
