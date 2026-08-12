import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloorGrid3D: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate floating particle sparks
  const particleCount = 120;
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;     // x
      positions[i * 3 + 1] = Math.random() * 3 + 0.2;    // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16; // z
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += delta * 0.15;
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dark Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial
          color="#0a0a0f"
          roughness={0.8}
          metalness={0.5}
        />
      </mesh>

      {/* Grid Overlay Line Mesh */}
      <gridHelper
        args={[30, 30, '#00ff88', '#2a2a3a']}
        position={[0, 0.01, 0]}
      />

      {/* Glowing Architectural Connecting Pathways */}
      {/* Main hallway from Entry to Reception & Spheres */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.02, -0.5]}>
        <planeGeometry args={[14, 0.15]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.02, -0.5]}>
        <planeGeometry args={[0.15, 6]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.02, -0.5]}>
        <planeGeometry args={[0.15, 6]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.02, -0.5]}>
        <planeGeometry args={[0.15, 6]} />
        <meshBasicMaterial color="#ffd166" transparent opacity={0.5} />
      </mesh>

      {/* Floating Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00ff88"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
