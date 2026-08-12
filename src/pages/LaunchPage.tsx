import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Button } from '../components/Button';
import { GlitchText } from '../components/GlitchText';
import { Panel } from '../components/Panel';
import { ArenaCore3D } from '../components/3d/ArenaCore3D';
import { soundEffects } from '../lib/audio';
import { Terminal, Shield, Zap, ChevronRight, Activity } from 'lucide-react';

export const LaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const [initLogs, setInitLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const logs = [
      'INITIALIZING ARENA CORE MATRIX...',
      'CHECKING GRAPHICS ACCELERATION... OK',
      'CALIBRATING SPHERE 01 & 02 NODES...',
      'SYNCING TITAN AI RIGS... ONLINE',
      'ESTABLISHING NEURAL FEED... READY'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setInitLogs(prev => [...prev, logs[current]]);
        soundEffects.hover();
        current++;
      } else {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    soundEffects.enter();
    navigate('/arena');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex flex-col justify-between p-6 bg-tech-grid relative overflow-hidden">
      
      {/* Background Ambient Glowing Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00ff88]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#00d4ff]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-4 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#00ff88] animate-ping rounded-full" />
          <span className="font-tech text-xs tracking-widest text-[#00ff88]">
            ARENA OS v2.4.9
          </span>
        </div>
        <div className="flex items-center space-x-4 font-tech text-xs text-[#6b7280]">
          <span className="hidden sm:inline">LOC: SECTOR 7-G</span>
          <span className="text-[#00d4ff]">STATUS: ONLINE</span>
        </div>
      </div>

      {/* Center Hero Section */}
      <main className="max-w-4xl mx-auto my-auto w-full flex flex-col items-center text-center z-10 py-12">
        
        {/* 3D ARENA Core Canvas */}
        <div className="w-64 h-64 md:w-80 md:h-80 my-4 relative">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <ArenaCore3D />
          </Canvas>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-tech text-[10px] text-[#6b7280] tracking-widest uppercase">
            [ CORE STABILIZER ]
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <GlitchText
            text="ARENA"
            className="text-5xl md:text-7xl font-black tracking-[0.25em] text-[#00ff88]"
          />
          <p className="font-tech text-sm md:text-base text-[#00d4ff] tracking-widest mt-2 uppercase">
            CYBERPUNK COMPETITIVE GAMING FACILITY
          </p>
        </div>

        {/* System Initialization Console Panel */}
        <Panel className="w-full max-w-lg mb-8 text-left bg-[#12121a]/90 backdrop-blur-md border-[#2a2a3a]">
          <div className="flex items-center justify-between mb-2 text-xs font-tech text-[#6b7280]">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>SYSTEM INITIALIZATION</span>
            </div>
            <span className="text-[#00ff88]">
              {isReady ? '100% COMPLETE' : 'BOOTING...'}
            </span>
          </div>

          <div className="font-mono text-xs text-[#00ff88]/90 space-y-1 bg-[#0a0a0f] p-3 border border-[#2a2a3a] h-28 overflow-y-auto clip-chamfer-sm">
            {initLogs.map((log, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-[#6b7280]">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
            {!isReady && (
              <div className="inline-block w-2 h-3 bg-[#00ff88] animate-pulse ml-1" />
            )}
          </div>
        </Panel>

        {/* Primary Enter Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleEnter}
          disabled={!isReady}
          className="text-lg px-10 py-4 shadow-[0_0_25px_rgba(0,255,136,0.3)] animate-pulse hover:animate-none"
          icon={<ChevronRight className="w-5 h-5 ml-1" />}
        >
          [ ENTER ARENA ]
        </Button>

      </main>

      {/* Footer System Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full pt-4 border-t border-[#2a2a3a] z-10 text-xs font-tech text-[#6b7280]">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#00ff88]" />
          <div>
            <div className="text-[#e0e0e0]">ULTRA-LOW LATENCY</div>
            <div className="text-[10px]">0.8ms Fiber Grid</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#00d4ff]" />
          <div>
            <div className="text-[#e0e0e0]">RTX 5090 RIGS</div>
            <div className="text-[10px]">540Hz QD-OLED</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#ffd166]" />
          <div>
            <div className="text-[#e0e0e0]">TITAN APEX VAULT</div>
            <div className="text-[10px]">Private VIP Suites</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#ff00ff]" />
          <div>
            <div className="text-[#e0e0e0]">CYBER LOUNGE</div>
            <div className="text-[10px]">Refuel & Streams</div>
          </div>
        </div>
      </div>

    </div>
  );
};
