import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArena } from '../context/ArenaContext';
import { SCRAP_REWARDS, ScrapReward } from '../data/arenaData';
import { Coins, X, Check, Copy, Monitor, Gamepad2, Utensils, Zap, Ticket } from 'lucide-react';

export const ScrapRewardsModal: React.FC = () => {
  const { profile } = useAuth();
  const { showScrapModal, setShowScrapModal, redeemScrapReward, setShowProfileModal } = useArena();
  
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!showScrapModal) return null;

  const currentScrap = profile?.scrap_balance ?? 1000;

  const handleRedeem = async (reward: ScrapReward) => {
    setErrorMsg(null);
    setRedeemedCode(null);
    setLoadingId(reward.id);

    try {
      const res = await redeemScrapReward(reward);
      if (res.success && res.coupon) {
        setRedeemedCode(res.coupon.coupon_code);
      } else {
        setErrorMsg(res.error || 'Failed to redeem reward.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'pc':
        return <Monitor className="w-6 h-6 text-[#00ff88]" />;
      case 'ps5':
        return <Gamepad2 className="w-6 h-6 text-[#00d4ff]" />;
      case 'food':
        return <Utensils className="w-6 h-6 text-[#ff3366]" />;
      default:
        return <Zap className="w-6 h-6 text-[#ffd166]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#0e0e17] border border-[#2a2a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2a2a3a] bg-[#12121e] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#ffd166]/10 border border-[#ffd166]/40 flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#ffd166]" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-black text-white tracking-wide">
                SCRAP REWARDS STORE
              </h2>
              <p className="text-xs text-[#8e8ea0] font-tech">
                Redeem earned SCRAP for free gaming passes & food credits
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowScrapModal(false);
              setRedeemedCode(null);
              setErrorMsg(null);
            }}
            className="p-1.5 text-[#8e8ea0] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="px-5 py-3 bg-[#08080d] border-b border-[#1e1e2d] flex items-center justify-between">
          <span className="text-xs font-tech text-[#8e8ea0]">CURRENT BALANCE</span>
          <div className="flex items-center space-x-2 bg-[#ffd166]/10 border border-[#ffd166]/40 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-[#ffd166]" />
            <span className="text-sm font-tech font-bold text-[#ffd166]">
              {currentScrap} SCRAP
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Success Coupon Alert */}
          {redeemedCode && (
            <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/50 rounded-xl space-y-3 animate-scale-up">
              <div className="flex items-center space-x-2 text-[#00ff88]">
                <Check className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wide">
                  COUPON GENERATED SUCCESSFULLY!
                </span>
              </div>
              <p className="text-xs text-[#8e8ea0] font-tech">
                Your reward coupon code is ready. Use it during checkout for instant discounts.
              </p>
              <div className="flex items-center space-x-2 bg-[#07070c] border border-[#00ff88]/40 p-2.5 rounded-lg">
                <span className="font-mono text-base font-bold text-[#00ff88] tracking-widest flex-1 text-center">
                  {redeemedCode}
                </span>
                <button
                  onClick={() => handleCopy(redeemedCode)}
                  className="px-3 py-1.5 bg-[#00ff88] hover:bg-[#00e077] text-[#07070c] font-bold text-xs rounded transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-[#ff3366]/10 border border-[#ff3366]/50 rounded-lg text-xs font-tech text-[#ff3366]">
              {errorMsg}
            </div>
          )}

          {/* Rewards Grid */}
          <div className="space-y-3">
            {SCRAP_REWARDS.map(reward => {
              const canAfford = currentScrap >= reward.scrapCost;
              const isLoading = loadingId === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`p-4 border rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    canAfford
                      ? 'border-[#2a2a3a] bg-[#12121e] hover:border-[#ffd166]/50'
                      : 'border-[#2a2a3a]/40 bg-[#12121e]/50 opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-lg bg-[#07070c] border border-[#2a2a3a] shrink-0">
                      {getRewardIcon(reward.rewardType)}
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wide">
                        {reward.title}
                      </h4>
                      <p className="text-xs text-[#8e8ea0] mt-0.5">{reward.description}</p>
                      <span className="inline-block mt-1 text-[11px] font-tech text-[#ffd166]">
                        Cost: {reward.scrapCost} SCRAP
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford || isLoading}
                    onClick={() => handleRedeem(reward)}
                    className={`px-4 py-2 text-xs font-tech font-bold uppercase rounded-lg transition-all shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer ${
                      canAfford
                        ? 'bg-[#ffd166] hover:bg-[#e6bb53] text-[#0a0a0f] shadow-[0_0_12px_rgba(255,209,102,0.3)]'
                        : 'bg-[#2a2a3a] text-[#8e8ea0] cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <span className="animate-spin w-3.5 h-3.5 border-2 border-[#0a0a0f] border-t-transparent rounded-full" />
                    ) : canAfford ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>REDEEM</span>
                      </>
                    ) : (
                      <span>INSUFFICIENT SCRAP</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a3a] bg-[#12121e] flex items-center justify-between">
          <button
            onClick={() => {
              setShowScrapModal(false);
              setShowProfileModal(true);
            }}
            className="text-xs font-tech text-[#00d4ff] hover:underline flex items-center space-x-1.5 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>View My Coupons & Profile →</span>
          </button>

          <button
            onClick={() => setShowScrapModal(false)}
            className="px-4 py-2 bg-[#1e1e2d] hover:bg-[#2a2a3a] text-[#8e8ea0] hover:text-white text-xs font-tech rounded-lg transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
