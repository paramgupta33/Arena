export interface Coupon {
  id: string;
  user_id: string;
  coupon_code: string;
  reward_type: 'pc' | 'ps5' | 'food';
  reward_title: string;
  reward_value: number;
  status: 'UNUSED' | 'USED' | 'EXPIRED';
  created_at: string;
  expires_at: string;
  used_at?: string;
}

export interface ScrapReward {
  id: string;
  title: string;
  description: string;
  scrapCost: number;
  rewardType: 'pc' | 'ps5' | 'food';
  rewardTitle: string;
  rewardValue: number;
}

export const SCRAP_REWARDS: ScrapReward[] = [
  {
    id: 'reward-pc-1h',
    title: 'PC GAMING',
    description: '1 Hour Free PC Session',
    scrapCost: 500,
    rewardType: 'pc',
    rewardTitle: '1 HOUR FREE PC GAMING',
    rewardValue: 150,
  },
  {
    id: 'reward-ps5-1h',
    title: 'PS5 GAMING',
    description: '1 Hour Free PS5 Session',
    scrapCost: 700,
    rewardType: 'ps5',
    rewardTitle: '1 HOUR FREE PS5 GAMING',
    rewardValue: 180,
  },
  {
    id: 'reward-food-100',
    title: 'FOOD CREDIT',
    description: '₹100 Food & Drink Credit',
    scrapCost: 800,
    rewardType: 'food',
    rewardTitle: '₹100 KITCHEN CREDIT',
    rewardValue: 100,
  },
];

export interface PCStation {
  id: string;
  name?: string;
  room: 'sphere1' | 'sphere2' | 'elite';
  status: 'Available' | 'Occupied' | 'Reserved';
  gpu: string;
  monitor: string;
  cpu?: string;
  peripherals?: string;
  sessionEndTime?: string;
  pricePerHour: number;
  hourlyRate?: number;
}

export interface PS5Station {
  id: string;
  name?: string;
  status: 'Available' | 'Occupied' | 'Reserved';
  display: string;
  seating: string;
  games: string[];
  sessionEndTime?: string;
  pricePerHour: number;
  hourlyRate?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isVeg: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  tag: string;
  content: string;
}

export interface RoomInfo {
  id: string;
  name: string;
  code: string;
  type: 'pc' | 'console' | 'kitchen' | 'reception' | 'entry';
  summary: string;
  description?: string;
  route: string;
  color: string;
  hexColor: string;
  availableCount: number;
  totalCount: number;
  available?: number;
  capacity?: number;
  pricePerHour?: number;
  position: [number, number, number];
  size: [number, number, number];
}

export const ARENA_ROOMS: RoomInfo[] = [
  {
    id: 'entry',
    name: 'EXIT',
    code: '',
    type: 'entry',
    summary: 'LEAVE ARENA',
    description: 'Exit Arena & Sign Out',
    route: '/entry',
    color: '#ff3366',
    hexColor: '#ff3366',
    availableCount: 0,
    totalCount: 0,
    available: 0,
    capacity: 0,
    pricePerHour: 0,
    position: [-7.5, 0, 0],
    size: [3.2, 0.4, 7.8]
  },
  {
    id: 'reception',
    name: 'RECEPTION',
    code: '',
    type: 'reception',
    summary: 'HELPDESK',
    description: 'Queries, Support & Member Helpdesk',
    route: '/reception',
    color: '#00d4ff',
    hexColor: '#00d4ff',
    availableCount: 1,
    totalCount: 1,
    available: 1,
    capacity: 1,
    pricePerHour: 0,
    position: [1.5, 0, -2.8],
    size: [11.2, 0.4, 2.4]
  },
  {
    id: 'sphere1',
    name: 'SPHERE 1',
    code: '',
    type: 'pc',
    summary: '5 / 10 AVAILABLE',
    description: '10x RTX 4070 Rigs @ 240Hz 1440p displays',
    route: '/sphere1',
    color: '#00ff88',
    hexColor: '#00ff88',
    availableCount: 5,
    totalCount: 10,
    available: 5,
    capacity: 10,
    pricePerHour: 15,
    position: [-2.5, 0, 0.2],
    size: [3.6, 0.4, 3.2]
  },
  {
    id: 'sphere2',
    name: 'SPHERE 2',
    code: '',
    type: 'pc',
    summary: '4 / 10 AVAILABLE',
    description: '10x RTX 4080 Rigs @ 360Hz QD-OLED displays',
    route: '/sphere2',
    color: '#00ff88',
    hexColor: '#00ff88',
    availableCount: 4,
    totalCount: 10,
    available: 4,
    capacity: 10,
    pricePerHour: 20,
    position: [1.5, 0, 0.2],
    size: [3.6, 0.4, 3.2]
  },
  {
    id: 'elite',
    name: 'SPHERE ELITE',
    code: '',
    type: 'pc',
    summary: '2 / 6 AVAILABLE',
    description: '6x RTX 4090 24GB VIP Suites with 540Hz QD-OLEDs',
    route: '/elite',
    color: '#ffd166',
    hexColor: '#ffd166',
    availableCount: 2,
    totalCount: 6,
    available: 2,
    capacity: 6,
    pricePerHour: 30,
    position: [5.5, 0, 0.2],
    size: [3.2, 0.4, 3.2]
  },
  {
    id: 'lounge',
    name: 'LOUNGE',
    code: '',
    type: 'console',
    summary: '3 / 6 AVAILABLE',
    description: '6x PS5 Booths with 65" 4K 120Hz OLEDs & Leather Sofas',
    route: '/lounge',
    color: '#ff00ff',
    hexColor: '#ff00ff',
    availableCount: 3,
    totalCount: 6,
    available: 3,
    capacity: 6,
    pricePerHour: 18,
    position: [-0.5, 0, 3.0],
    size: [7.6, 0.4, 2.2]
  },
  {
    id: 'kitchen',
    name: 'KITCHEN',
    code: '',
    type: 'kitchen',
    summary: 'FOOD & DRINKS',
    description: 'Fresh gaming burgers, fries, pizza, energy drinks & cold brews',
    route: '/kitchen',
    color: '#ff3366',
    hexColor: '#ff3366',
    availableCount: 20,
    totalCount: 20,
    available: 20,
    capacity: 20,
    pricePerHour: 0,
    position: [5.5, 0, 3.0],
    size: [3.2, 0.4, 2.2]
  }
];

export const SPHERE1_PCS: PCStation[] = [
  { id: 'PC-01', name: 'Alpha Rig 1', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-02', name: 'Alpha Rig 2', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-03', name: 'Alpha Rig 3', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-04', name: 'Alpha Rig 4', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-05', name: 'Alpha Rig 5', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-06', name: 'Alpha Rig 6', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-07', name: 'Alpha Rig 7', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-08', name: 'Alpha Rig 8', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-09', name: 'Alpha Rig 9', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
  { id: 'PC-10', name: 'Alpha Rig 10', room: 'sphere1', status: 'Available', gpu: 'RTX 4070', cpu: 'i7-14700K', monitor: '240Hz 1440p', pricePerHour: 150, hourlyRate: 150 },
];

export const SPHERE2_PCS: PCStation[] = [
  { id: 'PC-11', name: 'Pro Rig 1', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-12', name: 'Pro Rig 2', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-13', name: 'Pro Rig 3', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-14', name: 'Pro Rig 4', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-15', name: 'Pro Rig 5', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-16', name: 'Pro Rig 6', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-17', name: 'Pro Rig 7', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-18', name: 'Pro Rig 8', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-19', name: 'Pro Rig 9', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
  { id: 'PC-20', name: 'Pro Rig 10', room: 'sphere2', status: 'Available', gpu: 'RTX 4080', cpu: 'Ryzen 7 7800X3D', monitor: '360Hz QD-OLED', pricePerHour: 200, hourlyRate: 200 },
];

export const ELITE_PCS: PCStation[] = [
  { id: 'VIP-PC-01', name: 'VIP Suite 1', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
  { id: 'VIP-PC-02', name: 'VIP Suite 2', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
  { id: 'VIP-PC-03', name: 'VIP Suite 3', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
  { id: 'VIP-PC-04', name: 'VIP Suite 4', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
  { id: 'VIP-PC-05', name: 'VIP Suite 5', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
  { id: 'VIP-PC-06', name: 'VIP Suite 6', room: 'elite', status: 'Available', gpu: 'RTX 4090 24GB', cpu: 'i9-14900KS', monitor: '540Hz QD-OLED', pricePerHour: 300, hourlyRate: 300 },
];

export const PC_STATIONS: Record<string, PCStation[]> = {
  sphere1: SPHERE1_PCS,
  sphere2: SPHERE2_PCS,
  elite: ELITE_PCS,
};

export const PS5_STATIONS: PS5Station[] = [
  { id: 'PS5-01', name: 'Console Pod 1', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Leather Gaming Sofa', games: ['FC 25', 'Tekken 8', 'Mortal Kombat 1'], pricePerHour: 180, hourlyRate: 180 },
  { id: 'PS5-02', name: 'Console Pod 2', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Leather Gaming Sofa', games: ['FC 25', 'GTA V', 'God of War Ragnarok'], pricePerHour: 180, hourlyRate: 180 },
  { id: 'PS5-03', name: 'Console Pod 3', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Recliner Sofa', games: ['Gran Turismo 7', 'FC 25', 'Spider-Man 2'], pricePerHour: 180, hourlyRate: 180 },
  { id: 'PS5-04', name: 'Console Pod 4', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Leather Gaming Sofa', games: ['FC 25', 'Call of Duty Black Ops 6'], pricePerHour: 180, hourlyRate: 180 },
  { id: 'PS5-05', name: 'Console Pod 5', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Leather Gaming Sofa', games: ['FC 25', 'NBA 2K25', 'Tekken 8'], pricePerHour: 180, hourlyRate: 180 },
  { id: 'PS5-06', name: 'Console Pod 6', status: 'Available', display: '65" 4K 120Hz OLED', seating: 'Leather Gaming Sofa', games: ['FC 25', 'UFC 5', 'Mortal Kombat 1'], pricePerHour: 180, hourlyRate: 180 },
];

export const FOOD_MENU: MenuItem[] = [
  { id: 'F-01', name: 'Classic Loaded Burger', category: 'Snacks', price: 8.50, description: 'Grilled patty with cheese, caramelized onions & house special sauce', isVeg: false },
  { id: 'F-02', name: 'Crispy Paneer Burger', category: 'Snacks', price: 7.50, description: 'Spicy paneer patty, crunchy lettuce & mint mayo', isVeg: true },
  { id: 'F-03', name: 'Peri Peri Fries', category: 'Snacks', price: 4.50, description: 'Crispy golden fries tossed in hot peri peri seasoning', isVeg: true },
  { id: 'F-04', name: 'Pepperoni Loaded Pizza', category: 'Hot Meals', price: 14.00, description: 'Mozzarella, spicy pepperoni, oregano & chili flakes', isVeg: false },
  { id: 'F-05', name: 'Farmhouse Veg Pizza', category: 'Hot Meals', price: 12.00, description: 'Capsicum, onion, mushroom, corn & mozzarella cheese', isVeg: true },
];

export const DRINK_MENU: MenuItem[] = [
  { id: 'D-01', name: 'Monster Energy Drink (500ml)', category: 'Energy Shots', price: 4.00, description: 'Original Green Energy Blend', isVeg: true },
  { id: 'D-02', name: 'Red Bull Energy Drink (250ml)', category: 'Energy Shots', price: 3.50, description: 'Vitalizes body and mind', isVeg: true },
  { id: 'D-03', name: 'Chilled Cold Brew Coffee', category: 'Drinks', price: 4.50, description: 'Rich espresso blended with milk and ice cream', isVeg: true },
  { id: 'D-04', name: 'Chilled Cola (500ml)', category: 'Drinks', price: 2.50, description: 'Chilled carbonated soft drink', isVeg: true },
];

export const KITCHEN_MENU: MenuItem[] = [...FOOD_MENU, ...DRINK_MENU];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A-01',
    title: 'VALORANT 5v5 TOURNAMENT THIS SATURDAY',
    date: '2026-08-12',
    tag: 'Tournament',
    content: 'Registration is now open for the ARENA Valorant Cup. Total prize pool $500. Register your squad at Reception!'
  },
  {
    id: 'A-02',
    title: 'NIGHT OWL GAMING PASS (11 PM - 7 AM)',
    date: '2026-08-10',
    tag: 'Offer',
    content: 'Enjoy 8 hours of uninterrupted gaming in Sphere 1 or Sphere 2 for flat $35. Free cold coffee included.'
  },
  {
    id: 'A-03',
    title: 'NEW PS5 GAMES ADDED TO LOUNGE',
    date: '2026-08-08',
    tag: 'Update',
    content: 'FC 25, Call of Duty Black Ops 6, and Tekken 8 are now updated on all Console Lounge PS5s.'
  }
];
