import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArena } from '../context/ArenaContext';
import { User, ShieldCheck, Coins, Ticket, X, Copy, Check, Calendar, Gamepad2, Zap } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    showProfileModal,
    setShowProfileModal,
    setShowScrapModal,
    userCoupons,
    userBookings,
  } = useArena();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!showProfileModal) return null;

  const memberName = profile?.full_name || user?.email?.split('@')[0] || 'PARAM GUPTA';
  const memberEmail = profile?.email || user?.email || 'param@arena.com';
  const memberId = user ? `ARENA-${user.id.substring(0, 6).toUpperCase()}` : 'ARENA-MEMBER';
  const scrapBalance = profile?.scrap_balance ?? 1000;
  const bookingsCount = userBookings.length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#0e0e17] border border-[#2a2a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2a2a3a] bg-[#12121e] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/40 flex items-center justify-center">
              <User className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-black text-white tracking-wide">
                MEMBER PROFILE & SCRAP CARD
              </h2>
              <p className="text-xs text-[#8e8ea0] font-tech">
                ARENA Membership Credentials & Saved Reward Coupons
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(false)}
            className="p-1.5 text-[#8e8ea0] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Member Card Box */}
          <div className="p-5 bg-gradient-to-br from-[#12121e] to-[#07070c] border border-[#00ff88]/30 rounded-xl relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 border-2 border-[#00ff88] flex items-center justify-center font-heading font-black text-lg text-[#00ff88] shrink-0">
                  {memberName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-heading font-black text-white tracking-wide uppercase">
                      {memberName}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 rounded text-[10px] font-tech font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-[#8e8ea0] font-tech mt-0.5">{memberEmail}</p>
                  <p className="text-[11px] text-[#00d4ff] font-tech font-mono mt-1">
                    MEMBER ID: <span className="font-bold">{memberId}</span>
                  </p>
                </div>
              </div>

              {/* SCRAP Badge on Card */}
              <div className="bg-[#07070c] border border-[#ffd166]/40 p-3 rounded-lg text-right shrink-0 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                <span className="text-[10px] font-tech text-[#8e8ea0] uppercase">REWARD BALANCE</span>
                <div className="flex items-center space-x-1.5 text-[#ffd166]">
                  <Coins className="w-4 h-4" />
                  <span className="text-base font-tech font-bold">{scrapBalance} SCRAP</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-4 pt-4 border-t border-[#1e1e2d] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-tech">
              <div className="p-2 bg-[#08080d] border border-[#1e1e2d] rounded">
                <span className="text-[#8e8ea0] block text-[10px]">TOTAL BOOKINGS</span>
                <span className="font-bold text-white text-sm">{bookingsCount} Sessions</span>
              </div>
              <div className="p-2 bg-[#08080d] border border-[#1e1e2d] rounded">
                <span className="text-[#8e8ea0] block text-[10px]">MEMBER STATUS</span>
                <span className="font-bold text-[#00ff88] text-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" /> ACTIVE
                </span>
              </div>
              <div className="p-2 bg-[#08080d] border border-[#1e1e2d] rounded col-span-2 sm:col-span-1">
                <span className="text-[#8e8ea0] block text-[10px]">ACTIVE COUPONS</span>
                <span className="font-bold text-[#00d4ff] text-sm">
                  {userCoupons.filter(c => c.status === 'UNUSED').length} Available
                </span>
              </div>
            </div>
          </div>

          {/* Coupons Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#00d4ff]" />
                MY COUPONS & REWARDS
              </h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowScrapModal(true);
                }}
                className="px-3 py-1 bg-[#ffd166]/20 hover:bg-[#ffd166]/30 text-[#ffd166] border border-[#ffd166]/50 rounded text-xs font-tech font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>REDEEM SCRAP</span>
              </button>
            </div>

            {userCoupons.length === 0 ? (
              <div className="p-6 bg-[#12121e] border border-[#2a2a3a] rounded-xl text-center space-y-2">
                <Ticket className="w-8 h-8 text-[#8e8ea0] mx-auto" />
                <p className="text-xs text-[#8e8ea0] font-tech">NO ACTIVE COUPONS FOUND</p>
                <p className="text-xs text-white font-tech">
                  You have <span className="text-[#ffd166] font-bold">{scrapBalance} SCRAP</span> available to redeem rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userCoupons.map(coupon => {
                  const isUnused = coupon.status === 'UNUSED';
                  const isCopied = copiedCode === coupon.coupon_code;

                  return (
                    <div
                      key={coupon.id}
                      className={`p-3.5 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isUnused
                          ? 'border-[#00d4ff]/40 bg-[#12121e] hover:border-[#00d4ff]'
                          : 'border-[#2a2a3a] bg-[#0d0d14] opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-heading font-bold text-white uppercase">
                            {coupon.reward_title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase ${
                              isUnused
                                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                                : 'bg-[#2a2a3a] text-[#8e8ea0]'
                            }`}
                          >
                            {coupon.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8e8ea0] font-tech mt-1 flex items-center space-x-2">
                          <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="font-mono text-xs font-bold text-[#00d4ff] bg-[#07070c] px-3 py-1.5 border border-[#2a2a3a] rounded">
                          {coupon.coupon_code}
                        </span>
                        {isUnused && (
                          <button
                            onClick={() => handleCopy(coupon.coupon_code)}
                            className="px-2.5 py-1.5 bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 text-[#00d4ff] border border-[#00d4ff]/40 rounded text-xs font-tech font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2a2a3a] bg-[#12121e] flex items-center justify-end">
          <button
            onClick={() => setShowProfileModal(false)}
            className="px-5 py-2 bg-[#1e1e2d] hover:bg-[#2a2a3a] text-[#8e8ea0] hover:text-white text-xs font-tech font-bold rounded-lg transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
