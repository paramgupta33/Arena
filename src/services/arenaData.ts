export interface RoomData {
  id: string;
  name: string;
  code: string;
  category: 'normal' | 'info' | 'elite' | 'lounge' | 'kitchen' | 'entry';
  color: string;
  hexColor: string;
  occupancy: {
    current: number;
    total: number;
  };
  specs: {
    rigs: string;
    gpus: string;
    refreshRate: string;
    audio: string;
  };
  description: string;
  route: string;
  position: [number, number, number]; // [x, y, z] position in 3D floor layout
  size: [number, number, number];     // [width, height, depth]
}

export const ARENA_ROOMS: RoomData[] = [
  {
    id: 'entry',
    name: 'MAIN ENTRY / PORTAL',
    code: 'GATE-00',
    category: 'entry',
    color: 'var(--red)',
    hexColor: '#ff3366',
    occupancy: { current: 14, total: 100 },
    specs: {
      rigs: 'Biometric Scanner Gate',
      gpus: 'Sub-surface RFID Grid',
      refreshRate: '240 Hz Matrix',
      audio: 'Ambient Sub-bass Wave'
    },
    description: 'Security portal and primary ingress/egress gateway to the ARENA grid.',
    route: '/entry',
    position: [-8, 0, 0],
    size: [3.8, 0.4, 8]
  },
  {
    id: 'reception',
    name: 'COMMAND RECEPTION',
    code: 'HQ-01',
    category: 'info',
    color: 'var(--cyan)',
    hexColor: '#00d4ff',
    occupancy: { current: 3, total: 10 },
    specs: {
      rigs: 'Dual Holo-Terminals',
      gpus: 'Direct Fiber Uplink',
      refreshRate: '360 Hz OLED HUD',
      audio: 'Directional Neural Beam'
    },
    description: 'Central desk for session check-ins, guest verification, and tactical inquiries.',
    route: '/reception',
    position: [-2, 0, -2.5],
    size: [8, 0.4, 3]
  },
  {
    id: 'sphere1',
    name: 'SPHERE 01 (TACTICAL)',
    code: 'SPH-A',
    category: 'normal',
    color: 'var(--green)',
    hexColor: '#00ff88',
    occupancy: { current: 8, total: 10 },
    specs: {
      rigs: '10x RTX 5090 Custom Rigs',
      gpus: 'NVIDIA RTX 5090 32GB',
      refreshRate: '540 Hz QD-OLED',
      audio: 'Sennheiser Pro Audio'
    },
    description: 'High-density tournament sphere engineered for competitive FPS and fast twitch play.',
    route: '/sphere1',
    position: [-2, 0, 1.5],
    size: [3.8, 0.4, 4]
  },
  {
    id: 'sphere2',
    name: 'SPHERE 02 (CYBER SQUAD)',
    code: 'SPH-B',
    category: 'normal',
    color: 'var(--green)',
    hexColor: '#00ff88',
    occupancy: { current: 12, total: 12 },
    specs: {
      rigs: '12x RTX 5080 Battle Pods',
      gpus: 'NVIDIA RTX 5080 16GB',
      refreshRate: '360 Hz Ultrawide',
      audio: 'SteelSeries Arctis Nova'
    },
    description: 'Squad combat sphere optimized for MOBA, battle royale, and coordinated team battles.',
    route: '/sphere2',
    position: [2, 0, 1.5],
    size: [3.8, 0.4, 4]
  },
  {
    id: 'elite',
    name: 'SPHERE ELITE (APEX VAULT)',
    code: 'VIP-99',
    category: 'elite',
    color: 'var(--gold)',
    hexColor: '#ffd166',
    occupancy: { current: 2, total: 6 },
    specs: {
      rigs: '6x Liquid-Cooled Titan Rigs',
      gpus: 'Dual RTX Titan AI Workstations',
      refreshRate: '240 Hz 4K Micro-LED',
      audio: 'Custom Focal Studio Monitors'
    },
    description: 'Ultra-private luxury suite with zero-gravity seats, custom sound isolation, and dedicated line.',
    route: '/elite',
    position: [6, 0, 1.5],
    size: [3.8, 0.4, 4]
  },
  {
    id: 'lounge',
    name: 'CYBER LOUNGE & REFUEL',
    code: 'LNG-03',
    category: 'lounge',
    color: 'var(--magenta)',
    hexColor: '#ff00ff',
    occupancy: { current: 18, total: 30 },
    specs: {
      rigs: 'Holographic Match Streamers',
      gpus: 'Ambient LED Matrix',
      refreshRate: '120 Hz Wall Displays',
      audio: 'Spatial Synthscape System'
    },
    description: 'Rest and chillout hub with live match streams, couch pods, and energy replenishment stations.',
    route: '/lounge',
    position: [2, 0, -2.5],
    size: [3.8, 0.4, 3]
  },
  {
    id: 'kitchen',
    name: 'SYNTH KITCHEN & BAR',
    code: 'KTCH-04',
    category: 'kitchen',
    color: 'var(--red)',
    hexColor: '#ff3366',
    occupancy: { current: 4, total: 15 },
    specs: {
      rigs: 'Automated Beverage Dispensers',
      gpus: 'Thermal Grill Controllers',
      refreshRate: 'Tactile Menu Terminals',
      audio: 'Lo-Fi Cyberpunk Beats'
    },
    description: 'Nutritional replenishment node offering synthetic energy drinks, ramen, and cyber snacks.',
    route: '/kitchen',
    position: [6, 0, -2.5],
    size: [3.8, 0.4, 3]
  }
];
