import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useArena } from '../../context/ArenaContext';
import { Room3D } from './Room3D';
import { FloorGrid3D } from './FloorGrid3D';
import { CameraControls3D } from './CameraControls3D';

interface InteractiveFloorMapProps {
  onSelectRoom: (roomId: string) => void;
}

// Error Boundary for WebGL context loss or failure
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('3D Canvas encountered WebGL error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const InteractiveFloorMap: React.FC<InteractiveFloorMapProps> = ({ onSelectRoom }) => {
  const { rooms, selectedRoom, hoveredRoomId, setHoveredRoomId } = useArena();
  const [webGlSupported] = useState<boolean>(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  });

  if (!webGlSupported) {
    return null; // Parent will show 2D fallback
  }

  return (
    <WebGLErrorBoundary fallback={<div className="text-center p-8 text-[#ff3366] font-tech">3D ENGINE FALLBACK ACTIVATED</div>}>
      <div className="w-full h-full min-h-[500px] relative rounded-lg overflow-hidden border border-[#2a2a3a] bg-[#0a0a0f]">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 via-transparent to-[#00d4ff]/5 pointer-events-none z-10" />

        <Canvas
          camera={{ position: [0, 11, 13], fov: 45 }}
          shadows={false}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Ambient & Controlled Lighting */}
          <color attach="background" args={['#0a0a0f']} />
          <ambientLight intensity={0.4} />
          
          <directionalLight
            position={[10, 15, 10]}
            intensity={0.6}
            color="#e0e0e0"
          />

          {/* Cyberpunk Accent Lights */}
          <pointLight position={[-8, 4, 0]} intensity={1.2} color="#ff3366" distance={10} />
          <pointLight position={[-2, 4, -2.5]} intensity={1.5} color="#00d4ff" distance={12} />
          <pointLight position={[2, 4, 1.5]} intensity={1.5} color="#00ff88" distance={12} />
          <pointLight position={[6, 4, 1.5]} intensity={1.8} color="#ffd166" distance={12} />
          <pointLight position={[2, 4, -2.5]} intensity={1.5} color="#ff00ff" distance={12} />

          {/* Floor plane & Grid */}
          <FloorGrid3D />

          {/* Interactive Room 3D Meshes */}
          {rooms.map((room) => (
            <Room3D
              key={room.id}
              room={room}
              isSelected={selectedRoom?.id === room.id}
              isHovered={hoveredRoomId === room.id}
              onSelect={onSelectRoom}
              onHover={setHoveredRoomId}
            />
          ))}

          {/* Camera Controls & Parallax */}
          <CameraControls3D />
        </Canvas>

        {/* 3D Map Overlay HUD Legend */}
        <div className="absolute top-3 right-3 z-20 bg-[#12121a]/90 backdrop-blur-md p-2 border border-[#2a2a3a] clip-chamfer-sm text-[10px] sm:text-[11px] font-tech text-[#6b7280]">
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <span className="text-[#e0e0e0] font-bold hidden sm:inline">LEGEND:</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#00ff88] mr-1" /> SPHERE</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#00d4ff] mr-1" /> HQ</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#ffd166] mr-1" /> ELITE</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#ff00ff] mr-1" /> LOUNGE</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#ff3366] mr-1" /> REFUEL</span>
          </div>
        </div>

      </div>
    </WebGLErrorBoundary>
  );
};
