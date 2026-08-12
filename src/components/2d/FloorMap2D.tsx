import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArena } from '../../context/ArenaContext';
import { Monitor, Gamepad2, Utensils, HelpCircle, LogOut } from 'lucide-react';

interface FloorMap2DProps {
  onRoomSelect?: (roomId: string) => void;
}

export const FloorMap2D: React.FC<FloorMap2DProps> = ({ onRoomSelect }) => {
  const { rooms, hoveredRoomId, setHoveredRoomId, selectRoom, setShowExitModal } = useArena();
  const navigate = useNavigate();

  const handleRoomClick = (roomId: string) => {
    if (onRoomSelect) {
      onRoomSelect(roomId);
      return;
    }
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

  const getRoom = (id: string) => rooms.find(r => r.id === id);

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-[#0e0e17] border border-[#2a2a3a] rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2a3a]">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#e0e0e0] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
            ARENA Floor Blueprint (2D View)
          </h2>
          <p className="text-xs text-[#8e8ea0] mt-0.5">Click any room to view availability and station details.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-tech">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#00ff88]/20 border border-[#00ff88] rounded-sm"></span> Available</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#ff3366]/20 border border-[#ff3366] rounded-sm"></span> Occupied / Exit</div>
        </div>
      </div>

      {/* Grid Floor Layout */}
      <div className="grid grid-cols-12 gap-3 p-4 bg-[#08080c] border border-[#1e1e2d] rounded-lg">
        
        {/* TOP ROW: Exit & Reception */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-3 mb-1">
          {/* Exit Gate on Left */}
          <button
            onClick={() => handleRoomClick('entry')}
            onMouseEnter={() => setHoveredRoomId('entry')}
            onMouseLeave={() => setHoveredRoomId(null)}
            className={`col-span-1 sm:col-span-3 p-3 text-left border rounded-lg transition-all flex items-center justify-between cursor-pointer ${
              hoveredRoomId === 'entry' ? 'border-[#ff3366] bg-[#ff3366]/10' : 'border-[#2a2a3a] bg-[#12121e]'
            }`}
          >
            <div>
              <div className="text-sm font-heading font-bold text-[#ff3366] flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> EXIT
              </div>
              <p className="text-xs text-[#8e8ea0] mt-0.5">Leave ARENA</p>
            </div>
            <span className="text-[10px] bg-[#ff3366]/20 text-[#ff3366] px-2 py-0.5 rounded font-tech">SIGN OUT</span>
          </button>

          {/* Reception Room at the Top */}
          <button
            onClick={() => handleRoomClick('reception')}
            onMouseEnter={() => setHoveredRoomId('reception')}
            onMouseLeave={() => setHoveredRoomId(null)}
            className={`col-span-1 sm:col-span-9 p-3 border rounded-lg transition-all flex items-center justify-between cursor-pointer ${
              hoveredRoomId === 'reception' ? 'border-[#00d4ff] bg-[#00d4ff]/10' : 'border-[#2a2a3a] bg-[#12121e]'
            }`}
          >
            <div>
              <div className="text-sm font-heading font-bold text-[#e0e0e0] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00d4ff]" /> RECEPTION
              </div>
              <p className="text-xs text-[#8e8ea0] mt-0.5">Helpdesk, enquiries & tournament notices</p>
            </div>
            <span className="text-xs font-tech bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40 px-2.5 py-1 rounded">
              Helpdesk →
            </span>
          </button>
        </div>

        {/* MIDDLE ROW: Spheres 1, 2, and Elite */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
          {['sphere1', 'sphere2', 'elite'].map(id => {
            const r = getRoom(id);
            if (!r) return null;
            const isHovered = hoveredRoomId === id;
            return (
              <button
                key={id}
                onClick={() => handleRoomClick(id)}
                onMouseEnter={() => setHoveredRoomId(id)}
                onMouseLeave={() => setHoveredRoomId(null)}
                className={`p-4 border rounded-xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-lg shadow-[#00ff88]/5 scale-[1.01]'
                    : 'border-[#2a2a3a] bg-[#12121e] hover:border-[#00ff88]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#e0e0e0]">{r.name}</h3>
                  </div>
                  <Monitor className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e2d] flex items-center justify-between text-xs">
                  <span className="text-[#8e8ea0]">{r.capacity} Stations</span>
                  <span className="font-tech text-[#00ff88] font-semibold">{r.summary}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* BOTTOM ROW: Lounge and Kitchen */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Lounge */}
          {(() => {
            const r = getRoom('lounge');
            if (!r) return null;
            const isHovered = hoveredRoomId === 'lounge';
            return (
              <button
                onClick={() => handleRoomClick('lounge')}
                onMouseEnter={() => setHoveredRoomId('lounge')}
                onMouseLeave={() => setHoveredRoomId(null)}
                className={`p-4 border rounded-xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10 shadow-lg scale-[1.01]'
                    : 'border-[#2a2a3a] bg-[#12121e] hover:border-[#00d4ff]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#e0e0e0]">{r.name}</h3>
                  </div>
                  <Gamepad2 className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e2d] flex items-center justify-between text-xs">
                  <span className="text-[#8e8ea0]">{r.capacity} Stations</span>
                  <span className="font-tech text-[#00d4ff] font-semibold">{r.summary}</span>
                </div>
              </button>
            );
          })()}

          {/* Kitchen */}
          {(() => {
            const r = getRoom('kitchen');
            if (!r) return null;
            const isHovered = hoveredRoomId === 'kitchen';
            return (
              <button
                onClick={() => handleRoomClick('kitchen')}
                onMouseEnter={() => setHoveredRoomId('kitchen')}
                onMouseLeave={() => setHoveredRoomId(null)}
                className={`p-4 border rounded-xl transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'border-[#ff3366] bg-[#ff3366]/10 shadow-lg scale-[1.01]'
                    : 'border-[#2a2a3a] bg-[#12121e] hover:border-[#ff3366]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#e0e0e0]">{r.name}</h3>
                  </div>
                  <Utensils className="w-5 h-5 text-[#ff3366]" />
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e2d] flex items-center justify-between text-xs">
                  <span className="text-[#8e8ea0]">Fresh Food & Drinks</span>
                  <span className="font-tech text-[#ff3366] font-semibold">Order Menu →</span>
                </div>
              </button>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
