import { supabase } from './supabase';
import { ARENA_ROOMS, RoomInfo, MenuItem, PCStation, PS5Station, PC_STATIONS, PS5_STATIONS, KITCHEN_MENU } from '../data/arenaData';

export interface DbBookingStation {
  id?: string;
  booking_id: string;
  station_id: string;
  station_name?: string;
  room_id?: string;
  price_per_hour?: number;
}

export interface DbBooking {
  id: string;
  booking_reference: string;
  user_id: string;
  station_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'refunded';
  total_cost: number;
  payment_method: 'pay_online' | 'cash_or_arena' | 'scrap' | 'qr';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  created_at: string;
  booking_stations?: DbBookingStation[];
}

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string;
  booking_id?: string;
  station_id: string;
  room_id: string;
  delivery_location: string;
  total_amount: number;
  payment_method: 'pay_online' | 'scrap' | 'session_bill';
  payment_status: 'pending' | 'paid' | 'added_to_bill' | 'refunded';
  status: 'pending' | 'preparing' | 'delivered' | 'PLACED' | 'CONFIRMED' | 'READY' | 'OUT_FOR_DELIVERY' | 'CANCELLED' | string;
  created_at: string;
  order_items?: {
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}

// 1. SEEDING / INITIAL SETUP
export const ensureDatabaseSeeded = async () => {
  try {
    const { count, error } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
    if (error || count === 0) {
      for (const room of ARENA_ROOMS) {
        await supabase.from('rooms').upsert({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          type: room.type,
          description: room.description,
        });
      }

      for (const [roomId, pcs] of Object.entries(PC_STATIONS)) {
        for (const pc of pcs) {
          await supabase.from('gaming_stations').upsert({
            id: pc.id,
            room_id: roomId,
            name: pc.id,
            status: 'Available',
            gpu: pc.gpu,
            cpu: pc.cpu,
            monitor: pc.monitor,
            price_per_hour: pc.hourlyRate || 150,
          });
        }
      }

      for (const ps5 of PS5_STATIONS) {
        await supabase.from('gaming_stations').upsert({
          id: ps5.id,
          room_id: 'lounge',
          name: ps5.id,
          status: 'Available',
          monitor: ps5.display,
          price_per_hour: ps5.pricePerHour || 180,
        });
      }

      for (const food of KITCHEN_MENU) {
        await supabase.from('food_items').upsert({
          id: food.id,
          name: food.name,
          category: food.category,
          description: food.description,
          price: food.price,
          available: true,
        });
      }
    }
  } catch (err) {
    console.warn('DB seed check warning:', err);
  }
};

// 2. ROOMS
export const getRoomsFromDb = async (): Promise<RoomInfo[]> => {
  try {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error || !data || data.length === 0) return ARENA_ROOMS;

    return ARENA_ROOMS.map(r => {
      const dbRoom = data.find((d: any) => d.id === r.id);
      if (dbRoom) {
        return {
          ...r,
          name: dbRoom.name || r.name,
          capacity: dbRoom.capacity || r.capacity,
          description: dbRoom.description || r.description,
        };
      }
      return r;
    });
  } catch {
    return ARENA_ROOMS;
  }
};

// 3. GAMING STATIONS
export const getGamingStationsFromDb = async (roomId: string): Promise<(PCStation | PS5Station)[]> => {
  try {
    const { data, error } = await supabase
      .from('gaming_stations')
      .select('*')
      .eq('room_id', roomId)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (roomId === 'lounge') return PS5_STATIONS;
      return PC_STATIONS[roomId] || [];
    }

    if (roomId === 'lounge') {
      return data.map((st: any) => ({
        id: st.id,
        name: st.name || st.id,
        display: st.monitor || '65" 4K 120Hz OLED Display',
        seating: 'Luxury Gaming Sofa',
        games: ['FC 24', 'Spider-Man 2', 'Tekken 8', 'God of War Ragnarok', 'Mortal Kombat 1'],
        status: st.status as 'Available' | 'Occupied' | 'Reserved',
        pricePerHour: Number(st.price_per_hour) || 180,
        hourlyRate: Number(st.price_per_hour) || 180,
      }));
    }

    return data.map((st: any) => ({
      id: st.id,
      name: st.name || st.id,
      room: roomId as any,
      status: st.status as 'Available' | 'Occupied' | 'Reserved',
      gpu: st.gpu,
      cpu: st.cpu,
      monitor: `${st.refresh_rate || '240Hz'} ${st.resolution || '1440p'} (${st.monitor || 'Display'})`,
      peripherals: st.peripherals || 'Gaming Mouse & Keyboard',
      pricePerHour: Number(st.price_per_hour) || 150,
      hourlyRate: Number(st.price_per_hour) || 150,
    }));
  } catch {
    return PC_STATIONS[roomId] || (roomId === 'lounge' ? PS5_STATIONS : []);
  }
};

export interface StationOccupancyInfo {
  stationId: string;
  endTimeIso: string;
  endTimeFormatted: string;
  bookingRef?: string;
}

/**
 * Helper to get local date string YYYY-MM-DD reliably.
 */
export const getLocalDateString = (d = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isStationOccupied = (item: any): boolean => {
  if (typeof item.available === 'boolean') {
    return !item.available;
  }
  if (typeof item.unavailable === 'boolean') {
    return item.unavailable;
  }
  if (typeof item.is_available === 'boolean') {
    return !item.is_available;
  }
  return false;
};

const getStationIdFromRow = (item: any): string => {
  return item.station_id || item.id || item.station_code || '';
};

/**
 * Real-Time Floor Map Availability:
 * Fetches station_ids that are active right now (NOW()).
 * Calls public.get_current_station_availability() with NO parameters.
 * Returns the station_id values from the RPC result.
 */
export const getCurrentActiveBookedStationIds = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_current_station_availability');

    if (error) {
      console.warn('RPC error fetching current station availability:', error.message || error);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data
      .map((item: { station_id: string }) => item.station_id || (item as any).id)
      .filter((id: string): id is string => Boolean(id));
  } catch (err) {
    console.warn('Error fetching current active station IDs via RPC:', err);
    return [];
  }
};

/**
 * Booking Interval Availability:
 * Checks if requested station IDs overlap any existing booking for the requested interval [startTimeIso, endTimeIso].
 * Overlap formula: existing.start_time < requested_end_time AND existing.end_time > requested_start_time.
 */
export const checkAllStationsAvailableInDb = async (
  stationIds: string[],
  startTimeIso: string,
  endTimeIso: string
): Promise<{ available: boolean; unavailableStationIds: string[]; error?: string }> => {
  if (!stationIds || stationIds.length === 0) {
    return { available: true, unavailableStationIds: [] };
  }

  // Current time validation: reject if requested start time is in the past
  const nowMs = Date.now();
  const reqStartMs = new Date(startTimeIso).getTime();
  if (reqStartMs < nowMs - 60000) {
    return {
      available: false,
      unavailableStationIds: stationIds,
      error: 'Requested start time is in the past. Please select a current or future time slot.',
    };
  }

  try {
    const { data, error } = await supabase.rpc('check_station_availability', {
      p_station_ids: stationIds,
      p_start_time: startTimeIso,
      p_end_time: endTimeIso,
    });

    // Fail safe: if RPC fails, return explicit error state and treat requested stations as unavailable
    if (error || !data) {
      console.error('Supabase RPC error checking station availability:', error);
      return {
        available: false,
        unavailableStationIds: stationIds,
        error: 'Unable to verify live station availability. Please refresh and try again.',
      };
    }

    const unavailableStationIds: string[] = [];
    for (const item of data) {
      if (isStationOccupied(item)) {
        const id = getStationIdFromRow(item);
        if (id) unavailableStationIds.push(id);
      }
    }

    return {
      available: unavailableStationIds.length === 0,
      unavailableStationIds,
    };
  } catch (err: any) {
    console.error('Exception checking station availability:', err);
    return {
      available: false,
      unavailableStationIds: stationIds,
      error: 'Unable to verify live station availability. Please refresh and try again.',
    };
  }
};

/**
 * Legacy compatibility wrapper for single-conflict lookup.
 */
export const checkStationsOverlapInDb = async (
  stationIds: string[],
  startTimeIso: string,
  endTimeIso: string
): Promise<{ available: boolean; conflictingStationId?: string; error?: string }> => {
  const res = await checkAllStationsAvailableInDb(stationIds, startTimeIso, endTimeIso);
  return {
    available: res.available,
    conflictingStationId: res.unavailableStationIds[0],
    error: res.error,
  };
};

/**
 * Fetches map of station_id => StationOccupancyInfo for all stations having an overlapping
 * booking in the slot [startTimeIso, endTimeIso].
 */
export const getBookedStationInfoForSlot = async (
  startTimeIso: string,
  endTimeIso: string
): Promise<Record<string, StationOccupancyInfo>> => {
  try {
    const { data: activeBookings, error } = await supabase
      .from('bookings')
      .select('id, station_id, end_time, booking_reference')
      .in('status', ['confirmed', 'active', 'pending'])
      .lt('start_time', endTimeIso)
      .gt('end_time', startTimeIso);

    if (error || !activeBookings) return {};

    const map: Record<string, StationOccupancyInfo> = {};

    for (const b of activeBookings) {
      const endTimeFormatted = new Date(b.end_time).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      if (b.station_id) {
        map[b.station_id] = {
          stationId: b.station_id,
          endTimeIso: b.end_time,
          endTimeFormatted,
          bookingRef: b.booking_reference,
        };
      }
    }

    const nullStationBookingIds = activeBookings.filter(b => !b.station_id).map(b => b.id);
    if (nullStationBookingIds.length > 0) {
      const { data: bsData } = await supabase
        .from('booking_stations')
        .select('booking_id, station_id')
        .in('booking_id', nullStationBookingIds);

      if (bsData) {
        for (const bs of bsData) {
          const parent = activeBookings.find(b => b.id === bs.booking_id);
          if (parent && bs.station_id) {
            const endTimeFormatted = new Date(parent.end_time).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            map[bs.station_id] = {
              stationId: bs.station_id,
              endTimeIso: parent.end_time,
              endTimeFormatted,
              bookingRef: parent.booking_reference,
            };
          }
        }
      }
    }

    return map;
  } catch (err) {
    console.warn('Error fetching booked stations info:', err);
    return {};
  }
};

/**
 * Fetches all station_ids that have an overlapping active/confirmed booking in Supabase for the given slot.
 */
export const getBookedStationIdsForSlot = async (
  startTimeIso: string,
  endTimeIso: string
): Promise<string[]> => {
  const infoMap = await getBookedStationInfoForSlot(startTimeIso, endTimeIso);
  return Object.keys(infoMap);
};

/**
 * Safely extracts the base booking reference for multi-station grouping.
 * Single station reference: ARENA-54321 -> returns ARENA-54321
 * Multi-station reference: ARENA-54321-1 -> returns ARENA-54321
 */
export const getBaseBookingRef = (ref?: string | null): string => {
  if (!ref) return '';
  const multiStationMatch = ref.match(/^(.+-\d+)-\d+$/);
  if (multiStationMatch) {
    return multiStationMatch[1];
  }
  return ref;
};

// 4. BOOKINGS
export const getUserBookingsFromDb = async (userId: string): Promise<DbBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
    if (!data || data.length === 0) return [];

    // Group rows by booking_reference (or by row ID if no reference)
    const groupedMap = new Map<string, DbBooking>();

    for (const b of data) {
      const baseRefKey = b.booking_reference ? getBaseBookingRef(b.booking_reference) : b.id;
      const refKey = baseRefKey;
      const stationItem: DbBookingStation = {
        id: b.id,
        booking_id: b.id,
        station_id: b.station_id,
        station_name: b.station_id,
        room_id: b.room_id,
        price_per_hour: b.total_cost && b.duration_hours ? Number(b.total_cost) / Number(b.duration_hours) : 150,
      };

      if (!groupedMap.has(refKey)) {
        groupedMap.set(refKey, {
          id: b.id,
          booking_reference: baseRefKey,
          user_id: b.user_id,
          station_id: b.station_id,
          room_id: b.room_id,
          start_time: b.start_time,
          end_time: b.end_time,
          duration_hours: Number(b.duration_hours) || 1,
          status: b.status,
          total_cost: Number(b.total_cost) || 0,
          payment_method: b.payment_method,
          payment_status: b.payment_status,
          created_at: b.created_at,
          booking_stations: [stationItem],
        });
      } else {
        const existing = groupedMap.get(refKey)!;
        existing.total_cost += Number(b.total_cost) || 0;
        if (!existing.booking_stations?.some(s => s.station_id === b.station_id)) {
          existing.booking_stations?.push(stationItem);
        }
      }
    }

    return Array.from(groupedMap.values());
  } catch (err) {
    console.error('Exception fetching user bookings:', err);
    return [];
  }
};

/**
 * Atomic Multi-Station Booking Creation:
 * Guarantees that EVERY station has its station_id preserved and saved in Supabase bookings table.
 */
export const createMultiStationBookingInDb = async (
  userId: string,
  stations: { id: string; name: string; roomId: string; pricePerHour: number }[],
  startTime: Date,
  endTime: Date,
  durationHours: number,
  totalCost: number,
  paymentMethod: 'pay_online' | 'cash_or_arena' | 'scrap' | 'qr',
  paymentStatus: 'pending' | 'paid' = 'pending'
): Promise<{ success: boolean; booking?: DbBooking; error?: string }> => {
  try {
    // 1. Strict validation of requested stations
    if (!stations || stations.length === 0) {
      return { success: false, error: 'No stations selected for booking.' };
    }

    const invalidStation = stations.find(s => !s || !s.id || typeof s.id !== 'string' || !s.id.trim());
    if (invalidStation) {
      return {
        success: false,
        error: 'Selected station is missing a valid station ID. Please re-select the station.',
      };
    }

    const stationIds = stations.map(s => s.id);
    const startIso = startTime.toISOString();
    const endIso = endTime.toISOString();

    // Validate start time is not in the past
    const nowMs = Date.now();
    if (startTime.getTime() < nowMs - 60000) {
      return {
        success: false,
        error: 'Booking rejected: Cannot create a booking for a start time in the past. Please select a current or future time slot.',
      };
    }

    // 2. Double check availability before direct insertion
    const checkRes = await checkAllStationsAvailableInDb(stationIds, startIso, endIso);
    if (!checkRes.available) {
      if (checkRes.error) {
        return { success: false, error: checkRes.error };
      }
      return {
        success: false,
        error: `Booking rejected: Station(s) [${checkRes.unavailableStationIds.join(', ')}] are no longer available for the selected time slot.`,
      };
    }

    // 3. Client-side multi-insert transaction
    const baseBookingRef = `ARENA-${Math.floor(10000 + Math.random() * 90000)}`;

    const rowsToInsert = stations.map((s, idx) => ({
      booking_reference: stations.length > 1 ? `${baseBookingRef}-${idx + 1}` : baseBookingRef,
      user_id: userId,
      station_id: s.id,
      room_id: s.roomId,
      start_time: startIso,
      end_time: endIso,
      duration_hours: durationHours,
      status: 'confirmed',
      total_cost: s.pricePerHour * durationHours,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    }));

    const { data: insertedRows, error: insertErr } = await supabase
      .from('bookings')
      .insert(rowsToInsert)
      .select();

    if (insertErr || !insertedRows || insertedRows.length === 0) {
      console.error('Booking insertion error in Supabase:', insertErr);
      let userMsg = insertErr?.message || 'Unable to save booking to Supabase. Please try again.';
      if (
        insertErr?.code === '23P01' ||
        insertErr?.code === '23505' ||
        insertErr?.message?.toLowerCase().includes('bookings_no_overlap') ||
        insertErr?.message?.toLowerCase().includes('overlap') ||
        insertErr?.message?.toLowerCase().includes('exclusion')
      ) {
        userMsg = 'This station was just booked by another user. Please select another station or time.';
      }
      return {
        success: false,
        error: userMsg,
      };
    }

    const createdStations: DbBookingStation[] = stations.map((s, idx) => ({
      id: insertedRows[idx]?.id || insertedRows[0].id,
      booking_id: insertedRows[idx]?.id || insertedRows[0].id,
      station_id: s.id,
      station_name: s.name,
      room_id: s.roomId,
      price_per_hour: s.pricePerHour,
    }));

    const fullBooking: DbBooking = {
      id: insertedRows[0].id,
      booking_reference: baseBookingRef,
      user_id: userId,
      station_id: stations[0].id,
      room_id: stations[0].roomId,
      start_time: startIso,
      end_time: endIso,
      duration_hours: durationHours,
      status: 'confirmed',
      total_cost: totalCost,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      created_at: insertedRows[0].created_at || new Date().toISOString(),
      booking_stations: createdStations,
    };

    return { success: true, booking: fullBooking };
  } catch (err: any) {
    console.error('Exception creating multi-station booking:', err);
    return { success: false, error: err.message || 'Unable to complete booking. Please try again.' };
  }
};

export const cancelBookingInDb = async (
  bookingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: bookingRow } = await supabase
      .from('bookings')
      .select('booking_reference, user_id')
      .eq('id', bookingId)
      .single();

    if (bookingRow?.booking_reference) {
      const baseRef = getBaseBookingRef(bookingRow.booking_reference);
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .or(`booking_reference.eq.${bookingRow.booking_reference},booking_reference.eq.${baseRef},booking_reference.like.${baseRef}-%`);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// 5. FOOD & DRINK ITEMS
export const getFoodItemsFromDb = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase.from('food_items').select('*').eq('available', true);
    if (error || !data || data.length === 0) {
      return KITCHEN_MENU;
    }
    return data.map((item: any) => {
      const fallback = KITCHEN_MENU.find(k => k.id === item.id);
      return {
        id: item.id,
        name: item.name,
        category: item.category as any,
        description: item.description || '',
        price: Number(item.price),
        isVeg: fallback ? fallback.isVeg : true,
      };
    });
  } catch {
    return KITCHEN_MENU;
  }
};

// 6. SCRAP BALANCE DEDUCTION & COUPONS
import { Coupon, ScrapReward } from '../data/arenaData';

export const getUserCouponsFromDb = async (userId: string): Promise<Coupon[]> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as Coupon[];
    }
  } catch (err) {
    console.warn('Error fetching coupons table, checking user metadata fallback:', err);
  }

  // Fallback to auth user metadata if table missing or unmigrated
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.user_metadata?.coupons) {
      return user.user_metadata.coupons as Coupon[];
    }
  } catch (e) {
    console.warn('Error checking user metadata coupons:', e);
  }

  return [];
};

export const createCouponInDb = async (
  userId: string,
  reward: ScrapReward
): Promise<{ success: boolean; coupon?: Coupon; error?: string }> => {
  try {
    // 1. Deduct SCRAP
    const scrapRes = await deductScrapBalanceInDb(userId, reward.scrapCost);
    if (!scrapRes.success) {
      return { success: false, error: scrapRes.error };
    }

    // 2. Generate unique code: ARENA-TYPE-RANDOM4
    const prefix = reward.rewardType.toUpperCase();
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const couponCode = `ARENA-${prefix}-${randomCode}`;

    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days valid

    const newCoupon: Omit<Coupon, 'id'> = {
      user_id: userId,
      coupon_code: couponCode,
      reward_type: reward.rewardType,
      reward_title: reward.rewardTitle,
      reward_value: reward.rewardValue,
      status: 'UNUSED',
      created_at: now.toISOString(),
      expires_at: expiryDate.toISOString(),
    };

    // Attempt insert into coupons table
    const { data: inserted, error: insertErr } = await supabase
      .from('coupons')
      .insert(newCoupon)
      .select()
      .single();

    if (!insertErr && inserted) {
      return { success: true, coupon: inserted as Coupon };
    }

    // Fallback if table does not exist
    const fullCoupon: Coupon = {
      ...newCoupon,
      id: `coupon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    const existingCoupons = await getUserCouponsFromDb(userId);
    const updatedCoupons = [fullCoupon, ...existingCoupons];

    await supabase.auth.updateUser({
      data: { coupons: updatedCoupons },
    });

    return { success: true, coupon: fullCoupon };
  } catch (err: any) {
    console.error('Exception creating coupon:', err);
    return { success: false, error: err.message || 'Failed to create coupon.' };
  }
};

export const markCouponUsedInDb = async (
  userId: string,
  couponId: string,
  bookingId?: string,
  orderId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('coupons')
      .update({
        status: 'USED',
        used_at: new Date().toISOString(),
        booking_id: bookingId || null,
        order_id: orderId || null,
      })
      .eq('id', couponId)
      .eq('user_id', userId);

    if (!error) return { success: true };
  } catch (e) {
    console.warn('Error updating coupons table, trying user metadata:', e);
  }

  // Fallback update in user_metadata
  try {
    const existing = await getUserCouponsFromDb(userId);
    const updated = existing.map(c =>
      c.id === couponId || c.coupon_code === couponId
        ? { ...c, status: 'USED' as const, used_at: new Date().toISOString() }
        : c
    );
    await supabase.auth.updateUser({
      data: { coupons: updated },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const deductScrapBalanceInDb = async (
  userId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('scrap_balance')
      .eq('id', userId)
      .single();

    if (profErr || !profile) {
      return { success: false, error: 'User profile not found.' };
    }

    const currentBalance = Number(profile.scrap_balance) || 0;
    if (currentBalance < amount) {
      return { success: false, error: `Insufficient SCRAP balance. You have SCRAP ${currentBalance}, but need SCRAP ${amount}.` };
    }

    const newBalance = currentBalance - amount;
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ scrap_balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// 7. FOOD ORDERS
export const getUserOrdersFromDb = async (userId: string): Promise<DbOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((order: any) => ({
      ...order,
      order_items: (order.order_items || []).map((item: any) => {
        const menuItem = KITCHEN_MENU.find(m => m.id === item.food_item_id);
        return {
          ...item,
          item_name: item.item_name || menuItem?.name || 'Food Item',
        };
      }),
    })) as DbOrder[];
  } catch {
    return [];
  }
};

export const createFoodOrderForSessionInDb = async (
  userId: string,
  bookingId: string,
  stationId: string,
  roomId: string,
  cart: { item: MenuItem; quantity: number }[],
  paymentMethod: 'pay_online' | 'scrap' | 'session_bill',
  discountedTotalAmount?: number
): Promise<{ success: boolean; order?: DbOrder; error?: string }> => {
  try {
    if (!cart || cart.length === 0) {
      return { success: false, error: 'Food cart is empty.' };
    }
    if (!userId || !bookingId) {
      return { success: false, error: 'User ID or active booking session missing.' };
    }

    // 1. Find and verify active booking for current authenticated user
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bErr || !booking) {
      console.error('Supabase Active Booking Verification Error:', {
        message: bErr?.message,
        details: bErr?.details,
        hint: bErr?.hint,
        code: bErr?.code,
      });
      return { success: false, error: 'No active gaming session found.' };
    }

    const now = new Date();
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);

    if (
      booking.user_id !== userId ||
      startTime > now ||
      endTime <= now ||
      booking.status === 'cancelled'
    ) {
      return { success: false, error: 'No active gaming session.' };
    }

    // 2. Verify selected food items exist, are available, and have sufficient stock
    const itemIds = cart.map(c => c.item.id);
    const { data: foodRows, error: fErr } = await supabase
      .from('food_items')
      .select('*')
      .in('id', itemIds);

    if (fErr) {
      console.warn('Food items verification warning:', fErr);
    } else if (foodRows && foodRows.length > 0) {
      for (const cartItem of cart) {
        const dbItem = foodRows.find((f: any) => f.id === cartItem.item.id);
        if (dbItem) {
          if (dbItem.available === false) {
            return {
              success: false,
              error: `"${cartItem.item.name}" is currently unavailable.`,
            };
          }
          if (typeof dbItem.stock === 'number' && dbItem.stock < cartItem.quantity) {
            return {
              success: false,
              error: `Insufficient stock for "${cartItem.item.name}". Only ${dbItem.stock} available.`,
            };
          }
        }
      }
    }

    const cartSubtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
    const finalTotalAmount =
      typeof discountedTotalAmount === 'number'
        ? Math.max(0, discountedTotalAmount)
        : cartSubtotal;

    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const deliveryLoc = `${roomId.toUpperCase()} — Station ${stationId}`;
    const paymentStatus =
      paymentMethod === 'scrap' || paymentMethod === 'pay_online' ? 'paid' : 'added_to_bill';

    // 3. Create exactly ONE orders row
    const orderPayload: any = {
      order_number: orderNumber,
      user_id: userId,
      booking_id: bookingId,
      station_id: stationId,
      room_id: roomId,
      delivery_location: deliveryLoc,
      total_amount: finalTotalAmount,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      status: 'pending',
    };

    let { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    // Fallback if live DB lacks station_id or room_id columns
    if (
      orderErr &&
      (orderErr.code === 'PGRST204' ||
        orderErr.message?.includes('station_id') ||
        orderErr.message?.includes('room_id'))
    ) {
      console.warn('Retrying orders insert without missing optional columns station_id/room_id...');
      const fallbackPayload = { ...orderPayload };
      delete fallbackPayload.station_id;
      delete fallbackPayload.room_id;

      const retry = await supabase.from('orders').insert(fallbackPayload).select().single();
      order = retry.data;
      orderErr = retry.error;
    }

    if (orderErr || !order) {
      console.error('Supabase Food Order Error:', {
        message: orderErr?.message,
        details: orderErr?.details,
        hint: orderErr?.hint,
        code: orderErr?.code,
      });
      return {
        success: false,
        error: orderErr?.message || 'Failed to place food order in database.',
      };
    }

    // 4. Create order_items rows for each cart item
    const orderItemsToInsert = cart.map(c => ({
      order_id: order.id,
      food_item_id: c.item.id,
      item_name: c.item.name,
      quantity: c.quantity,
      unit_price: c.item.price,
      subtotal: c.item.price * c.quantity,
    }));

    let { error: itemsErr } = await supabase.from('order_items').insert(orderItemsToInsert);

    // Fallback if live DB lacks item_name column
    if (
      itemsErr &&
      (itemsErr.code === 'PGRST204' || itemsErr.message?.includes('item_name'))
    ) {
      console.warn('Retrying order_items insert without missing item_name column...');
      const sanitizedItems = orderItemsToInsert.map(({ item_name, ...rest }) => rest);
      const retry = await supabase.from('order_items').insert(sanitizedItems);
      itemsErr = retry.error;
    }

    if (itemsErr) {
      console.error('Supabase Order Items Error:', {
        message: itemsErr.message,
        details: itemsErr.details,
        hint: itemsErr.hint,
        code: itemsErr.code,
      });
      // Clean up parent order to ensure database consistency and prevent orphans
      await supabase.from('orders').delete().eq('id', order.id);
      return {
        success: false,
        error: itemsErr.message || 'Failed to insert order items.',
      };
    }

    // 5. Deduct stock in food_items table for each ordered item
    if (foodRows && foodRows.length > 0) {
      for (const cartItem of cart) {
        const dbItem = foodRows.find((f: any) => f.id === cartItem.item.id);
        if (dbItem && typeof dbItem.stock === 'number') {
          const updatedStock = Math.max(0, dbItem.stock - cartItem.quantity);
          await supabase
            .from('food_items')
            .update({
              stock: updatedStock,
              available: updatedStock > 0,
            })
            .eq('id', cartItem.item.id);
        }
      }
    }

    const createdItems = cart.map((c, idx) => ({
      id: `item-${idx}`,
      order_id: order.id,
      food_item_id: c.item.id,
      item_name: c.item.name,
      quantity: c.quantity,
      unit_price: c.item.price,
      subtotal: c.item.price * c.quantity,
    }));

    return {
      success: true,
      order: {
        ...order,
        station_id: stationId,
        room_id: roomId,
        order_items: createdItems,
      },
    };
  } catch (err: any) {
    console.error('Exception creating food order:', err);
    return {
      success: false,
      error: err?.message || 'Unable to place your order. Please try again.',
    };
  }
};

// 8. HELPDESK QUERIES
export const submitHelpdeskQueryInDb = async (
  userId: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('helpdesk_queries').insert({
      user_id: userId,
      subject,
      message,
      status: 'open',
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const getUserHelpdeskQueriesFromDb = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('helpdesk_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

// 9. FEEDBACK
export const submitFeedbackInDb = async (
  userId: string,
  rating: number,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      rating,
      message,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
