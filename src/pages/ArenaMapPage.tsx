import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { FloorMap2D } from '../components/2d/FloorMap2D';
import { Scene3D } from '../components/3d/Scene3D';
import { ArenaEventsFeed } from '../components/ArenaEventsFeed';
import { Box, LayoutGrid, MousePointerClick } from 'lucide-react';

export const ArenaMapPage: React.FC = () => {
  const { mapMode, setMapMode, selectRoom, showExitModal, setShowExitModal, updateRealTimeRoomAvailability } = useArena();
  const navigate = useNavigate();

  useEffect(() => {
    updateRealTimeRoomAvailability();
  }, [updateRealTimeRoomAvailability]);

  const handleRoomSelect = (roomId: string) => {
    if (showExitModal) return;
    selectRoom(roomId);
    if (roomId === 'entry') {
      setShowExitModal(true);
    } else if (roomId === 'kitchen') {
      navigate('/kitchen');
    } else if (roomId === 'reception') {
      navigate('/reception');
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header Row with Map Title & Segmented View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a3a]/60 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-ping" />
            <span className="text-xs font-tech text-[#00ff88] uppercase tracking-wider font-bold">
              LIVE ARENA PARLOUR FLOOR PLAN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white tracking-wide mt-1">
            ARENA PARLOUR FLOOR MAP
          </h1>
          <p className="text-xs sm:text-sm text-[#8e8ea0] mt-1 font-tech flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4 text-[#00ff88]" />
            <span>Click or tap any zone to explore station specs, availability, and instant booking.</span>
          </p>
        </div>

        {/* Page-level Segmented Control for 2D / 3D View Switcher */}
        <div className="inline-flex items-center bg-[#0e0e17] p-1 border border-[#2a2a3a] rounded-lg shadow-inner select-none self-start sm:self-center">
          <button
            onClick={() => setMapMode('2d')}
            title="Switch to 2D Plan Layout"
            className={`px-3.5 py-2 text-xs font-tech flex items-center space-x-2 transition-all duration-200 rounded-md cursor-pointer ${
              mapMode === '2d'
                ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/50 font-bold shadow-[0_0_12px_rgba(0,212,255,0.25)]'
                : 'text-[#8e8ea0] hover:text-[#e0e0e0] border border-transparent hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>2D BLUEPRINT</span>
          </button>

          <button
            onClick={() => setMapMode('3d')}
            title="Switch to 3D Interactive Floor View"
            className={`px-3.5 py-2 text-xs font-tech flex items-center space-x-2 transition-all duration-200 rounded-md cursor-pointer ${
              mapMode === '3d'
                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 font-bold shadow-[0_0_12px_rgba(0,255,136,0.25)]'
                : 'text-[#8e8ea0] hover:text-[#e0e0e0] border border-transparent hover:bg-white/5'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D VIEWPORT</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div
        className={`floor-map w-full max-w-full relative z-[1] transition-all ${
          showExitModal ? 'pointer-events-none select-none opacity-80' : 'pointer-events-auto'
        }`}
      >
        {mapMode === '3d' ? (
          <div className="w-full max-w-full overflow-x-auto overflow-y-hidden touch-pan-x rounded-xl border border-[#2a2a3a] bg-[#07070c] shadow-2xl">
            <div className="min-w-[700px] md:min-w-full h-[520px] sm:h-[600px] lg:h-[650px] relative">
              <Scene3D onRoomSelect={handleRoomSelect} />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-[#0a0a0f]/90 border border-[#2a2a3a] px-3 py-2 rounded-lg text-xs font-tech text-[#8e8ea0] backdrop-blur-md max-w-[90%] flex items-center space-x-2">
                <span className="text-[#00ff88] font-bold">3D CONTROLS:</span>
                <span className="hidden sm:inline">Left-Click + Drag to Orbit | Scroll to Zoom | Click Zone to Enter</span>
                <span className="sm:hidden">Swipe to Rotate | Pinch to Zoom | Tap Zone to Enter</span>
              </div>
            </div>
          </div>
        ) : (
          <FloorMap2D onRoomSelect={handleRoomSelect} />
        )}
      </div>

      {/* Cyberpunk Events & Transmissions Feed Section */}
      <div className="pt-2">
        <ArenaEventsFeed />
      </div>

    </div>
  );
};


