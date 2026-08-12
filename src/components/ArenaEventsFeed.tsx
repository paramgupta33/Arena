import React, { useState, useRef } from 'react';
import { Trophy, Radio, Calendar, Clock, ChevronLeft, ChevronRight, X, Shield, Gamepad2, Check, Zap, Sparkles } from 'lucide-react';

export interface ArenaEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  description: string;
  tag: string;
  tagColor: 'magenta' | 'cyan' | 'green' | 'gold' | 'purple';
  prizePool?: string;
  location?: string;
  maxParticipants?: string;
  format?: string;
  rules?: string[];
}

export const ARENA_EVENTS: ArenaEvent[] = [
  {
    id: 'event-val-night',
    title: 'VALORANT // NIGHT RAID',
    category: 'COMPETITIVE TOURNAMENT',
    date: 'AUG 16',
    time: '07:00 PM',
    description: '5v5 competitive night with leaderboard rankings and prizes.',
    tag: 'REGISTRATION OPEN',
    tagColor: 'magenta',
    prizePool: '₹15,000 + 2,000 SCRAP',
    location: 'Sphere 1 & Sphere 2 (PC Rigs)',
    maxParticipants: '16 Teams (80 Players)',
    format: 'Single Elimination 5v5 Custom Lobby',
    rules: [
      'Competitive ruleset with map bans',
      'Tournament PC station allocation provided at check-in',
      '15 min warmup period before match start'
    ]
  },
  {
    id: 'event-tekken-king',
    title: 'TEKKEN // KING OF THE ARENA',
    category: 'FIGHTING TOURNAMENT',
    date: 'AUG 18',
    time: '06:00 PM',
    description: 'PS5 Pro tournament with knockout brackets.',
    tag: 'LIMITED SPOTS',
    tagColor: 'cyan',
    prizePool: '₹10,000 + DualSense Controller',
    location: 'Console Lounge (PS5 Pro Stations)',
    maxParticipants: '32 Fighters',
    format: 'Double Elimination Best of 3 / Finals FT3',
    rules: [
      'Bring your own controller or use Arena arcade sticks',
      'Default stage select on match start',
      'Strict 2 min pause timeout penalty rule'
    ]
  },
  {
    id: 'event-fc-champions',
    title: 'FC // CHAMPIONS NIGHT',
    category: 'SPORTS',
    date: 'AUG 21',
    time: '08:00 PM',
    description: 'FC tournament. Bring your squad and climb the leaderboard.',
    tag: 'UPCOMING',
    tagColor: 'green',
    prizePool: '₹8,000 + Food & Drink Vouchers',
    location: 'Console Lounge & VIP Booths',
    maxParticipants: '32 Players (1v1)',
    format: '6-minute halves, Tactical Defending mandatory',
    rules: [
      'Club and National teams permitted',
      'No custom tactics exploits allowed',
      'Direct penalty shootout on tie at full time'
    ]
  },
  {
    id: 'event-aim-protocol',
    title: 'AIM // PRECISION PROTOCOL',
    category: 'CHALLENGE',
    date: 'AUG 23',
    time: '05:00 PM',
    description: 'Beat the highest recorded aim score in the Arena.',
    tag: 'ALL DAY CHALLENGE',
    tagColor: 'gold',
    prizePool: '1,500 SCRAP + Hall of Fame Badge',
    location: 'All PC Stations (Aim Lab Benchmark)',
    maxParticipants: 'Open to all checked-in members',
    format: 'Highest Gridshot / Voltaic Score on Arena PCs',
    rules: [
      'Must log official score with Arena referee on floor',
      'Standard mouse DPI and sensitivity adjustments allowed',
      'Maximum 3 verified attempts per checked-in member'
    ]
  },
  {
    id: 'event-scrap-double-xp',
    title: 'SCRAP // DOUBLE XP WEEKEND',
    category: 'MEMBER EVENT',
    date: 'AUG 24–25',
    description: 'Earn 2× SCRAP from eligible gaming sessions.',
    tag: 'SPECIAL EVENT',
    tagColor: 'purple',
    prizePool: '2x SCRAP Multiplier on All Bookings',
    location: 'Entire Arena Parlour',
    maxParticipants: 'All Active Members',
    format: 'Automatic multiplier applied during checkout',
    rules: [
      'Applies automatically on PC & PS5 sessions',
      'Stackable with Kitchen food order bonuses',
      'Active for 48 hours throughout the weekend'
    ]
  },
  {
    id: 'event-community-night',
    title: 'ARENA // COMMUNITY NIGHT',
    category: 'COMMUNITY',
    date: 'AUG 30',
    time: '06:00 PM',
    description: 'Open gaming, casual matches and community challenges.',
    tag: 'FREE ENTRY',
    tagColor: 'cyan',
    prizePool: 'Free Kitchen Snacks + Raffle Draw',
    location: 'Arena Parlour & Kitchen Lounge',
    maxParticipants: 'Open Floor Capacity',
    format: 'Casual LAN party, party games & minigames',
    rules: [
      'Open to all registered Arena members',
      'Complimentary Kitchen snack buffet included',
      'Community voting for featured LAN party games'
    ]
  }
];

export const ArenaEventsFeed: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<ArenaEvent | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleRegister = (event: ArenaEvent) => {
    setRegisteredEvents(prev => ({ ...prev, [event.id]: true }));
    setToastMsg(`REGISTERED FOR ${event.title}! CHECK YOUR EMAIL / RECEPTION ON ARRIVAL.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getTagStyle = (color: ArenaEvent['tagColor']) => {
    switch (color) {
      case 'magenta':
        return 'bg-[#ff3366]/15 text-[#ff3366] border-[#ff3366]/40 shadow-[0_0_8px_rgba(255,51,102,0.2)]';
      case 'cyan':
        return 'bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]/40 shadow-[0_0_8px_rgba(0,212,255,0.2)]';
      case 'green':
        return 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]';
      case 'gold':
        return 'bg-[#ffd166]/15 text-[#ffd166] border-[#ffd166]/40 shadow-[0_0_8px_rgba(255,209,102,0.2)]';
      case 'purple':
        return 'bg-[#b877ff]/15 text-[#b877ff] border-[#b877ff]/40 shadow-[0_0_8px_rgba(184,119,255,0.2)]';
      default:
        return 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/40';
    }
  };

  return (
    <div className="w-full bg-[#0a0a12] border border-[#2a2a3a] rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
      {/* Background Subtle Cyberpunk Scanline / Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e2d_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d4ff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a2a3a]">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#00d4ff] animate-pulse" />
            <span className="text-xs font-tech font-bold text-[#00d4ff] uppercase tracking-widest">
              TRANSMISSION TERMINAL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide mt-0.5">
            ARENA // EVENTS & TRANSMISSIONS
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8ea0] font-tech mt-0.5">
            Upcoming tournaments, community nights, challenges and special events.
          </p>
        </div>

        {/* Live Feed Indicator Badge & Scroll Controls */}
        <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0">
          <div className="bg-[#0e0e1a] border border-[#00ff88]/40 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
            </span>
            <div className="text-[11px] font-tech leading-tight">
              <span className="text-[#8e8ea0] block text-[9px] uppercase">EVENT FEED</span>
              <span className="text-[#00ff88] font-bold tracking-wider">06 UPCOMING</span>
            </div>
          </div>

          {/* Manual Scroll Arrows for Desktop */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleScroll('left')}
              title="Scroll Left"
              className="p-2 bg-[#12121e] hover:bg-[#1a1a2e] text-[#8e8ea0] hover:text-white border border-[#2a2a3a] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              title="Scroll Right"
              className="p-2 bg-[#12121e] hover:bg-[#1a1a2e] text-[#8e8ea0] hover:text-white border border-[#2a2a3a] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="mt-3 p-3 bg-[#00ff88]/15 border border-[#00ff88] rounded-lg text-xs font-tech text-[#00ff88] flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#00ff88]" />
            <span className="font-bold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-[#8e8ea0] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Events Scrollable Cards Container */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 mt-5 flex items-stretch space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-[#2a2a3a] scrollbar-track-[#0a0a12] snap-x snap-mandatory touch-pan-x"
        style={{ scrollbarWidth: 'thin' }}
      >
        {ARENA_EVENTS.map(event => {
          const isRegistered = registeredEvents[event.id];

          return (
            <div
              key={event.id}
              className="w-[280px] sm:w-[320px] shrink-0 bg-[#0e0e1a]/90 hover:bg-[#121224] border border-[#2a2a3a] hover:border-[#00d4ff]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] snap-start relative overflow-hidden"
            >
              {/* Top Card Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent group-hover:via-[#00ff88]" />

              {/* Event Category & Status Tag */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-tech font-bold text-[#8e8ea0] uppercase tracking-wider truncate">
                    {event.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-tech font-bold uppercase border rounded ${getTagStyle(
                      event.tagColor
                    )}`}
                  >
                    {event.tag}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-sm sm:text-base font-heading font-black text-white tracking-wide uppercase group-hover:text-[#00d4ff] transition-colors leading-snug">
                  {event.title}
                </h3>

                {/* Date & Time Badge */}
                <div className="mt-2.5 inline-flex items-center space-x-2 bg-[#07070e] px-2.5 py-1 border border-[#1e1e2d] rounded text-xs font-tech text-[#ffd166]">
                  <Calendar className="w-3.5 h-3.5 text-[#ffd166]" />
                  <span className="font-bold">{event.date}</span>
                  {event.time && (
                    <>
                      <span className="text-[#8e8ea0]">•</span>
                      <Clock className="w-3.5 h-3.5 text-[#8e8ea0]" />
                      <span className="text-[#e0e0e0]">{event.time}</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-[#8e8ea0] font-tech leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              </div>

              {/* Bottom Action Area */}
              <div className="mt-5 pt-3 border-t border-[#1e1e2d] flex items-center justify-between gap-2">
                {isRegistered ? (
                  <span className="text-[11px] font-tech font-bold text-[#00ff88] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> REGISTERED
                  </span>
                ) : (
                  <span className="text-[10px] font-tech text-[#8e8ea0]">
                    {event.prizePool ? `PRIZE: ${event.prizePool.split('+')[0]}` : 'ARENA PARLOUR'}
                  </span>
                )}

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="px-3 py-1.5 bg-[#1a1a2e] hover:bg-[#00d4ff]/20 text-[#00d4ff] hover:text-white border border-[#00d4ff]/30 hover:border-[#00d4ff] rounded text-[11px] font-tech font-bold uppercase transition-all duration-200 cursor-pointer flex items-center space-x-1"
                >
                  <span>VIEW DETAILS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Footer Indicator */}
      <div className="mt-4 pt-3 border-t border-[#1e1e2d] flex items-center justify-between text-[11px] font-tech text-[#8e8ea0]">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span>TRANSMISSION FEED ACTIVE // UPDATED LIVE AT ARENA PARLOUR</span>
        </div>
        <span className="hidden sm:inline text-[#00d4ff] font-mono">ENCRYPTED PROTOCOL V2.4</span>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg bg-[#0e0e17] border border-[#2a2a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#2a2a3a] bg-[#12121e] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/40 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#00d4ff]" />
                </div>
                <div>
                  <span className="text-[10px] font-tech text-[#00d4ff] font-bold uppercase">
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-base font-heading font-black text-white tracking-wide uppercase">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-[#8e8ea0] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-tech">
              {/* Event Key Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#07070c] border border-[#1e1e2d] rounded-lg">
                <div>
                  <span className="text-[#8e8ea0] block text-[10px]">DATE & TIME</span>
                  <span className="text-white font-bold">{selectedEvent.date} {selectedEvent.time ? `• ${selectedEvent.time}` : ''}</span>
                </div>
                <div>
                  <span className="text-[#8e8ea0] block text-[10px]">PARLOUR LOCATION</span>
                  <span className="text-[#00d4ff] font-bold">{selectedEvent.location || 'Arena Main Floor'}</span>
                </div>
                {selectedEvent.prizePool && (
                  <div>
                    <span className="text-[#8e8ea0] block text-[10px]">PRIZE POOL / REWARD</span>
                    <span className="text-[#ffd166] font-bold">{selectedEvent.prizePool}</span>
                  </div>
                )}
                {selectedEvent.maxParticipants && (
                  <div>
                    <span className="text-[#8e8ea0] block text-[10px]">CAPACITY</span>
                    <span className="text-[#00ff88] font-bold">{selectedEvent.maxParticipants}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[#8e8ea0] uppercase text-[10px] tracking-wider mb-1">EVENT OVERVIEW</h4>
                <p className="text-[#e0e0e0] leading-relaxed bg-[#12121e] p-3 border border-[#1e1e2d] rounded-lg">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Format */}
              {selectedEvent.format && (
                <div>
                  <h4 className="text-[#8e8ea0] uppercase text-[10px] tracking-wider mb-1">TOURNAMENT FORMAT</h4>
                  <p className="text-[#00d4ff] font-bold bg-[#12121e] p-2.5 border border-[#1e1e2d] rounded-lg">
                    {selectedEvent.format}
                  </p>
                </div>
              )}

              {/* Rules */}
              {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                <div>
                  <h4 className="text-[#8e8ea0] uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#00ff88]" /> ARENA RULES & CONDITIONS
                  </h4>
                  <ul className="space-y-1.5 bg-[#12121e] p-3 border border-[#1e1e2d] rounded-lg text-[#8e8ea0]">
                    {selectedEvent.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#00ff88] font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#2a2a3a] bg-[#12121e] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-[#1e1e2d] hover:bg-[#2a2a3a] text-[#8e8ea0] hover:text-white text-xs font-tech rounded-lg transition-colors cursor-pointer"
              >
                CLOSE
              </button>

              <button
                onClick={() => {
                  handleRegister(selectedEvent);
                  setSelectedEvent(null);
                }}
                className={`px-5 py-2 text-xs font-tech font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  registeredEvents[selectedEvent.id]
                    ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50'
                    : 'bg-[#00d4ff] hover:bg-[#00b8e6] text-[#07070c] shadow-[0_0_12px_rgba(0,212,255,0.3)]'
                }`}
              >
                {registeredEvents[selectedEvent.id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>REGISTERED</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>REGISTER FOR EVENT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
