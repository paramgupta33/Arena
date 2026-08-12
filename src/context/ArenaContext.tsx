import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARENA_ROOMS, RoomInfo, MenuItem, PCStation, PS5Station, Coupon, ScrapReward } from '../data/arenaData';
import { ExitConfirmationModal } from '../components/ExitConfirmationModal';
import {
  getRoomsFromDb,
  ensureDatabaseSeeded,
  getGamingStationsFromDb,
  getFoodItemsFromDb,
  getUserBookingsFromDb,
  createMultiStationBookingInDb,
  cancelBookingInDb,
  deductScrapBalanceInDb,
  getUserOrdersFromDb,
  createFoodOrderForSessionInDb,
  submitHelpdeskQueryInDb,
  getUserHelpdeskQueriesFromDb,
  submitFeedbackInDb,
  getUserCouponsFromDb,
  createCouponInDb,
  markCouponUsedInDb,
  DbBooking,
  DbOrder,
  checkStationsOverlapInDb,
  getBookedStationIdsForSlot,
  getCurrentActiveBookedStationIds,
  getLocalDateString,
} from '../lib/arenaService';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface SelectedStationCartItem {
  id: string;
  name: string;
  roomId: string;
  pricePerHour: number;
  gpu?: string;
  cpu?: string;
  monitor?: string;
}

export interface UserEnquiry {
  id: string;
  type: string;
  subject: string;
  message: string;
  timestamp: string;
}

interface ArenaContextType {
  rooms: RoomInfo[];
  selectedRoom: RoomInfo | null;
  hoveredRoomId: string | null;
  mapMode: '3d' | '2d';
  cart: CartItem[];
  enquiries: UserEnquiry[];
  menuItems: MenuItem[];
  showExitModal: boolean;
  showScrapModal: boolean;
  showProfileModal: boolean;
  userBookings: DbBooking[];
  activeSession: DbBooking | null;
  userOrders: DbOrder[];
  userCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  
  // Booking Slot State
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // HH:mm
  durationHours: number;
  bookingCartStations: SelectedStationCartItem[];

  setShowExitModal: (show: boolean) => void;
  setShowScrapModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  selectRoom: (roomId: string | null) => void;
  setHoveredRoomId: (roomId: string | null) => void;
  setMapMode: (mode: '3d' | '2d') => void;
  
  // Food Cart Methods
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  // Station Booking Cart Methods
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setDurationHours: (hrs: number) => void;
  addStationToBookingCart: (station: SelectedStationCartItem) => void;
  removeStationFromBookingCart: (stationId: string) => void;
  clearBookingCart: () => void;
  
  // DB Async Operations
  fetchStationsForRoom: (roomId: string) => Promise<(PCStation | PS5Station)[]>;
  confirmBooking: (
    paymentMethod: 'pay_online' | 'cash_or_arena' | 'scrap' | 'qr',
    paymentStatus?: 'pending' | 'paid',
    couponIdToUse?: string
  ) => Promise<{ success: boolean; booking?: DbBooking; error?: string }>;
  cancelUserBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Food Order for Active Session
  placeSessionFoodOrder: (
    paymentMethod: 'pay_online' | 'scrap' | 'session_bill',
    couponIdToUse?: string
  ) => Promise<{ success: boolean; order?: DbOrder; error?: string }>;
  
  // SCRAP & Coupons
  redeemScrapReward: (reward: ScrapReward) => Promise<{ success: boolean; coupon?: Coupon; error?: string }>;
  refreshUserCoupons: () => Promise<void>;
  
  refreshUserBookings: () => Promise<void>;
  refreshUserOrders: () => Promise<void>;
  updateRealTimeRoomAvailability: () => Promise<void>;
  
  submitEnquiry: (enquiry: Omit<UserEnquiry, 'id' | 'timestamp'>) => Promise<void>;
  updateEnquiry: (id: string, updated: Omit<UserEnquiry, 'id' | 'timestamp'>) => void;
  deleteEnquiry: (id: string) => void;
  sendFeedback: (rating: number, message: string) => Promise<boolean>;
  getRoomById: (id: string) => RoomInfo | undefined;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [rooms, setRooms] = useState<RoomInfo[]>(ARENA_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('sphere1');
  const [hoveredRoomId, setHoveredRoomIdState] = useState<string | null>(null);
  const [mapMode, setMapModeState] = useState<'3d' | '2d'>('3d');
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // User Bookings & Food Orders state from Supabase
  const [userBookings, setUserBookings] = useState<DbBooking[]>([]);
  const [userOrders, setUserOrders] = useState<DbOrder[]>([]);
  const [activeSession, setActiveSession] = useState<DbBooking | null>(null);

  // Coupons & Modals state
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showScrapModal, setShowScrapModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Station Booking Selection Slot State
  const todayStr = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('16:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [bookingCartStations, setBookingCartStations] = useState<SelectedStationCartItem[]>([]);

  // Automatically adjust selectedTime if current selected slot has passed today
  useEffect(() => {
    const isToday = selectedDate === getLocalDateString();
    if (isToday) {
      const timeOptions = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      const currentStart = new Date(`${selectedDate}T${selectedTime}:00`).getTime();
      if (currentStart < Date.now() - 60000) {
        const validNext = timeOptions.find(t => new Date(`${selectedDate}T${t}:00`).getTime() >= Date.now() - 60000);
        if (validNext) {
          setSelectedTime(validNext);
        }
      }
    }
  }, [selectedDate, selectedTime]);

  // Kitchen Food & Drink Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Reception Enquiries
  const [enquiries, setEnquiries] = useState<UserEnquiry[]>([
    {
      id: 'ENQ-01',
      type: 'Booking Issue',
      subject: 'PC-03 session time extension',
      message: 'Can I extend my PC-03 booking by 2 hours?',
      timestamp: '10:15 AM',
    },
  ]);

  // Compute Active Session based on stored start_time and end_time
  const computeActiveSession = useCallback((bookingsList: DbBooking[]) => {
    const now = new Date();
    const active = bookingsList.find(b => {
      if (b.status === 'cancelled') return false;
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return (
        now >= start &&
        now < end &&
        (b.status === 'confirmed' || b.status === 'active' || b.status === 'pending')
      );
    });
    setActiveSession(active || null);
  }, []);

  const refreshUserBookings = useCallback(async () => {
    if (!user) {
      setUserBookings([]);
      setActiveSession(null);
      return;
    }
    const dbBookings = await getUserBookingsFromDb(user.id);
    setUserBookings(dbBookings);
    computeActiveSession(dbBookings);
  }, [user, computeActiveSession]);

  const refreshUserOrders = useCallback(async () => {
    if (!user) {
      setUserOrders([]);
      return;
    }
    const dbOrders = await getUserOrdersFromDb(user.id);
    setUserOrders(dbOrders);
  }, [user]);

  const refreshUserCoupons = useCallback(async () => {
    if (!user) {
      setUserCoupons([]);
      return;
    }
    const dbCoupons = await getUserCouponsFromDb(user.id);
    setUserCoupons(dbCoupons);
  }, [user]);

  const redeemScrapReward = async (reward: ScrapReward) => {
    if (!user) {
      return { success: false, error: 'User must be signed in to redeem rewards.' };
    }
    const res = await createCouponInDb(user.id, reward);
    if (res.success) {
      await refreshProfile();
      await refreshUserCoupons();
    }
    return res;
  };

  // Load Rooms, Menu, Bookings, Orders and Enquiries on mount / user change
  useEffect(() => {
    async function loadDbData() {
      await ensureDatabaseSeeded();

      const dbRooms = await getRoomsFromDb();
      setRooms(dbRooms);

      const dbMenu = await getFoodItemsFromDb();
      setMenuItems(dbMenu);

      if (user) {
        await refreshUserBookings();
        await refreshUserOrders();
        await refreshUserCoupons();

        const dbQueries = await getUserHelpdeskQueriesFromDb(user.id);
        if (dbQueries && dbQueries.length > 0) {
          const mapped: UserEnquiry[] = dbQueries.map((q: any, idx: number) => ({
            id: q.id || `ENQ-0${idx + 1}`,
            type: 'General Query',
            subject: q.subject,
            message: q.message,
            timestamp: new Date(q.created_at || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setEnquiries(mapped);
        }
      } else {
        setUserBookings([]);
        setUserOrders([]);
        setActiveSession(null);
      }
    }
    loadDbData();
  }, [user, refreshUserBookings, refreshUserOrders]);

  // Synchronize room availability summaries on Floor Map with CURRENT REAL-TIME active bookings
  const updateRealTimeRoomAvailability = useCallback(async () => {
    try {
      const activeStationIds = await getCurrentActiveBookedStationIds();
      if (!activeStationIds || !Array.isArray(activeStationIds)) return;

      const roomCapacities: Record<string, number> = {
        sphere1: 10,
        sphere2: 10,
        elite: 6,
        lounge: 6,
      };

      setRooms(prevRooms =>
        prevRooms.map(r => {
          if (r.id === 'reception' || r.id === 'kitchen' || r.id === 'entry') return r;
          const total = roomCapacities[r.id] || 10;

          let roomPrefixes: string[] = [];
          if (r.id === 'sphere1') roomPrefixes = Array.from({ length: 10 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);
          else if (r.id === 'sphere2') roomPrefixes = Array.from({ length: 10 }, (_, i) => `PC-${i + 11}`);
          else if (r.id === 'elite') roomPrefixes = Array.from({ length: 6 }, (_, i) => `VIP-PC-${String(i + 1).padStart(2, '0')}`);
          else if (r.id === 'lounge') roomPrefixes = Array.from({ length: 6 }, (_, i) => `PS5-${String(i + 1).padStart(2, '0')}`);

          const bookedInRoomCount = roomPrefixes.filter(id => activeStationIds.includes(id)).length;
          const availableCount = Math.max(0, total - bookedInRoomCount);

          return {
            ...r,
            summary: `${availableCount} / ${total} AVAILABLE`,
          };
        })
      );
    } catch (e) {
      console.warn('Error updating real-time room availability:', e);
    }
  }, []);

  // Refresh real-time room availability on mount, when bookings change, and every 5 seconds
  useEffect(() => {
    updateRealTimeRoomAvailability();
    const interval = setInterval(() => {
      updateRealTimeRoomAvailability();
    }, 5000);
    return () => clearInterval(interval);
  }, [updateRealTimeRoomAvailability, userBookings]);

  // Periodic timer check for active session status updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (userBookings.length > 0) {
        computeActiveSession(userBookings);
      }
    }, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userBookings, computeActiveSession]);

  const selectRoom = (roomId: string | null) => {
    setSelectedRoomId(roomId);
  };

  const setHoveredRoomId = (roomId: string | null) => {
    setHoveredRoomIdState(roomId);
  };

  const setMapMode = (mode: '3d' | '2d') => {
    setMapModeState(mode);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Station Booking Cart Methods
  const addStationToBookingCart = (station: SelectedStationCartItem) => {
    setBookingCartStations(prev => {
      if (prev.some(s => s.id === station.id)) return prev;
      return [...prev, station];
    });
  };

  const removeStationFromBookingCart = (stationId: string) => {
    setBookingCartStations(prev => prev.filter(s => s.id !== stationId));
  };

  const clearBookingCart = () => {
    setBookingCartStations([]);
  };

  const fetchStationsForRoom = async (roomId: string) => {
    return await getGamingStationsFromDb(roomId);
  };

  const confirmBooking = async (
    paymentMethod: 'pay_online' | 'cash_or_arena' | 'scrap' | 'qr',
    paymentStatus: 'pending' | 'paid' = 'pending',
    couponIdToUse?: string
  ) => {
    if (bookingCartStations.length === 0) {
      return { success: false, error: 'No stations selected in booking cart.' };
    }
    const userId = user?.id || 'guest-user';

    // Build Date & Time objects
    const [hoursStr, minsStr] = selectedTime.split(':');
    const startTime = new Date(`${selectedDate}T${hoursStr.padStart(2, '0')}:${minsStr.padStart(2, '0')}:00`);
    const endTime = new Date(startTime.getTime() + durationHours * 3600 * 1000);

    const totalHourlyRate = bookingCartStations.reduce((sum, s) => sum + s.pricePerHour, 0);
    let totalCost = totalHourlyRate * durationHours;

    // Apply Coupon discount if present
    const couponToApply = userCoupons.find(c => c.id === couponIdToUse || c.coupon_code === couponIdToUse) || appliedCoupon;
    if (couponToApply && couponToApply.status === 'UNUSED') {
      const discount = Number(couponToApply.reward_value) || 0;
      totalCost = Math.max(0, totalCost - discount);
    }

    // Handle SCRAP Payment deduction
    if (paymentMethod === 'scrap') {
      const scrapRes = await deductScrapBalanceInDb(userId, totalCost);
      if (!scrapRes.success) {
        return { success: false, error: scrapRes.error || 'Insufficient SCRAP balance.' };
      }
      paymentStatus = 'paid';
      await refreshProfile();
    }

    const result = await createMultiStationBookingInDb(
      userId,
      bookingCartStations,
      startTime,
      endTime,
      durationHours,
      totalCost,
      paymentMethod,
      paymentStatus
    );

    if (result.success) {
      if (couponToApply && couponToApply.status === 'UNUSED' && result.booking?.id) {
        await markCouponUsedInDb(userId, couponToApply.id, result.booking.id);
        setAppliedCoupon(null);
        await refreshUserCoupons();
      }
      clearBookingCart();
      await refreshUserBookings();
      await updateRealTimeRoomAvailability();
    }

    return result;
  };

  const cancelUserBooking = async (bookingId: string) => {
    const res = await cancelBookingInDb(bookingId);
    if (res.success) {
      await refreshUserBookings();
      await updateRealTimeRoomAvailability();
    }
    return res;
  };

  // Place Food Order ONLY for Active Session
  const placeSessionFoodOrder = async (
    paymentMethod: 'pay_online' | 'scrap' | 'session_bill',
    couponIdToUse?: string
  ) => {
    if (!activeSession) {
      return {
        success: false,
        error: 'No active gaming session.',
      };
    }

    const now = new Date();
    const startTime = new Date(activeSession.start_time);
    const endTime = new Date(activeSession.end_time);
    const isSessionActive =
      startTime <= now &&
      endTime > now &&
      ['pending', 'confirmed', 'active'].includes(activeSession.status) &&
      (!user || activeSession.user_id === user.id);

    if (!isSessionActive) {
      return {
        success: false,
        error: 'No active gaming session.',
      };
    }

    if (cart.length === 0) {
      return { success: false, error: 'Your food cart is empty.' };
    }

    const userId = user?.id || activeSession.user_id;
    const firstStation = activeSession.booking_stations?.[0];
    const stationId = firstStation?.station_id || activeSession.station_id || 'PC-01';
    const roomId = firstStation?.room_id || activeSession.room_id || 'sphere1';

    let totalAmount = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    // Food Coupon check
    const foodCoupon = userCoupons.find(
      c =>
        (c.id === couponIdToUse || c.coupon_code === couponIdToUse) &&
        c.reward_type === 'food' &&
        c.status === 'UNUSED'
    );
    if (foodCoupon) {
      const discount = Number(foodCoupon.reward_value) || 0;
      totalAmount = Math.max(0, totalAmount - discount);
    }

    // Pre-check SCRAP balance if payment method is SCRAP
    if (paymentMethod === 'scrap') {
      const currentScrap = profile?.scrap_balance || 0;
      if (currentScrap < totalAmount) {
        return { success: false, error: 'Insufficient SCRAP balance for food.' };
      }
    }

    // 1. Create order in database first
    const res = await createFoodOrderForSessionInDb(
      userId,
      activeSession.id,
      stationId,
      roomId,
      cart,
      paymentMethod,
      totalAmount
    );

    if (res.success && res.order?.id) {
      // 2. Deduct SCRAP ONLY AFTER successful database order creation
      if (paymentMethod === 'scrap') {
        const scrapRes = await deductScrapBalanceInDb(userId, totalAmount);
        if (!scrapRes.success) {
          // Rollback order if SCRAP deduction fails
          await supabase.from('orders').delete().eq('id', res.order.id);
          return {
            success: false,
            error: scrapRes.error || 'Failed to deduct SCRAP balance.',
          };
        }
        await refreshProfile();
      }

      // 3. Mark coupon USED ONLY AFTER successful database order creation
      if (foodCoupon) {
        await markCouponUsedInDb(userId, foodCoupon.id, undefined, res.order.id);
        await refreshUserCoupons();
      }

      clearCart();
      await refreshUserOrders();
    }

    return res;
  };

  const submitEnquiry = async (enquiry: Omit<UserEnquiry, 'id' | 'timestamp'>) => {
    const userId = user?.id || 'guest-user';
    await submitHelpdeskQueryInDb(userId, enquiry.subject, enquiry.message);

    const newEnq: UserEnquiry = {
      ...enquiry,
      id: `ENQ-0${enquiries.length + 1}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setEnquiries(prev => [newEnq, ...prev]);
  };

  const updateEnquiry = (id: string, updated: Omit<UserEnquiry, 'id' | 'timestamp'>) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updated, timestamp: `${e.timestamp} (Updated)` } : e))
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const sendFeedback = async (rating: number, message: string) => {
    const userId = user?.id || 'guest-user';
    const res = await submitFeedbackInDb(userId, rating, message);
    return res.success;
  };

  const getRoomById = (id: string) => rooms.find(r => r.id === id);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;

  return (
    <ArenaContext.Provider
      value={{
        rooms,
        selectedRoom,
        hoveredRoomId,
        mapMode,
        cart,
        enquiries,
        menuItems,
        showExitModal,
        showScrapModal,
        showProfileModal,
        userBookings,
        activeSession,
        userOrders,
        userCoupons,
        appliedCoupon,
        selectedDate,
        selectedTime,
        durationHours,
        bookingCartStations,
        setShowExitModal,
        setShowScrapModal,
        setShowProfileModal,
        setAppliedCoupon,
        selectRoom,
        setHoveredRoomId,
        setMapMode,
        addToCart,
        removeFromCart,
        clearCart,
        setSelectedDate,
        setSelectedTime,
        setDurationHours,
        addStationToBookingCart,
        removeStationFromBookingCart,
        clearBookingCart,
        fetchStationsForRoom,
        confirmBooking,
        cancelUserBooking,
        placeSessionFoodOrder,
        redeemScrapReward,
        refreshUserCoupons,
        refreshUserBookings,
        refreshUserOrders,
        updateRealTimeRoomAvailability,
        submitEnquiry,
        updateEnquiry,
        deleteEnquiry,
        sendFeedback,
        getRoomById,
      }}
    >
      <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0]">
        {children}
        <ExitConfirmationModal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
        />
      </div>
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
