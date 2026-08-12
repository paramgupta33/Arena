import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ArenaCore3D: React.FC = () => {
  const outerRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.3;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.5;
      coreRef.current.rotation.z += delta * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.y -= delta * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.5;
      ring2Ref.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group ref={outerRef} position={[0, 0, 0]}>
      {/* Central Metallic Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#12121a"
          metalness={0.9}
          roughness={0.1}
          wireframe={false}
          emissive="#00ff88"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wireframe Outer Shell */}
      <mesh>
        <octahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial
          color="#00ff88"
          wireframe={true}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Ring 1 (Cyan) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.03, 16, 64]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Ring 2 (Magenta) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.03, 16, 64]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>

      {/* Ambient and Point Lights */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#00ff88" distance={6} />
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#00d4ff" distance={8} />
      <pointLight position={[-2, -2, -2]} intensity={1.0} color="#ff00ff" distance={8} />
    </group>
  );
};
