import React, { useState } from 'react';
import { useArena } from '../context/ArenaContext';
import { KITCHEN_MENU } from '../data/arenaData';
import { Utensils, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Coffee, Zap, ShieldAlert, CreditCard, Coins, Clock, Gamepad2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const KitchenPage: React.FC = () => {
  const { profile } = useAuth();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    menuItems,
    activeSession,
    placeSessionFoodOrder,
    userOrders,
    userCoupons,
  } = useArena();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pay_online' | 'scrap' | 'session_bill'>('session_bill');
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeMenu = menuItems && menuItems.length > 0 ? menuItems : KITCHEN_MENU;
  const categories = ['All', 'Snacks', 'Drinks', 'Energy Shots', 'Hot Meals', 'Food'];

  const filteredMenu =
    selectedCategory === 'All'
      ? activeMenu
      : activeMenu.filter(item => item.category === selectedCategory);

  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  const availableFoodCoupons = userCoupons.filter(
    c => c.reward_type === 'food' && c.status === 'UNUSED'
  );
  const appliedCoupon = availableFoodCoupons.find(c => c.id === selectedCouponId);
  const couponDiscount = appliedCoupon ? Number(appliedCoupon.reward_value) || 0 : 0;
  const finalPrice = Math.max(0, totalPrice - couponDiscount);

  const activeStationId = activeSession?.booking_stations?.[0]?.station_id || activeSession?.station_id || 'PC-01';
  const activeRoomId = activeSession?.booking_stations?.[0]?.room_id || activeSession?.room_id || 'sphere1';

  const handleCheckoutFoodOrder = async () => {
    if (!activeSession) {
      setErrorMessage('No active gaming session. Please book a gaming station first.');
      return;
    }
    if (cart.length === 0) return;

    setIsPlacingOrder(true);
    setErrorMessage(null);

    const res = await placeSessionFoodOrder(selectedPaymentMethod, selectedCouponId || undefined);
    setIsPlacingOrder(false);

    if (res.success) {
      setOrderPlacedSuccess(true);
      setSelectedCouponId(null);
      setTimeout(() => {
        setOrderPlacedSuccess(false);
      }, 4000);
    } else {
      setErrorMessage(res.error || 'Failed to place food order.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12121e] border border-[#ff3366]/40 p-5 sm:p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff3366]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div>
          <Link
            to="/arena"
            className="inline-flex items-center gap-1.5 text-xs font-tech text-[#8e8ea0] hover:text-[#00ff88] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Floor Map
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="w-5 h-5 text-[#ff3366]" />
            <h1 className="text-xl sm:text-2xl font-heading font-black text-white">ARENA KITCHEN & BAR</h1>
          </div>
          <p className="text-xs text-[#8e8ea0]">
            Fresh gaming burgers, peri peri fries, cold brews, and energy drinks delivered directly to your gaming desk.
          </p>
        </div>

        {/* Active Session Status Box */}
        {activeSession ? (
          <div className="bg-[#00ff88]/10 border border-[#00ff88] p-3 rounded-lg flex items-center gap-3">
            <span className="w-3 h-3 bg-[#00ff88] rounded-full animate-ping" />
            <div className="text-xs font-tech">
              <span className="text-[#00ff88] font-bold block">ACTIVE GAMING SESSION</span>
              <span className="text-white">
                DELIVERING TO: <strong className="text-[#00ff88]">{activeRoomId.toUpperCase()} — {activeStationId}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#ff3366]/10 border border-[#ff3366]/40 p-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ff3366]" />
            <span className="text-xs font-tech text-[#ff3366]">NO ACTIVE SESSION DETECTED</span>
          </div>
        )}
      </div>

      {/* No Active Session Warning Alert */}
      {!activeSession && (
        <div className="bg-[#ff3366]/10 border-2 border-[#ff3366] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tech">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#ff3366] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">ACTIVE GAMING SESSION REQUIRED FOR FOOD ORDERS</h4>
              <p className="text-[#e0e0e0] mt-0.5">
                Food and beverages are served exclusively to active gaming stations. You can browse the menu below, but you must reserve a station first to enable desk delivery.
              </p>
            </div>
          </div>

          <Link
            to="/arena"
            className="px-5 py-2.5 bg-[#ff3366] text-white font-bold rounded hover:bg-[#e02e5b] transition-all shrink-0 cursor-pointer text-center"
          >
            BOOK A GAMING RIG NOW
          </Link>
        </div>
      )}

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b border-[#2a2a3a] pb-3 overflow-x-auto whitespace-nowrap max-w-full">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-tech uppercase rounded-md transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#ff3366] text-white font-bold shadow-[0_0_10px_rgba(255,51,102,0.3)]'
                : 'bg-[#12121e] text-[#8e8ea0] hover:text-white border border-[#2a2a3a]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Food & Drink Menu Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                className="p-4 bg-[#12121e] border border-[#2a2a3a] hover:border-[#ff3366]/50 rounded-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-sm text-white group-hover:text-[#ff3366] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-sm font-tech font-bold text-[#ff3366]">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8e8ea0] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-tech text-[#8e8ea0] bg-[#08080c] px-2 py-0.5 rounded border border-[#2a2a3a]">
                    {item.category}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e1e2d] flex items-center justify-end">
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1.5 bg-[#ff3366]/20 hover:bg-[#ff3366] text-[#ff3366] hover:text-white font-tech text-xs font-bold border border-[#ff3366]/40 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active / Recent Orders Log */}
          {userOrders.length > 0 && (
            <div className="mt-8 bg-[#12121e] border border-[#2a2a3a] p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-heading font-bold text-white uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00ff88]" /> MY FOOD ORDERS TRACKER (SUPABASE RECORDED)
              </h3>

              <div className="space-y-3">
                {userOrders.map(ord => (
                  <div key={ord.id} className="bg-[#08080c] p-3 rounded-lg border border-[#2a2a3a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-tech">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#ff3366] font-bold">{ord.order_number}</span>
                        <span className="text-[#8e8ea0]">({ord.delivery_location})</span>
                      </div>
                      <div className="text-[#9ca3af] text-[11px] mt-0.5">
                        Amount: ₹{ord.total_amount} • {ord.payment_method.replaceAll('_', ' ').toUpperCase()} ({ord.payment_status})
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 rounded font-bold uppercase text-[10px]">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Station Order Cart Sidebar (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-[#12121e] border border-[#2a2a3a] p-4 sm:p-5 rounded-xl space-y-4 lg:sticky lg:top-20">
            
            <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-3">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#ff3366]" /> Station Order
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {orderPlacedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto animate-bounce" />
                <h3 className="font-heading font-bold text-white text-base">Order Sent to Kitchen!</h3>
                <p className="text-xs text-[#8e8ea0]">
                  Your order is recorded in Supabase and runner will deliver it to <strong className="text-[#00ff88]">{activeStationId}</strong> in ~10 mins.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-8 text-center text-[#8e8ea0] text-xs font-tech space-y-2">
                <Coffee className="w-8 h-8 text-[#2a2a3a] mx-auto" />
                <p>Your order cart is empty.</p>
                <p className="text-[10px]">Add items from the menu to request desk delivery.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#08080c] border border-[#1e1e2d] rounded-lg flex items-center justify-between text-xs font-tech"
                    >
                      <div className="flex-1 pr-2">
                        <div className="text-white font-semibold">{item.name}</div>
                        <div className="text-[#ff3366]">₹{(item.price * quantity).toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#12121e] border border-[#2a2a3a] rounded px-1.5 py-0.5">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8e8ea0] hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold px-1">{quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="text-[#8e8ea0] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-[11px] font-tech text-red-400">
                    {errorMessage}
                  </div>
                )}

                {/* Delivery Location Confirmation */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-[#2a2a3a] text-xs font-tech space-y-1">
                  <span className="text-[#8e8ea0] block text-[10px]">DELIVERY LOCATION</span>
                  <span className="text-[#00ff88] font-bold">
                    {activeSession ? `${activeRoomId.toUpperCase()} — ${activeStationId}` : 'NO ACTIVE SESSION'}
                  </span>
                </div>

                {/* Food Coupon Selection */}
                {availableFoodCoupons.length > 0 && (
                  <div className="space-y-1.5 font-tech text-xs">
                    <span className="text-[#8e8ea0] block text-[10px]">APPLY FOOD COUPON</span>
                    <select
                      value={selectedCouponId || ''}
                      onChange={e => setSelectedCouponId(e.target.value || null)}
                      className="w-full bg-[#08080c] border border-[#2a2a3a] text-white text-xs p-2 rounded focus:border-[#ff3366] outline-none cursor-pointer"
                    >
                      <option value="">No Coupon Applied</option>
                      {availableFoodCoupons.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.reward_title} (₹{c.reward_value} OFF)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Options */}
                <div className="space-y-1.5 font-tech text-xs">
                  <span className="text-[#8e8ea0] block text-[10px]">PAYMENT METHOD</span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setSelectedPaymentMethod('session_bill')}
                      className={`p-2 rounded border text-center cursor-pointer transition-all ${
                        selectedPaymentMethod === 'session_bill'
                          ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
                          : 'bg-[#08080c] border-[#2a2a3a] text-[#8e8ea0]'
                      }`}
                    >
                      Session Bill
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('pay_online')}
                      className={`p-2 rounded border text-center cursor-pointer transition-all ${
                        selectedPaymentMethod === 'pay_online'
                          ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] font-bold'
                          : 'bg-[#08080c] border-[#2a2a3a] text-[#8e8ea0]'
                      }`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('scrap')}
                      className={`p-2 rounded border text-center cursor-pointer transition-all ${
                        selectedPaymentMethod === 'scrap'
                          ? 'bg-[#ffd166]/20 border-[#ffd166] text-[#ffd166] font-bold'
                          : 'bg-[#08080c] border-[#2a2a3a] text-[#8e8ea0]'
                      }`}
                    >
                      SCRAP
                    </button>
                  </div>
                </div>

                {/* Total & Checkout */}
                <div className="pt-3 border-t border-[#2a2a3a] space-y-2 font-tech">
                  <div className="flex items-center justify-between text-xs text-[#8e8ea0]">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#00ff88]">
                      <span>Coupon Discount:</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-1 border-t border-[#1e1e2d]">
                    <span className="text-white font-bold">Total Amount:</span>
                    <span className="text-lg font-bold text-[#ff3366]">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckoutFoodOrder}
                    disabled={isPlacingOrder || !activeSession}
                    className="w-full py-3 bg-[#ff3366] hover:bg-[#e02e5b] text-white font-tech font-bold rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    <Zap className="w-4 h-4" />
                    {isPlacingOrder ? 'Sending Order...' : 'Send Order To My Station Desk'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
