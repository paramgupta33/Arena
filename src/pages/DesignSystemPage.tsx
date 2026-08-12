import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderHUD } from '../components/HeaderHUD';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';
import { StatusBadge } from '../components/StatusBadge';
import { GlitchText } from '../components/GlitchText';
import { Terminal, Shield, ArrowLeft, CheckCircle, AlertTriangle, Zap, Cpu } from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex flex-col">
      
      {/* Top HUD */}
      <HeaderHUD />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-[#00ff88]" />
              <GlitchText
                text="ARENA DESIGN SYSTEM"
                className="text-2xl font-black text-[#00ff88]"
              />
            </div>
            <p className="font-tech text-xs text-[#6b7280]">
              CYBERPUNK TECHNICAL VISUAL IDENTITY SPECIFICATION
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/arena')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            RETURN TO MAP
          </Button>
        </div>

        {/* 1. Colors Section */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm uppercase tracking-widest text-[#00d4ff] flex items-center">
            <span className="w-2 h-2 bg-[#00d4ff] mr-2" />
            1. CENTRALIZED COLOR PALETTE
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-tech text-xs">
            
            <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] clip-chamfer-sm">
              <div className="w-full h-8 bg-[#0a0a0f] border border-[#2a2a3a] mb-2" />
              <div className="text-[#e0e0e0]">BACKGROUND</div>
              <div className="text-[#6b7280] text-[10px]">#0a0a0f</div>
            </div>

            <div className="bg-[#12121a] p-3 border border-[#2a2a3a] clip-chamfer-sm">
              <div className="w-full h-8 bg-[#12121a] border border-[#2a2a3a] mb-2" />
              <div className="text-[#e0e0e0]">PANEL</div>
              <div className="text-[#6b7280] text-[10px]">#12121a</div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#00ff88]/40 clip-chamfer-sm">
              <div className="w-full h-8 bg-[#00ff88] mb-2" />
              <div className="text-[#00ff88] font-bold">ELECTRIC GREEN</div>
              <div className="text-[#6b7280] text-[10px]">#00ff88</div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#00d4ff]/40 clip-chamfer-sm">
              <div className="w-full h-8 bg-[#00d4ff] mb-2" />
              <div className="text-[#00d4ff] font-bold">ELECTRIC CYAN</div>
              <div className="text-[#6b7280] text-[10px]">#00d4ff</div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#ff00ff]/40 clip-chamfer-sm">
              <div className="w-full h-8 bg-[#ff00ff] mb-2" />
              <div className="text-[#ff00ff] font-bold">MAGENTA</div>
              <div className="text-[#6b7280] text-[10px]">#ff00ff</div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#ffd166]/40 clip-chamfer-sm">
              <div className="w-full h-8 bg-[#ffd166] mb-2" />
              <div className="text-[#ffd166] font-bold">GOLD / RED</div>
              <div className="text-[#6b7280] text-[10px]">#ffd166 / #ff3366</div>
            </div>

          </div>
        </section>

        {/* 2. Typography Showcase */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm uppercase tracking-widest text-[#00d4ff] flex items-center">
            <span className="w-2 h-2 bg-[#00d4ff] mr-2" />
            2. TYPOGRAPHY HIERARCHY
          </h3>

          <Panel title="FONT FAMILIES DEMONSTRATION">
            <div className="space-y-4">
              
              <div className="pb-3 border-b border-[#2a2a3a]">
                <div className="font-tech text-xs text-[#00ff88] mb-1">MAJOR HEADINGS — ORBITRON</div>
                <h1 className="font-heading text-2xl md:text-3xl font-black tracking-widest text-[#e0e0e0]">
                  SYSTEM INITIALIZATION COMPLETE [SPHERE 01]
                </h1>
              </div>

              <div className="pb-3 border-b border-[#2a2a3a]">
                <div className="font-tech text-xs text-[#00d4ff] mb-1">TECHNICAL UI — SHARE TECH MONO</div>
                <p className="font-tech text-sm text-[#00d4ff] tracking-wider">
                  TEL: 10Gbps SYMMETRIC // RIG: RTX 5090 // TEMP: 42°C CRYOLIQ
                </p>
              </div>

              <div>
                <div className="font-tech text-xs text-[#6b7280] mb-1">BODY / TERMINAL — JETBRAINS MONO</div>
                <p className="font-body text-sm text-[#e0e0e0]">
                  ARENA uses a cyberpunk chamfered technical layout. Scanline overlays, high-contrast neon emissive accents, and low-latency audio feedback drive user engagement.
                </p>
              </div>

            </div>
          </Panel>
        </section>

        {/* 3. Reusable Button Controls */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm uppercase tracking-widest text-[#00d4ff] flex items-center">
            <span className="w-2 h-2 bg-[#00d4ff] mr-2" />
            3. TECHNICAL SYSTEM BUTTONS
          </h3>

          <Panel title="BUTTON VARIANTS & CORNER CHAMFERS">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" icon={<Zap className="w-4 h-4" />}>
                PRIMARY GREEN
              </Button>

              <Button variant="secondary" icon={<Shield className="w-4 h-4" />}>
                SECONDARY CYAN
              </Button>

              <Button variant="special" icon={<Cpu className="w-4 h-4" />}>
                SPECIAL MAGENTA
              </Button>

              <Button variant="danger" icon={<AlertTriangle className="w-4 h-4" />}>
                DANGER RED
              </Button>

              <Button variant="outline" icon={<CheckCircle className="w-4 h-4" />}>
                OUTLINE TECHNICAL
              </Button>

              <Button variant="muted">
                MUTED CONTROL
              </Button>
            </div>
          </Panel>
        </section>

        {/* 4. Panels & Status Badges */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm uppercase tracking-widest text-[#00d4ff] flex items-center">
            <span className="w-2 h-2 bg-[#00d4ff] mr-2" />
            4. TECHNICAL PANELS & STATUS BADGES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Panel title="GREEN GLOW PANEL" code="SPH-01" glowColor="green">
              <p className="font-body text-xs text-[#6b7280] mb-3">
                Chamfered corner panel with green glowing border accent and technical top notches.
              </p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label="ACTIVE GRID" status="active" />
                <StatusBadge label="10/10 FULL" status="full" />
                <StatusBadge label="APEX VIP" status="vip" />
              </div>
            </Panel>

            <Panel title="CYAN GLOW PANEL" code="HQ-01" glowColor="cyan">
              <p className="font-body text-xs text-[#6b7280] mb-3">
                Chamfered panel with cyan border accent and live telemetry indicators.
              </p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label="ONLINE" status="active" />
                <StatusBadge label="WARNING" status="warning" />
                <StatusBadge label="OFFLINE" status="maintenance" />
              </div>
            </Panel>

          </div>
        </section>

        {/* 5. Glitch Effect */}
        <section className="space-y-3">
          <h3 className="font-heading text-sm uppercase tracking-widest text-[#00d4ff] flex items-center">
            <span className="w-2 h-2 bg-[#00d4ff] mr-2" />
            5. RGB SPLIT GLITCH TEXT EFFECT
          </h3>

          <Panel className="text-center p-8">
            <GlitchText
              text="SYSTEM GLITCH OVERRIDE"
              className="text-3xl md:text-5xl font-black text-[#00ff88]"
            />
            <p className="font-tech text-xs text-[#6b7280] mt-2">
              SUBTLE RGB SPLIT EFFECT APPLIED TO MAJOR HEADINGS & TITLES
            </p>
          </Panel>
        </section>

      </main>

    </div>
  );
};
