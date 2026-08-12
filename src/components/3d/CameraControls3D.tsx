import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraControls3D: React.FC = () => {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Handle subtle mouse parallax & mobile touch pan
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && touchStart.current) {
        const deltaX = (e.touches[0].clientX - touchStart.current.x) / window.innerWidth;
        const deltaY = (e.touches[0].clientY - touchStart.current.y) / window.innerHeight;
        
        // Pan offset sensitivity
        mouse.current.x = Math.max(-2, Math.min(2, mouse.current.x - deltaX * 2.5));
        mouse.current.y = Math.max(-2, Math.min(2, mouse.current.y - deltaY * 2.5));

        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      touchStart.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useFrame((_state, delta) => {
    // Calculate aspect ratio to dynamically elevate/distance camera on mobile
    const aspect = size.width / Math.max(1, size.height);
    let baseCamY = 11;
    let baseCamZ = 13;

    if (aspect < 0.75) {
      // Narrow mobile screens
      baseCamY = 18;
      baseCamZ = 19;
    } else if (aspect < 1.0) {
      // Mobile landscape / small tablets
      baseCamY = 14;
      baseCamZ = 15;
    }

    const basePosition = new THREE.Vector3(0, baseCamY, baseCamZ);
    
    // Target position with subtle parallax offset
    const targetX = basePosition.x + mouse.current.x * 2.5;
    const targetY = basePosition.y - mouse.current.y * 1.5;
    const targetZ = basePosition.z + mouse.current.y * 1.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3);

    camera.lookAt(0, 0, -0.5);
  });

  return null;
};
