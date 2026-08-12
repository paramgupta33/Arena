import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { RoomInfo } from '../../data/arenaData';

interface Room3DProps {
  room: RoomInfo;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export const Room3D: React.FC<Room3DProps> = ({
  room,
  isSelected,
  isHovered,
  onSelect,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const targetY = isHovered || isSelected ? 0.35 : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        delta * 12
      );
    }
  });

  const activeColor = isHovered || isSelected ? room.color : room.hexColor;

  return (
    <group
      ref={groupRef}
      position={room.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(room.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(room.id);
      }}
    >
      {/* Dark Chamfered Metallic Room Base Block */}
      <mesh ref={meshRef} position={[0, room.size[1] / 2, 0]}>
        <boxGeometry args={room.size} />
        <meshStandardMaterial
          color={isHovered || isSelected ? '#222236' : '#12121a'}
          metalness={0.85}
          roughness={0.2}
          emissive={activeColor}
          emissiveIntensity={isHovered || isSelected ? 0.45 : 0.08}
        />
      </mesh>

      {/* Wireframe Emissive Border Box */}
      <lineSegments position={[0, room.size[1] / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(...room.size)]} />
        <lineBasicMaterial
          color={activeColor}
          linewidth={isHovered || isSelected ? 2 : 1}
        />
      </lineSegments>

      {/* Inner Glowing Core Indicator (Inside Room) */}
      <mesh position={[0, room.size[1] + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.size[0] - 0.2, room.size[2] - 0.2]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={isHovered || isSelected ? 0.4 : 0.12}
        />
      </mesh>

      {/* Drei HTML Overlay Label */}
      <Html
        position={[0, room.size[1] + 0.6, 0]}
        center
        distanceFactor={14}
        zIndexRange={[10, 0]}
        style={{
          transition: 'all 0.2s ease',
          pointerEvents: 'none'
        }}
      >
        <div
          className={`
            select-none px-3 py-1.5 flex flex-col items-center justify-center font-tech uppercase
            border backdrop-blur-md transition-all whitespace-nowrap rounded shadow-lg
            ${
              isHovered || isSelected
                ? 'bg-[#12121a]/95 scale-105'
                : 'bg-[#0a0a0f]/85 scale-100'
            }
          `}
          style={{
            borderColor: activeColor,
            color: activeColor,
            boxShadow: isHovered || isSelected ? `0 0 16px ${activeColor}80` : 'none'
          }}
        >
          <div className="flex items-center text-[11px] font-bold tracking-wider font-heading">
            <span>{room.name}</span>
          </div>

          <div className="text-[9px] text-[#e0e0e0] flex items-center space-x-1 mt-0.5 font-tech">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: activeColor }}
            />
            <span>{room.summary}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
