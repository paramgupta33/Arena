import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { PCStation, PS5Station, PC_STATIONS, PS5_STATIONS } from '../data/arenaData';
import { Monitor, Gamepad2, ArrowLeft, CheckCircle2, Cpu, Tv, Sparkles, Loader2, Calendar, Clock, ShoppingBag, Trash2, CreditCard, Coins, QrCode, AlertCircle } from 'lucide-react';
import { checkAllStationsAvailableInDb, checkStationsOverlapInDb, getBookedStationInfoForSlot, StationOccupancyInfo, DbBooking, getLocalDateString } from '../lib/arenaService';
import { useAuth } from '../context/AuthContext';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const {
    getRoomById,
    selectRoom,
    fetchStationsForRoom,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    durationHours,
    setDurationHours,
    bookingCartStations,
    addStationToBookingCart,
    removeStationFromBookingCart,
    clearBookingCart,
    confirmBooking,
  } = useArena();

  const [stations, setStations] = useState<(PCStation | PS5Station)[]>([]);
  const [loadingStations, setLoadingStations] = useState<boolean>(true);
  const [unavailableStationIds, setUnavailableStationIds] = useState<string[]>([]);
  const [stationOccupancyMap, setStationOccupancyMap] = useState<Record<string, StationOccupancyInfo>>({});

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pay_online' | 'cash_or_arena' | 'scrap' | 'qr'>('pay_online');
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<DbBooking | null>(null);

  const { userCoupons } = useArena();

  // Dynamic Razorpay Script Loader
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Handle route redirects
  if (roomId === 'kitchen') {
    navigate('/kitchen');
    return null;
  }
  if (roomId === 'reception') {
    navigate('/reception');
    return null;
  }
  if (roomId === 'entry') {
    navigate('/arena');
    return null;
  }

  const room = getRoomById(roomId || 'sphere1');

  // 1. Load Room Stations once when room.id changes
  useEffect(() => {
    let active = true;
    if (room) {
      setLoadingStations(true);
      fetchStationsForRoom(room.id)
        .then(fetched => {
          if (!active) return;
          setStations(fetched);
          setLoadingStations(false);
        })
        .catch(() => {
          if (!active) return;
          const fallback = room.type === 'pc' ? PC_STATIONS[room.id] || [] : PS5_STATIONS;
          setStations(fallback);
          setLoadingStations(false);
        });
    }
    return () => {
      active = false;
    };
  }, [room?.id]);

  // 2. Re-calculate slot availability using the global checkAllStationsAvailableInDb & getBookedStationInfoForSlot
  // Runs whenever stations, selectedDate, selectedTime, or durationHours change, or every 4 seconds
  useEffect(() => {
    let active = true;
    let pollTimer: any = null;

    const checkSlotAvailability = async () => {
      if (!active || !stations || stations.length === 0) return;

      const [hoursStr, minsStr] = selectedTime.split(':');
      const startTime = new Date(`${selectedDate}T${hoursStr.padStart(2, '0')}:${minsStr.padStart(2, '0')}:00`);
      const endTime = new Date(startTime.getTime() + durationHours * 3600 * 1000);

      const allStationIds = stations.map(s => s.id);

      // Call the exact same global availability check function used during final booking: checkAllStationsAvailableInDb
      const [res, infoMap] = await Promise.all([
        checkAllStationsAvailableInDb(allStationIds, startTime.toISOString(), endTime.toISOString()),
        getBookedStationInfoForSlot(startTime.toISOString(), endTime.toISOString()),
      ]);

      if (!active) return;

      setStationOccupancyMap(infoMap);

      const unavailSet = new Set<string>([
        ...(res.unavailableStationIds || []),
        ...Object.keys(infoMap),
      ]);

      // If slot start time is in the past for today, mark all as unavailable
      const isToday = selectedDate === getLocalDateString();
      const isPast = isToday && startTime.getTime() < Date.now() - 60000;
      if (isPast) {
        stations.forEach(s => unavailSet.add(s.id));
      }

      const unavailList = Array.from(unavailSet);
      setUnavailableStationIds(unavailList);

      // Auto-remove any unavailable stations currently in the booking cart
      unavailList.forEach(id => {
        if (bookingCartStations.some(s => s.id === id)) {
          removeStationFromBookingCart(id);
        }
      });
    };

    checkSlotAvailability();

    // Poll every 4 seconds to reflect bookings made by other users in real-time
    pollTimer = setInterval(checkSlotAvailability, 4000);

    return () => {
      active = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [stations, selectedDate, selectedTime, durationHours]);

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-xl font-heading font-bold text-red-400">Room Not Found</h2>
        <p className="text-sm text-[#8e8ea0] mt-2">The requested room does not exist.</p>
        <Link to="/arena" className="mt-4 inline-block px-4 py-2 bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88] text-xs font-tech rounded">
          Back to Floor Map
        </Link>
      </div>
    );
  }

  const isPCRoom = room.type === 'pc';
  const isPS5Room = room.type === 'console';

  // Compute session times
  const [hoursStr, minsStr] = selectedTime.split(':');
  const startDateTime = new Date(`${selectedDate}T${hoursStr.padStart(2, '0')}:${minsStr.padStart(2, '0')}:00`);
  const endDateTime = new Date(startDateTime.getTime() + durationHours * 3600 * 1000);

  const totalCartHourlyRate = bookingCartStations.reduce((sum, s) => sum + s.pricePerHour, 0);
  const totalBookingAmount = totalCartHourlyRate * durationHours;

  // Eligible coupons for current room type
  const eligibleCoupons = userCoupons.filter(c => {
    if (c.status !== 'UNUSED') return false;
    if (isPCRoom) return c.reward_type === 'pc';
    if (isPS5Room) return c.reward_type === 'ps5';
    return true;
  });

  const selectedCoupon = userCoupons.find(c => c.id === selectedCouponId);
  const couponDiscount = selectedCoupon ? Number(selectedCoupon.reward_value) || 0 : 0;
  const finalPayableAmount = Math.max(0, totalBookingAmount - couponDiscount);

  const handleToggleStationCart = (st: PCStation | PS5Station) => {
    // Guard: Prevent selecting unavailable stations
    if (unavailableStationIds.includes(st.id)) return;

    const isSelected = bookingCartStations.some(s => s.id === st.id);
    if (isSelected) {
      removeStationFromBookingCart(st.id);
    } else {
      addStationToBookingCart({
        id: st.id,
        name: st.name || st.id,
        roomId: room.id,
        pricePerHour: st.hourlyRate || st.pricePerHour || 150,
        gpu: (st as PCStation).gpu,
        cpu: (st as PCStation).cpu,
        monitor: (st as PCStation).monitor,
      });
    }
  };

  const handleExecuteCheckout = async () => {
    if (bookingCartStations.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    // Final safety verification of availability using checkAllStationsAvailableInDb before submitting
    const [hStr, mStr] = selectedTime.split(':');
    const sDateTime = new Date(`${selectedDate}T${hStr.padStart(2, '0')}:${mStr.padStart(2, '0')}:00`);
    const eDateTime = new Date(sDateTime.getTime() + durationHours * 3600 * 1000);
    const cartIds = bookingCartStations.map(s => s.id);

    const checkRes = await checkAllStationsAvailableInDb(
      cartIds,
      sDateTime.toISOString(),
      eDateTime.toISOString()
    );

    if (!checkRes.available) {
      setIsSubmitting(false);
      const unavailableList = checkRes.unavailableStationIds;
      unavailableList.forEach(id => removeStationFromBookingCart(id));
      setErrorMessage(
        `Station(s) [${unavailableList.join(', ')}] are no longer available for this time slot. They have been removed from your selection.`
      );
      return;
    }

    const res = await confirmBooking('cash_or_arena', 'pending', selectedCouponId || undefined);
    setIsSubmitting(false);
    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
    } else {
      setErrorMessage(res.error || 'Failed to complete booking.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12121e] border border-[#2a2a3a] p-6 rounded-xl relative overflow-hidden">
        <div>
          <button
            onClick={() => {
              selectRoom(null);
              navigate('/arena');
            }}
            className="text-xs font-tech text-[#00ff88] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Floor Map
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-black text-white">{room.name}</h1>
            <span className="text-xs font-tech bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 px-2.5 py-0.5 rounded">
              {room.capacity} Stations Total
            </span>
          </div>
          <p className="text-xs text-[#8e8ea0] mt-1">{room.description}</p>
        </div>

        {/* Date / Time Slot Picker Control Panel */}
        <div className="bg-[#08080c] border border-[#2a2a3a] p-4 rounded-xl text-xs font-tech space-y-3 w-full md:w-auto md:min-w-[300px]">
          <div className="text-[#00ff88] font-bold flex items-center gap-1.5 uppercase">
            <Calendar className="w-4 h-4" /> SELECT DATE & TIME SLOT
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#8e8ea0] block mb-1">DATE</label>
              <input
                type="date"
                min={getLocalDateString()}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-[#12121e] border border-[#2a2a3a] px-2 py-1.5 rounded text-white text-xs font-tech focus:border-[#00ff88] outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8e8ea0] block mb-1">START TIME</label>
              <select
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="w-full bg-[#12121e] border border-[#2a2a3a] px-2 py-1.5 rounded text-white text-xs font-tech focus:border-[#00ff88] outline-none cursor-pointer"
              >
                {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(t => {
                  const isToday = selectedDate === getLocalDateString();
                  const slotStart = new Date(`${selectedDate}T${t}:00`);
                  const isPastSlot = isToday && slotStart.getTime() < Date.now() - 60000;
                  return (
                    <option key={t} value={t} disabled={isPastSlot}>
                      {t} {Number(t.split(':')[0]) >= 12 ? 'PM' : 'AM'}{isPastSlot ? ' (Passed)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#8e8ea0] block mb-1">SESSION DURATION</label>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map(hrs => (
                <button
                  key={hrs}
                  onClick={() => setDurationHours(hrs)}
                  className={`py-1 text-[11px] font-tech rounded border transition-all cursor-pointer ${
                    durationHours === hrs
                      ? 'bg-[#00ff88] text-black font-bold border-[#00ff88]'
                      : 'bg-[#12121e] text-[#8e8ea0] border-[#2a2a3a] hover:text-white'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loadingStations ? (
        <div className="flex items-center justify-center py-16 text-[#00ff88] font-tech text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Verifying real-time Supabase station availability...
        </div>
      ) : (
        <>
          {/* PC Stations View */}
          {isPCRoom && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(stations as PCStation[]).map(pc => {
                const isBookedForSlot = unavailableStationIds.includes(pc.id);
                const isSelectedInCart = bookingCartStations.some(s => s.id === pc.id);

                return (
                  <div
                    key={pc.id}
                    className={`p-4 bg-[#12121a] border rounded-xl transition-all flex flex-col justify-between ${
                      isBookedForSlot
                        ? 'border-red-500/30 opacity-60 bg-[#181216] cursor-not-allowed select-none'
                        : isSelectedInCart
                        ? 'border-[#00ff88] bg-[#00ff88]/5 shadow-[0_0_15px_rgba(0,255,136,0.1)]'
                        : 'border-[#2a2a3a] hover:border-[#00ff88]/40'
                    }`}
                  >
                    <div>
                      {/* PC Number & Status */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2a3a]">
                        <h3 className="font-heading font-black text-base text-white">{pc.id}</h3>
                        <span
                          className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded uppercase ${
                            isBookedForSlot
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-extrabold'
                              : isSelectedInCart
                              ? 'bg-[#00ff88] text-black font-bold'
                              : 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 font-bold'
                          }`}
                        >
                          {isBookedForSlot ? 'UNAVAILABLE' : isSelectedInCart ? 'SELECTED' : 'AVAILABLE'}
                        </span>
                      </div>

                      {/* Clean Hardware Specs */}
                      <div className="space-y-1.5 text-xs font-tech my-3">
                        <div className="flex justify-between text-[#8e8ea0]">
                          <span>GPU</span>
                          <span className="text-white font-semibold">{pc.gpu || 'RTX 4070'}</span>
                        </div>
                        <div className="flex justify-between text-[#8e8ea0]">
                          <span>CPU</span>
                          <span className="text-white font-semibold">{pc.cpu || 'i7-14700K'}</span>
                        </div>
                        <div className="flex justify-between text-[#8e8ea0]">
                          <span>Monitor</span>
                          <span className="text-white font-semibold">{pc.monitor || '240Hz'}</span>
                        </div>
                        {isBookedForSlot && (
                          <div className="border-t border-red-500/20 pt-2 mt-2 space-y-1">
                            <div className="flex justify-between text-red-400 font-bold text-[11px]">
                              <span>Status</span>
                              <span>Reserved for this slot</span>
                            </div>
                            {stationOccupancyMap[pc.id]?.endTimeFormatted && (
                              <div className="flex justify-between text-[#8e8ea0] text-[10px]">
                                <span>Session Ends</span>
                                <span className="text-white font-semibold">{stationOccupancyMap[pc.id].endTimeFormatted}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="pt-3 border-t border-[#2a2a3a] flex items-center justify-between">
                      <span className="text-sm font-tech font-bold text-white">
                        ₹{pc.hourlyRate || pc.pricePerHour || 150}/hour
                      </span>

                      {!isBookedForSlot ? (
                        <button
                          onClick={() => handleToggleStationCart(pc)}
                          className={`px-3 py-1.5 font-tech text-xs font-bold rounded transition-all cursor-pointer ${
                            isSelectedInCart
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                              : 'bg-[#00ff88] text-black hover:bg-[#00cc6e]'
                          }`}
                        >
                          {isSelectedInCart ? 'REMOVE' : 'BOOK NOW'}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 font-tech text-xs font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed opacity-75"
                        >
                          UNAVAILABLE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PS5 Lounge Stations View */}
          {isPS5Room && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(stations as PS5Station[]).map(ps5 => {
                const isBookedForSlot = unavailableStationIds.includes(ps5.id);
                const isSelectedInCart = bookingCartStations.some(s => s.id === ps5.id);

                return (
                  <div
                    key={ps5.id}
                    className={`p-4 bg-[#12121a] border rounded-xl transition-all flex flex-col justify-between ${
                      isBookedForSlot
                        ? 'border-red-500/30 opacity-60 bg-[#181216] cursor-not-allowed select-none'
                        : isSelectedInCart
                        ? 'border-[#00d4ff] bg-[#00d4ff]/5 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                        : 'border-[#2a2a3a] hover:border-[#00d4ff]/40'
                    }`}
                  >
                    <div>
                      {/* PS5 Pod & Status */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2a3a]">
                        <h3 className="font-heading font-black text-base text-white">{ps5.id}</h3>
                        <span
                          className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded uppercase ${
                            isBookedForSlot
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-extrabold'
                              : isSelectedInCart
                              ? 'bg-[#00d4ff] text-black font-bold'
                              : 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 font-bold'
                          }`}
                        >
                          {isBookedForSlot ? 'UNAVAILABLE' : isSelectedInCart ? 'SELECTED' : 'AVAILABLE'}
                        </span>
                      </div>

                      {/* Clean Hardware Specs */}
                      <div className="space-y-1.5 text-xs font-tech my-3">
                        <div className="flex justify-between text-[#8e8ea0]">
                          <span>Display</span>
                          <span className="text-white font-semibold">{ps5.display || '65" 4K 120Hz'}</span>
                        </div>
                        <div className="flex justify-between text-[#8e8ea0]">
                          <span>Seating</span>
                          <span className="text-white font-semibold">{ps5.seating || 'Gaming Sofa'}</span>
                        </div>
                        {isBookedForSlot && (
                          <div className="border-t border-red-500/20 pt-2 mt-2 space-y-1">
                            <div className="flex justify-between text-red-400 font-bold text-[11px]">
                              <span>Status</span>
                              <span>Reserved for this slot</span>
                            </div>
                            {stationOccupancyMap[ps5.id]?.endTimeFormatted && (
                              <div className="flex justify-between text-[#8e8ea0] text-[10px]">
                                <span>Session Ends</span>
                                <span className="text-white font-semibold">{stationOccupancyMap[ps5.id].endTimeFormatted}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="pt-3 border-t border-[#2a2a3a] flex items-center justify-between">
                      <span className="text-sm font-tech font-bold text-white">
                        ₹{ps5.hourlyRate || ps5.pricePerHour || 180}/hour
                      </span>

                      {!isBookedForSlot ? (
                        <button
                          onClick={() => handleToggleStationCart(ps5)}
                          className={`px-3 py-1.5 font-tech text-xs font-bold rounded transition-all cursor-pointer ${
                            isSelectedInCart
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                              : 'bg-[#00d4ff] text-black hover:bg-[#00b0d4]'
                          }`}
                        >
                          {isSelectedInCart ? 'REMOVE' : 'BOOK NOW'}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 font-tech text-xs font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed opacity-75"
                        >
                          UNAVAILABLE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Persistent Bottom Booking Sticky Bar */}
      {bookingCartStations.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92%] bg-[#12121a]/95 backdrop-blur-md border-2 border-[#00ff88] p-3 sm:p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-tech">
              <span className="px-2 py-0.5 bg-[#00ff88] text-black font-bold rounded uppercase text-[10px] sm:text-xs">
                {bookingCartStations.length} STATION(S) SELECTED
              </span>
              <span className="text-[#00d4ff] text-[11px] sm:text-xs">
                {startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({durationHours}h)
              </span>
            </div>
            <div className="text-white font-bold text-xs sm:text-sm mt-1 truncate">
              Selected: {bookingCartStations.map(s => s.id).join(', ')}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2a2a3a]">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-tech text-[#9ca3af] block uppercase">Total Cost</span>
              <span className="text-lg sm:text-xl font-heading font-black text-[#00ff88]">₹{totalBookingAmount}</span>
            </div>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setErrorMessage(null);
                setIsCheckoutOpen(true);
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#00ff88] text-black font-tech font-bold text-xs rounded hover:bg-[#00cc6e] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)] whitespace-nowrap"
            >
              PROCEED TO CONFIRM
            </button>
          </div>
        </div>
      )}

      {/* Checkout Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121e] border-2 border-[#00ff88] max-w-lg w-full p-5 sm:p-6 rounded-2xl shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-[#9ca3af] hover:text-white cursor-pointer"
            >
              ✕
            </button>

            {!confirmedBooking ? (
              <>
                <div>
                  <h3 className="text-xl font-heading font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00ff88]" /> CONFIRM ARENA RESERVATION
                  </h3>
                  <p className="text-xs font-tech text-[#9ca3af] mt-1">
                    Review session timing and select payment method. Saved directly to Supabase DB.
                  </p>
                </div>

                {/* Session Breakdown */}
                <div className="bg-[#08080c] p-4 rounded-xl border border-[#2a2a3a] space-y-2 text-xs font-tech">
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Date:</span>
                    <span className="text-white font-bold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Time Window:</span>
                    <span className="text-[#00ff88] font-bold">
                      {startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({durationHours} hours)
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#1e1e2d]">
                    <span className="text-[#9ca3af]">Stations ({bookingCartStations.length}):</span>
                    <span className="text-white">{bookingCartStations.map(s => s.id).join(', ')}</span>
                  </div>

                  {/* Coupon Selector Section */}
                  <div className="pt-2 border-t border-[#1e1e2d] space-y-2">
                    <span className="text-xs font-tech text-[#ffd166] font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> APPLY REWARD COUPON
                    </span>
                    {eligibleCoupons.length === 0 ? (
                      <p className="text-[11px] text-[#8e8ea0]">No unused coupons available for this room.</p>
                    ) : (
                      <select
                        value={selectedCouponId || ''}
                        onChange={e => setSelectedCouponId(e.target.value || null)}
                        className="w-full bg-[#12121e] border border-[#ffd166]/40 p-2 rounded text-xs text-white font-tech focus:border-[#ffd166] outline-none cursor-pointer"
                      >
                        <option value="">-- No Coupon Selected --</option>
                        {eligibleCoupons.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.coupon_code} - {c.reward_title} (-₹{c.reward_value})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-xs text-[#ffd166] font-tech font-bold pt-1">
                      <span>Coupon Discount:</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-sm text-[#00ff88] pt-2 border-t border-[#1e1e2d]">
                    <span>Total Amount Payable:</span>
                    <span>₹{finalPayableAmount}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/40 rounded text-xs font-tech text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Payment Method Notice */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-[#00d4ff]/30 flex items-center justify-between text-xs font-tech">
                  <div>
                    <span className="text-[#8e8ea0] block text-[10px]">PAYMENT MODE</span>
                    <span className="text-[#00d4ff] font-bold">PAY AT ARENA</span>
                  </div>
                  <span className="text-[10px] text-[#8e8ea0]">Pay cash or card on entry</span>
                </div>

                <button
                  onClick={handleExecuteCheckout}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#00ff88] text-black font-tech font-bold text-xs uppercase tracking-wider rounded hover:bg-[#00cc6e] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Booking to Supabase...
                    </>
                  ) : (
                    `CONFIRM & BOOK NOW (₹${finalPayableAmount})`
                  )}
                </button>
              </>
            ) : (
              <div className="py-4 space-y-5 text-left font-tech">
                <div className="text-center pb-4 border-b border-[#2a2a3a]">
                  <CheckCircle2 className="w-12 h-12 text-[#00ff88] mx-auto mb-2 animate-bounce" />
                  <h3 className="text-xl font-heading font-black text-white tracking-wider">BOOKING CONFIRMED ✓</h3>
                  <p className="text-xs text-[#00ff88] mt-1">Saved directly in Supabase Database</p>
                </div>

                <div className="space-y-3 text-xs bg-[#08080c] p-4 rounded-xl border border-[#00ff88]/40">
                  <div>
                    <span className="text-[#8e8ea0] text-[10px] uppercase block">Booking Reference</span>
                    <span className="font-bold text-base text-[#00ff88]">{confirmedBooking.booking_reference}</span>
                  </div>

                  <div>
                    <span className="text-[#8e8ea0] text-[10px] uppercase block">Room</span>
                    <span className="font-bold text-white">{room.name}</span>
                  </div>

                  <div>
                    <span className="text-[#8e8ea0] text-[10px] uppercase block">Stations Reserved</span>
                    <div className="font-bold text-white">
                      {confirmedBooking.booking_stations?.map(s => s.station_id).join(', ') || 'Selected Stations'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#8e8ea0] text-[10px] uppercase block">Date & Time Slot</span>
                    <div className="font-bold text-[#00d4ff]">
                      {new Date(confirmedBooking.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-white font-semibold">
                      {new Date(confirmedBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(confirmedBooking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-[#2a2a3a]">
                    <div>
                      <span className="text-[#8e8ea0] text-[10px] uppercase block">Total Amount</span>
                      <span className="font-bold text-lg text-[#00ff88]">₹{confirmedBooking.total_cost}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8e8ea0] text-[10px] uppercase block">Payment Status</span>
                      <span className="font-bold text-xs text-[#00d4ff] uppercase">PAY AT ARENA</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/bookings"
                    className="flex-1 py-3 bg-[#00ff88] text-black font-tech font-bold text-xs text-center rounded hover:bg-[#00cc6e] transition-all cursor-pointer"
                  >
                    VIEW MY BOOKINGS
                  </Link>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setConfirmedBooking(null);
                      selectRoom(null);
                      navigate('/arena');
                    }}
                    className="flex-1 py-3 bg-[#1a1a24] text-white border border-[#3a3a4d] font-tech font-bold text-xs text-center rounded hover:bg-[#252533] transition-all cursor-pointer"
                  >
                    BACK TO FLOOR MAP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
