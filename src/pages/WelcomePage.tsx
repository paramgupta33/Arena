import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Terminal, ArrowRight, Coins } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'GAMER';

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    const timer = setTimeout(() => {
      navigate('/arena');
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center p-4 relative overflow-hidden font-tech">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-[#00ff88]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#0d0d14] border-2 border-[#00ff88] p-8 rounded-xl shadow-[0_0_40px_rgba(0,255,136,0.25)] relative z-10 space-y-6 text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#00ff88]/30">
          <ShieldCheck className="w-8 h-8 text-[#00ff88]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-[#00ff88] uppercase tracking-[0.2em] animate-pulse">
            [ ACCESS GRANTED ]
          </div>
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
            WELCOME, {displayName}
          </h1>
          <p className="text-xs text-[#8e8ea0] font-mono">
            ARENA PARLOUR USER SESSION INITIALIZED
          </p>
        </div>

        {/* Balance Display */}
        <div className="bg-[#12121e] border border-[#2a2a3a] p-3 rounded-lg flex items-center justify-between text-xs font-mono">
          <span className="text-[#8e8ea0] flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#ffd166]" /> SCRAP Balance:
          </span>
          <span className="text-sm font-bold text-[#ffd166]">{profile?.scrap_balance ?? 1000} SCRAP</span>
        </div>

        {/* Initialization Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#00d4ff]">
            <span>SYSTEM INITIALIZATION{dots}</span>
            <span>READY</span>
          </div>
          <div className="w-full bg-[#12121e] h-2 rounded-full overflow-hidden border border-[#2a2a3a]">
            <div className="bg-[#00ff88] h-full animate-[pulse_1s_infinite] w-full transition-all duration-1000" />
          </div>
        </div>

        <button
          onClick={() => navigate('/arena')}
          className="w-full py-3 bg-[#00ff88] hover:bg-[#00cc6d] text-black font-heading font-black tracking-widest text-xs uppercase rounded transition-all shadow-lg shadow-[#00ff88]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ENTER ARENA FLOOR MAP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
