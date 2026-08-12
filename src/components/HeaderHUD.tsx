import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import { Box, HelpCircle, Gamepad2, LogOut, Coins, CalendarCheck, Utensils, User, Zap } from 'lucide-react';
import { ScrapRewardsModal } from './ScrapRewardsModal';
import { UserProfileModal } from './UserProfileModal';

export const HeaderHUD: React.FC = () => {
  const { setShowExitModal, activeSession, setShowScrapModal, setShowProfileModal } = useArena();
  const { profile, user } = useAuth();
  const location = useLocation();

  const memberName = profile?.full_name || user?.email?.split('@')[0] || 'PARAM';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a3a]">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Left: Branding & Navigation */}
          <div className="flex items-center space-x-4 xl:space-x-6">
            <Link to="/arena" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-8 h-8 bg-[#00ff88]/10 border border-[#00ff88] flex items-center justify-center rounded clip-chamfer-sm group-hover:bg-[#00ff88]/20 transition-all">
                <Gamepad2 className="w-4 h-4 text-[#00ff88]" />
              </div>
              <div>
                <span className="font-heading font-black text-lg tracking-wider text-[#e0e0e0] group-hover:text-[#00ff88] transition-colors">
                  ARENA
                </span>
                <span className="hidden xl:inline-block ml-2 text-[10px] font-tech text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 border border-[#00d4ff]/30 rounded">
                  GAMING PARLOUR
                </span>
              </div>
            </Link>

            {/* Navigation Links according to Requirement 22 */}
            <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 pl-4 border-l border-[#2a2a3a]">
              <Link
                to="/arena"
                className={`px-3 py-1.5 text-xs font-tech uppercase rounded transition-all flex items-center space-x-1.5 ${
                  location.pathname === '/arena' || location.pathname === '/dashboard'
                    ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 font-bold'
                    : 'text-[#9ca3af] hover:text-[#e0e0e0] hover:bg-[#12121a]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Floor Map</span>
              </Link>

              <Link
                to="/bookings"
                className={`px-3 py-1.5 text-xs font-tech uppercase rounded transition-all flex items-center space-x-1.5 relative ${
                  location.pathname === '/bookings'
                    ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 font-bold'
                    : 'text-[#9ca3af] hover:text-[#e0e0e0] hover:bg-[#12121a]'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>My Bookings</span>
                {activeSession && (
                  <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping absolute top-1 right-1" />
                )}
              </Link>

              <Link
                to="/kitchen"
                className={`px-3 py-1.5 text-xs font-tech uppercase rounded transition-all flex items-center space-x-1.5 ${
                  location.pathname === '/kitchen'
                    ? 'bg-[#ff3366]/15 text-[#ff3366] border border-[#ff3366]/40 font-bold'
                    : 'text-[#9ca3af] hover:text-[#e0e0e0] hover:bg-[#12121a]'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Kitchen</span>
              </Link>

              <Link
                to="/reception"
                className={`px-3 py-1.5 text-xs font-tech uppercase rounded transition-all flex items-center space-x-1.5 ${
                  location.pathname === '/reception'
                    ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/40 font-bold'
                    : 'text-[#9ca3af] hover:text-[#e0e0e0] hover:bg-[#12121a]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Helpdesk</span>
              </Link>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Active Session Indicator Badge */}
            {activeSession && (
              <Link
                to="/bookings"
                className="hidden xl:flex items-center space-x-1.5 bg-[#00ff88]/10 border border-[#00ff88] px-2.5 py-1 rounded text-[11px] font-tech text-[#00ff88] hover:bg-[#00ff88]/20 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
                <span>ACTIVE SESSION</span>
              </Link>
            )}

            {/* SCRAP Balance Button (Clickable -> Opens SCRAP Rewards Modal) */}
            {user && (
              <button
                onClick={() => setShowScrapModal(true)}
                title="Open SCRAP Rewards Store"
                className="flex items-center space-x-1.5 bg-[#12121a] hover:bg-[#ffd166]/10 px-2.5 sm:px-3 py-1.5 border border-[#ffd166]/40 hover:border-[#ffd166] rounded text-xs font-tech text-[#ffd166] transition-all cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-[#ffd166]" />
                <span className="font-bold">{profile?.scrap_balance ?? 1000} SCRAP</span>
              </button>
            )}

            {/* MEMBER PROFILE Button (Clickable -> Opens Profile Modal) */}
            {user && (
              <button
                onClick={() => setShowProfileModal(true)}
                title="Open Member Profile Card"
                className="flex items-center space-x-1.5 bg-[#12121a] hover:bg-[#00ff88]/10 px-2.5 sm:px-3 py-1.5 border border-[#00ff88]/40 hover:border-[#00ff88] rounded text-xs font-tech text-[#00ff88] transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="hidden sm:inline font-bold uppercase">{memberName.split(' ')[0]}</span>
              </button>
            )}

            <button
              onClick={() => setShowExitModal(true)}
              className="text-[11px] sm:text-xs font-tech text-[#ff3366] hover:text-white px-2.5 sm:px-3 py-1.5 border border-[#ff3366]/40 hover:bg-[#ff3366]/20 transition-all rounded flex items-center gap-1 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">EXIT</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-[#1e1e2d] bg-[#07070c] py-2 px-3 text-[11px] font-tech text-[#9ca3af] overflow-x-auto whitespace-nowrap space-x-2">
          <Link
            to="/arena"
            className={`px-2.5 py-1 rounded flex items-center gap-1 ${
              location.pathname === '/arena' || location.pathname === '/dashboard'
                ? 'text-[#00ff88] font-bold bg-[#00ff88]/10'
                : 'hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Floor Map</span>
          </Link>

          <Link
            to="/bookings"
            className={`px-2.5 py-1 rounded flex items-center gap-1 ${
              location.pathname === '/bookings'
                ? 'text-[#00ff88] font-bold bg-[#00ff88]/10'
                : 'hover:text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Bookings</span>
          </Link>

          <Link
            to="/kitchen"
            className={`px-2.5 py-1 rounded flex items-center gap-1 ${
              location.pathname === '/kitchen'
                ? 'text-[#ff3366] font-bold bg-[#ff3366]/10'
                : 'hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Kitchen</span>
          </Link>

          <Link
            to="/reception"
            className={`px-2.5 py-1 rounded flex items-center gap-1 ${
              location.pathname === '/reception'
                ? 'text-[#00d4ff] font-bold bg-[#00d4ff]/10'
                : 'hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Helpdesk</span>
          </Link>

          <button
            onClick={() => setShowProfileModal(true)}
            className="px-2.5 py-1 rounded text-[#00ff88] bg-[#00ff88]/10 font-bold flex items-center gap-1 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </header>

      {/* Render Modals */}
      <ScrapRewardsModal />
      <UserProfileModal />
    </>
  );
};

