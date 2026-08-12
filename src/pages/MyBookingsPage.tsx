import React, { useState } from 'react';
import { useArena } from '../context/ArenaContext';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, ShieldAlert, Utensils, XCircle, CheckCircle2, Gamepad2, ArrowLeft, RefreshCw, QrCode } from 'lucide-react';
import { DbBooking } from '../lib/arenaService';

export const MyBookingsPage: React.FC = () => {
  const { userBookings, activeSession, cancelUserBooking, refreshUserBookings, userOrders } = useArena();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellationMsg, setCancellationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<DbBooking | null>(null);

  const now = new Date();

  const getBookingCategory = (b: DbBooking) => {
    if (b.status === 'cancelled') return 'CANCELLED';
    const start = new Date(b.start_time);
    const end = new Date(b.end_time);
    if (now >= start && now < end) return 'ACTIVE';
    if (now < start) return 'UPCOMING';
    return 'COMPLETED';
  };

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'ALL') return true;
    return getBookingCategory(b) === activeTab;
  });

  const handleCancelBooking = async (bookingId: string, startTimeIso: string) => {
    const start = new Date(startTimeIso);
    if (now >= start) {
      setCancellationMsg({ type: 'error', text: 'Cannot cancel a session that has already started.' });
      return;
    }

    setCancellingId(bookingId);
    setCancellationMsg(null);
    const res = await cancelUserBooking(bookingId);
    setCancellingId(null);

    if (res.success) {
      setCancellationMsg({ type: 'success', text: 'Booking successfully cancelled in Supabase database.' });
    } else {
      setCancellationMsg({ type: 'error', text: res.error || 'Failed to cancel booking.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#12121a] p-6 border border-[#2a2a3a] rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link to="/arena" className="text-xs font-tech text-[#00ff88] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO FLOOR MAP
            </Link>
            <span className="text-[#2a2a3a]">|</span>
            <span className="text-xs font-tech text-[#00d4ff]">MEMBER PORTAL</span>
          </div>
          <h1 className="text-2xl font-heading font-black tracking-wider text-white">
            MY ARENA BOOKINGS
          </h1>
          <p className="text-xs font-tech text-[#9ca3af] mt-1">
            Real-time Supabase database records of all your active, upcoming, and past sessions.
          </p>
        </div>

        <button
          onClick={() => refreshUserBookings()}
          className="self-start md:self-auto px-4 py-2 bg-[#1a1a24] hover:bg-[#252533] border border-[#3a3a4d] text-xs font-tech text-[#00ff88] rounded flex items-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH DB RECORDS</span>
        </button>
      </div>

      {/* Active Session Highlight Widget */}
      {activeSession && (
        <div className="mb-8 p-6 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#00ff88]/20 border border-[#00ff88] rounded-lg flex items-center justify-center shrink-0 animate-pulse">
                <Gamepad2 className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#00ff88] text-black font-tech font-bold text-[10px] rounded uppercase">
                    ACTIVE GAMING SESSION NOW
                  </span>
                  <span className="text-xs font-tech text-[#00ff88] font-bold">
                    REF: {activeSession.booking_reference}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-white mt-1">
                  {activeSession.booking_stations?.map(s => `${s.room_id.toUpperCase()} — ${s.station_name} (${s.station_id})`).join(', ')}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-xs font-tech text-[#e0e0e0]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#00ff88]" />
                    {new Date(activeSession.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(activeSession.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#ffd166]">
                    <CreditCard className="w-3.5 h-3.5" />
                    Status: {activeSession.payment_status.toUpperCase()} ({activeSession.payment_method.replaceAll('_', ' ').toUpperCase()})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/kitchen"
                className="px-5 py-3 bg-[#00ff88] text-black font-tech font-bold text-xs rounded hover:bg-[#00cc6e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              >
                <Utensils className="w-4 h-4" />
                <span>ORDER FOOD TO STATION</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {cancellationMsg && (
        <div
          className={`mb-6 p-4 rounded-lg border text-xs font-tech flex items-center justify-between ${
            cancellationMsg.type === 'success'
              ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88]'
              : 'bg-[#ff3366]/10 border-[#ff3366] text-[#ff3366]'
          }`}
        >
          <span>{cancellationMsg.text}</span>
          <button onClick={() => setCancellationMsg(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#2a2a3a] pb-3 mb-6 overflow-x-auto whitespace-nowrap max-w-full">
        {(['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map(tab => {
          const count = userBookings.filter(b => (tab === 'ALL' ? true : getBookingCategory(b) === tab)).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-tech uppercase rounded-md transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 font-bold'
                  : 'text-[#9ca3af] hover:text-[#e0e0e0] hover:bg-[#12121a]'
              }`}
            >
              <span>{tab}</span>
              <span className="px-1.5 py-0.2 bg-[#1a1a24] text-[10px] rounded border border-[#2a2a3a]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#12121a] border border-[#2a2a3a] rounded-xl p-8">
          <Gamepad2 className="w-12 h-12 text-[#3a3a4d] mx-auto mb-3" />
          <h3 className="text-base font-heading font-bold text-white mb-1">NO BOOKINGS FOUND</h3>
          <p className="text-xs font-tech text-[#9ca3af] mb-6">
            You don't have any {activeTab.toLowerCase()} bookings recorded in Supabase.
          </p>
          <Link
            to="/arena"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] text-black font-tech font-bold text-xs rounded hover:bg-[#00cc6e] transition-all cursor-pointer"
          >
            <span>BOOK A GAMING RIG NOW</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map(b => {
            const category = getBookingCategory(b);
            const isCanCancel = category === 'UPCOMING';
            const startTime = new Date(b.start_time);
            const endTime = new Date(b.end_time);

            return (
              <div
                key={b.id}
                className={`bg-[#12121a] border rounded-xl p-6 relative transition-all hover:border-[#00ff88]/50 flex flex-col justify-between ${
                  category === 'ACTIVE'
                    ? 'border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                    : 'border-[#2a2a3a]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3a] mb-4">
                    <div>
                      <span className="text-[10px] font-tech text-[#9ca3af] block">REF ID</span>
                      <span className="font-tech font-bold text-sm text-[#00ff88]">{b.booking_reference}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-tech uppercase font-bold rounded border ${
                          category === 'ACTIVE'
                            ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]'
                            : category === 'UPCOMING'
                            ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]'
                            : category === 'CANCELLED'
                            ? 'bg-[#ff3366]/20 text-[#ff3366] border-[#ff3366]'
                            : 'bg-[#6b7280]/20 text-[#9ca3af] border-[#6b7280]'
                        }`}
                      >
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Station & Room Details */}
                  <div className="mb-4">
                    <h4 className="text-xs font-tech text-[#9ca3af] uppercase mb-1">RESERVED STATIONS</h4>
                    <div className="flex flex-wrap gap-2">
                      {b.booking_stations && b.booking_stations.length > 0 ? (
                        b.booking_stations.map((st, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#1a1a26] border border-[#3a3a4d] rounded text-xs font-tech text-white font-bold"
                          >
                            {st.room_id.toUpperCase()} — {st.station_name} ({st.station_id})
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-tech text-white">GAMING RIG SUITE</span>
                      )}
                    </div>
                  </div>

                  {/* Timing & Cost Breakdown */}
                  <div className="grid grid-cols-2 gap-4 bg-[#0a0a0f] p-3 rounded-lg border border-[#2a2a3a] mb-4 text-xs font-tech">
                    <div>
                      <span className="text-[#9ca3af] block text-[10px]">DATE & TIME</span>
                      <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#00ff88]" />
                        {startTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[#00d4ff] block text-[11px] mt-0.5">
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({b.duration_hours} hrs)
                      </span>
                    </div>

                    <div>
                      <span className="text-[#9ca3af] block text-[10px]">TOTAL COST & PAYMENT</span>
                      <span className="text-[#ffd166] font-bold text-sm block">
                        ₹{b.total_cost}
                      </span>
                      <span className="text-[#e0e0e0] text-[10px] uppercase block mt-0.5">
                        {b.payment_method.replaceAll('_', ' ')} • {b.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-[#2a2a3a]">
                  <button
                    onClick={() => setSelectedBookingForDetails(b)}
                    className="text-xs font-tech text-[#00d4ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Full Receipt</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {category === 'ACTIVE' && (
                      <Link
                        to="/kitchen"
                        className="px-3 py-1.5 bg-[#00ff88] text-black font-tech font-bold text-xs rounded hover:bg-[#00cc6e] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Order Food</span>
                      </Link>
                    )}

                    {isCanCancel && (
                      <button
                        onClick={() => handleCancelBooking(b.id, b.start_time)}
                        disabled={cancellingId === b.id}
                        className="px-3 py-1.5 bg-[#ff3366]/20 hover:bg-[#ff3366]/30 text-[#ff3366] border border-[#ff3366]/50 font-tech font-bold text-xs rounded transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === b.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Receipt Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border-2 border-[#00ff88] rounded-xl p-5 sm:p-6 max-w-md w-full relative text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBookingForDetails(null)}
              className="absolute top-4 right-4 text-[#9ca3af] hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center pb-4 border-b border-[#2a2a3a] mb-4">
              <div className="w-10 h-10 bg-[#00ff88]/20 border border-[#00ff88] rounded-full flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="w-5 h-5 text-[#00ff88]" />
              </div>
              <h3 className="font-heading font-black text-lg text-white">ARENA OFFICIAL RECEIPT</h3>
              <p className="text-xs font-tech text-[#00ff88]">REF: {selectedBookingForDetails.booking_reference}</p>
            </div>

            <div className="space-y-3 text-xs font-tech mb-6">
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">Status:</span>
                <span className="font-bold text-[#00ff88] uppercase">{selectedBookingForDetails.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">Duration:</span>
                <span>{selectedBookingForDetails.duration_hours} Hour(s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">Start Time:</span>
                <span>{new Date(selectedBookingForDetails.start_time).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">End Time:</span>
                <span>{new Date(selectedBookingForDetails.end_time).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">Payment Method:</span>
                <span className="uppercase text-[#ffd166]">{selectedBookingForDetails.payment_method.replaceAll('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a2a3a]">
                <span className="text-[#9ca3af]">Payment Status:</span>
                <span className="uppercase text-[#00d4ff]">{selectedBookingForDetails.payment_status}</span>
              </div>

              <div className="pt-2">
                <span className="text-[#9ca3af] block mb-1">STATIONS BOOKED:</span>
                <div className="space-y-1">
                  {selectedBookingForDetails.booking_stations?.map((s, idx) => (
                    <div key={idx} className="flex justify-between bg-[#0a0a0f] p-2 rounded border border-[#2a2a3a]">
                      <span>{s.room_id.toUpperCase()} — {s.station_name}</span>
                      <span className="text-[#ffd166]">₹{s.price_per_hour}/hr</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-base font-bold pt-4 border-t-2 border-[#2a2a3a] text-white">
                <span>TOTAL AMOUNT PAID/DUE:</span>
                <span className="text-[#00ff88]">₹{selectedBookingForDetails.total_cost}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingForDetails(null)}
              className="w-full py-2.5 bg-[#00ff88] text-black font-tech font-bold text-xs rounded hover:bg-[#00cc6e] cursor-pointer"
            >
              CLOSE RECEIPT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
