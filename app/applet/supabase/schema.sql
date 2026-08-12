-- =================================================================
-- ARENA PARLOUR SUPABASE DATABASE SCHEMA (PRODUCTION REPAIR)
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    scrap_balance NUMERIC(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('pc', 'console', 'kitchen', 'reception', 'entry')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GAMING STATIONS TABLE
CREATE TABLE IF NOT EXISTS public.gaming_stations (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved', 'Maintenance')),
    gpu TEXT,
    cpu TEXT,
    monitor TEXT,
    refresh_rate TEXT,
    resolution TEXT,
    peripherals TEXT,
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    station_id TEXT REFERENCES public.gaming_stations(id),
    room_id TEXT REFERENCES public.rooms(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded')),
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'pay_online' CHECK (payment_method IN ('pay_online', 'cash_or_arena', 'scrap', 'qr')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BOOKING STATIONS (JUNCTION TABLE FOR MULTI-STATION BOOKINGS)
CREATE TABLE IF NOT EXISTS public.booking_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL REFERENCES public.gaming_stations(id) ON DELETE CASCADE,
    station_name TEXT,
    room_id TEXT REFERENCES public.rooms(id),
    price_per_hour NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOKING HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.booking_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    station_id TEXT,
    station_name TEXT,
    hours INTEGER NOT NULL DEFAULT 1,
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT 100,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    station_id TEXT NOT NULL,
    room_id TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'pay_online' CHECK (payment_method IN ('pay_online', 'scrap', 'session_bill')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'added_to_bill', 'refunded')),
    status TEXT NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id TEXT REFERENCES public.food_items(id),
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. HELPDESK QUERIES TABLE
CREATE TABLE IF NOT EXISTS public.helpdesk_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- INDEXES FOR OVERLAP CHECKING & PERFORMANCE
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_time_status ON public.bookings(start_time, end_time, status);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_stations_booking ON public.booking_stations(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_stations_station ON public.booking_stations(station_id);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================
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

-- Public read policies
CREATE POLICY "Allow public read on rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read on gaming_stations" ON public.gaming_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read on food_items" ON public.food_items FOR SELECT USING (true);

-- User-restricted private data policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own booking stations" ON public.booking_stations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE public.bookings.id = public.booking_stations.booking_id
        AND public.bookings.user_id = auth.uid()
    )
);
CREATE POLICY "Users insert own booking stations" ON public.booking_stations FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE public.bookings.id = public.booking_stations.booking_id
        AND public.bookings.user_id = auth.uid()
    )
);

CREATE POLICY "Users view own booking history" ON public.booking_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own booking history" ON public.booking_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE public.orders.id = public.order_items.order_id
        AND public.orders.user_id = auth.uid()
    )
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE public.orders.id = public.order_items.order_id
        AND public.orders.user_id = auth.uid()
    )
);

CREATE POLICY "Users view own queries" ON public.helpdesk_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own queries" ON public.helpdesk_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users insert feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, user_id, full_name, email, scrap_balance)
    VALUES (
        NEW.id,
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Arena Gamer'),
        NEW.email,
        1000.00
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================
-- SECURITY DEFINER RPCs FOR AVAILABILITY & ATOMIC BOOKINGS
-- =================================================================

-- 1. CHECK AVAILABILITY FOR A SPECIFIC TIME SLOT
CREATE OR REPLACE FUNCTION public.check_station_availability(
    requested_station_ids TEXT[],
    requested_start TIMESTAMPTZ,
    requested_end TIMESTAMPTZ
)
RETURNS TABLE (
    station_id TEXT,
    unavailable BOOLEAN,
    end_time TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        s_id AS station_id,
        TRUE AS unavailable,
        MAX(b.end_time) AS end_time
    FROM (
        SELECT b_inner.station_id AS s_id, b_inner.end_time
        FROM public.bookings b_inner
        WHERE b_inner.status IN ('confirmed', 'active', 'pending')
          AND b_inner.start_time < requested_end
          AND b_inner.end_time > requested_start
          AND b_inner.station_id = ANY(requested_station_ids)
        
        UNION ALL
        
        SELECT bs.station_id AS s_id, b_inner.end_time
        FROM public.bookings b_inner
        JOIN public.booking_stations bs ON bs.booking_id = b_inner.id
        WHERE b_inner.status IN ('confirmed', 'active', 'pending')
          AND b_inner.start_time < requested_end
          AND b_inner.end_time > requested_start
          AND bs.station_id = ANY(requested_station_ids)
    ) b
    GROUP BY s_id;
END;
$$;

-- 2. GET CURRENT REAL-TIME STATION AVAILABILITY FOR FLOOR MAP
CREATE OR REPLACE FUNCTION public.get_current_station_availability()
RETURNS TABLE (
    station_id TEXT,
    end_time TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        s_id AS station_id,
        MAX(b.end_time) AS end_time
    FROM (
        SELECT b_inner.station_id AS s_id, b_inner.end_time
        FROM public.bookings b_inner
        WHERE b_inner.status IN ('confirmed', 'active')
          AND b_inner.start_time <= NOW()
          AND b_inner.end_time > NOW()
          AND b_inner.station_id IS NOT NULL
        
        UNION ALL
        
        SELECT bs.station_id AS s_id, b_inner.end_time
        FROM public.bookings b_inner
        JOIN public.booking_stations bs ON bs.booking_id = b_inner.id
        WHERE b_inner.status IN ('confirmed', 'active')
          AND b_inner.start_time <= NOW()
          AND b_inner.end_time > NOW()
    ) b
    GROUP BY s_id;
END;
$$;

-- 3. ATOMIC MULTI-STATION BOOKING CREATION
CREATE OR REPLACE FUNCTION public.create_multi_station_booking(
    requested_station_ids TEXT[],
    requested_start TIMESTAMPTZ,
    requested_end TIMESTAMPTZ,
    requested_duration INTEGER,
    requested_payment_method TEXT,
    requested_payment_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_station_count INT;
    v_valid_station_count INT;
    v_conflict_stations TEXT[];
    v_total_cost NUMERIC(10, 2) := 0;
    v_booking_ref TEXT;
    v_booking_id UUID;
    v_first_station_id TEXT;
    v_first_room_id TEXT;
    v_st RECORD;
    v_bs_rows JSONB := '[]'::jsonb;
BEGIN
    -- 1. Get authenticated user ID
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated request. Please sign in to create a booking.';
    END IF;

    v_station_count := array_length(requested_station_ids, 1);
    IF v_station_count IS NULL OR v_station_count = 0 THEN
        RAISE EXCEPTION 'No stations selected for booking.';
    END IF;

    -- 2. Verify all station IDs exist in gaming_stations
    SELECT COUNT(*) INTO v_valid_station_count
    FROM public.gaming_stations
    WHERE id = ANY(requested_station_ids);

    IF v_valid_station_count < v_station_count THEN
        RAISE EXCEPTION 'One or more selected gaming stations do not exist.';
    END IF;

    -- 3. Check for overlapping bookings on any requested station
    SELECT ARRAY_AGG(DISTINCT s_id) INTO v_conflict_stations
    FROM (
        SELECT b_inner.station_id AS s_id
        FROM public.bookings b_inner
        WHERE b_inner.status IN ('confirmed', 'active', 'pending')
          AND b_inner.start_time < requested_end
          AND b_inner.end_time > requested_start
          AND b_inner.station_id = ANY(requested_station_ids)
        
        UNION ALL
        
        SELECT bs.station_id AS s_id
        FROM public.bookings b_inner
        JOIN public.booking_stations bs ON bs.booking_id = b_inner.id
        WHERE b_inner.status IN ('confirmed', 'active', 'pending')
          AND b_inner.start_time < requested_end
          AND b_inner.end_time > requested_start
          AND bs.station_id = ANY(requested_station_ids)
    ) conflicts;

    IF v_conflict_stations IS NOT NULL AND array_length(v_conflict_stations, 1) > 0 THEN
        RAISE EXCEPTION 'Booking conflict: Station(s) [%] are no longer available for the requested time slot.', array_to_string(v_conflict_stations, ', ');
    END IF;

    -- 4. Calculate total cost using database price_per_hour
    SELECT SUM(price_per_hour * requested_duration) INTO v_total_cost
    FROM public.gaming_stations
    WHERE id = ANY(requested_station_ids);

    v_first_station_id := requested_station_ids[1];
    SELECT room_id INTO v_first_room_id FROM public.gaming_stations WHERE id = v_first_station_id;

    -- 5. Generate Booking Reference
    v_booking_ref := 'ARENA-' || FLOOR(10000 + random() * 90000)::TEXT;

    -- 6. Insert primary booking
    INSERT INTO public.bookings (
        booking_reference,
        user_id,
        station_id,
        room_id,
        start_time,
        end_time,
        duration_hours,
        status,
        total_cost,
        payment_method,
        payment_status
    ) VALUES (
        v_booking_ref,
        v_user_id,
        v_first_station_id,
        v_first_room_id,
        requested_start,
        requested_end,
        requested_duration,
        'confirmed',
        v_total_cost,
        requested_payment_method,
        requested_payment_status
    ) RETURNING id INTO v_booking_id;

    -- 7. Insert booking_stations rows for each station
    FOR v_st IN
        SELECT id, name, room_id, price_per_hour
        FROM public.gaming_stations
        WHERE id = ANY(requested_station_ids)
    LOOP
        INSERT INTO public.booking_stations (
            booking_id,
            station_id,
            station_name,
            room_id,
            price_per_hour
        ) VALUES (
            v_booking_id,
            v_st.id,
            v_st.name,
            v_st.room_id,
            v_st.price_per_hour
        );

        INSERT INTO public.booking_history (
            user_id,
            booking_id,
            station_id,
            station_name,
            hours,
            total_cost,
            status
        ) VALUES (
            v_user_id,
            v_booking_id,
            v_st.id,
            v_st.name,
            requested_duration,
            v_st.price_per_hour * requested_duration,
            'confirmed'
        );
    END LOOP;

    -- Return JSON payload
    RETURN jsonb_build_object(
        'id', v_booking_id,
        'booking_reference', v_booking_ref,
        'user_id', v_user_id,
        'station_id', v_first_station_id,
        'room_id', v_first_room_id,
        'start_time', requested_start,
        'end_time', requested_end,
        'duration_hours', requested_duration,
        'status', 'confirmed',
        'total_cost', v_total_cost,
        'payment_method', requested_payment_method,
        'payment_status', requested_payment_status
    );
END;
$$;
