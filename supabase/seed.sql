-- =========================================================
-- ARENA GAMING PARLOUR - SEED DATA
-- =========================================================

-- 1. GAMING ZONES
INSERT INTO public.gaming_zones (id, name, type, description, capacity, price_per_hour) VALUES
('sphere1', 'Sphere 1', 'pc', 'High-performance standard esports arena with 240Hz Alienware displays.', 12, 12.50),
('sphere2', 'Sphere 2', 'pc', 'Competitive squad room optimized for tactical shooters and MOBA teams.', 12, 15.00),
('elite', 'Sphere Elite VIP', 'pc', 'Ultra-VIP gaming sanctuary featuring RTX 4090 setups & Herman Miller seating.', 8, 25.00),
('lounge', 'PS5 Console Lounge', 'console', 'Luxury lounge booths with 65-inch 4K OLED TVs, PS5 Pros & surround sound.', 6, 18.00),
('kitchen', 'Cyber Kitchen & Bar', 'amenity', 'Energy drinks, artisan burgers, ramen, and gaming snacks.', 30, 0.00),
('reception', 'Helpdesk & Check-In', 'amenity', 'Pass purchase, peripheral rentals, tournament registration, and support.', 10, 0.00)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_per_hour = EXCLUDED.price_per_hour;

-- 2. PCS (30+ VARIED STATIONS)
INSERT INTO public.pcs (id, zone_id, pc_number, status, gpu, cpu, ram, monitor, storage, price_per_hour) VALUES
-- Sphere 1 PCs
('PC-01', 'sphere1', 1, 'Available', 'NVIDIA RTX 4060 Ti', 'Intel i7-13700K', '32GB DDR5', '27" 240Hz IPS 1080p', '1TB NVMe Gen4', 12.50),
('PC-02', 'sphere1', 2, 'Available', 'NVIDIA RTX 4060 Ti', 'Intel i7-13700K', '32GB DDR5', '27" 240Hz IPS 1080p', '1TB NVMe Gen4', 12.50),
('PC-03', 'sphere1', 3, 'Occupied', 'NVIDIA RTX 4070', 'AMD Ryzen 7 7700X', '32GB DDR5', '27" 240Hz IPS 1440p', '2TB NVMe Gen4', 12.50),
('PC-04', 'sphere1', 4, 'Available', 'NVIDIA RTX 4070', 'AMD Ryzen 7 7700X', '32GB DDR5', '27" 240Hz IPS 1440p', '2TB NVMe Gen4', 12.50),
('PC-05', 'sphere1', 5, 'Available', 'NVIDIA RTX 4070 Super', 'Intel i7-14700K', '32GB DDR5', '27" 240Hz OLED 1440p', '2TB NVMe Gen4', 12.50),
('PC-06', 'sphere1', 6, 'Reserved', 'NVIDIA RTX 4070 Super', 'Intel i7-14700K', '32GB DDR5', '27" 240Hz OLED 1440p', '2TB NVMe Gen4', 12.50),
('PC-07', 'sphere1', 7, 'Available', 'NVIDIA RTX 4070 Ti', 'AMD Ryzen 7 7800X3D', '32GB DDR5', '27" 360Hz Fast IPS', '2TB NVMe Gen4', 12.50),
('PC-08', 'sphere1', 8, 'Available', 'NVIDIA RTX 4070 Ti', 'AMD Ryzen 7 7800X3D', '32GB DDR5', '27" 360Hz Fast IPS', '2TB NVMe Gen4', 12.50),
('PC-09', 'sphere1', 9, 'Maintenance', 'NVIDIA RTX 4060 Ti', 'Intel i7-13700K', '32GB DDR5', '27" 240Hz IPS', '1TB NVMe Gen4', 12.50),
('PC-10', 'sphere1', 10, 'Available', 'NVIDIA RTX 4070 Super', 'Intel i7-14700K', '32GB DDR5', '27" 240Hz IPS', '2TB NVMe Gen4', 12.50),

-- Sphere 2 PCs
('PC-11', 'sphere2', 11, 'Available', 'NVIDIA RTX 4070 Super', 'AMD Ryzen 7 7800X3D', '32GB DDR5', '27" 360Hz Esports Display', '2TB NVMe Gen4', 15.00),
('PC-12', 'sphere2', 12, 'Available', 'NVIDIA RTX 4070 Super', 'AMD Ryzen 7 7800X3D', '32GB DDR5', '27" 360Hz Esports Display', '2TB NVMe Gen4', 15.00),
('PC-13', 'sphere2', 13, 'Occupied', 'NVIDIA RTX 4080', 'Intel i9-13900K', '64GB DDR5', '27" 360Hz OLED 1440p', '2TB NVMe Gen4', 15.00),
('PC-14', 'sphere2', 14, 'Available', 'NVIDIA RTX 4080', 'Intel i9-13900K', '64GB DDR5', '27" 360Hz OLED 1440p', '2TB NVMe Gen4', 15.00),
('PC-15', 'sphere2', 15, 'Available', 'NVIDIA RTX 4080 Super', 'AMD Ryzen 9 7900X3D', '64GB DDR5', '32" 240Hz 4K OLED', '4TB NVMe Gen4', 15.00),
('PC-16', 'sphere2', 16, 'Reserved', 'NVIDIA RTX 4080 Super', 'AMD Ryzen 9 7900X3D', '64GB DDR5', '32" 240Hz 4K OLED', '4TB NVMe Gen4', 15.00),
('PC-17', 'sphere2', 17, 'Available', 'NVIDIA RTX 4070 Ti Super', 'Intel i7-14700K', '32GB DDR5', '27" 360Hz IPS', '2TB NVMe Gen4', 15.00),
('PC-18', 'sphere2', 18, 'Available', 'NVIDIA RTX 4070 Ti Super', 'Intel i7-14700K', '32GB DDR5', '27" 360Hz IPS', '2TB NVMe Gen4', 15.00),
('PC-19', 'sphere2', 19, 'Occupied', 'NVIDIA RTX 4080', 'AMD Ryzen 7 7800X3D', '64GB DDR5', '27" 360Hz Fast IPS', '2TB NVMe Gen4', 15.00),
('PC-20', 'sphere2', 20, 'Available', 'NVIDIA RTX 4080', 'AMD Ryzen 7 7800X3D', '64GB DDR5', '27" 360Hz Fast IPS', '2TB NVMe Gen4', 15.00),

-- Sphere Elite VIP PCs
('VIP-01', 'elite', 1, 'Available', 'NVIDIA RTX 4090 24GB', 'Intel i9-14900KS', '64GB DDR5 7200MHz', '32" 4K 240Hz Dual-Mode QD-OLED', '4TB NVMe Gen5', 25.00),
('VIP-02', 'elite', 2, 'Available', 'NVIDIA RTX 4090 24GB', 'Intel i9-14900KS', '64GB DDR5 7200MHz', '32" 4K 240Hz Dual-Mode QD-OLED', '4TB NVMe Gen5', 25.00),
('VIP-03', 'elite', 3, 'Reserved', 'NVIDIA RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '64GB DDR5 7200MHz', '34" Curved Ultrawide 175Hz OLED', '4TB NVMe Gen5', 25.00),
('VIP-04', 'elite', 4, 'Available', 'NVIDIA RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '64GB DDR5 7200MHz', '34" Curved Ultrawide 175Hz OLED', '4TB NVMe Gen5', 25.00),
('VIP-05', 'elite', 5, 'Available', 'NVIDIA RTX 4090 24GB', 'Intel i9-14900K', '64GB DDR5', '27" 540Hz Esports TN Display', '2TB NVMe Gen5', 25.00),
('VIP-06', 'elite', 6, 'Occupied', 'NVIDIA RTX 4090 24GB', 'Intel i9-14900K', '64GB DDR5', '27" 540Hz Esports TN Display', '2TB NVMe Gen5', 25.00),
('VIP-07', 'elite', 7, 'Available', 'NVIDIA RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '64GB DDR5', '32" 4K 240Hz QD-OLED', '4TB NVMe Gen5', 25.00),
('VIP-08', 'elite', 8, 'Available', 'NVIDIA RTX 4090 24GB', 'AMD Ryzen 9 7950X3D', '64GB DDR5', '32" 4K 240Hz QD-OLED', '4TB NVMe Gen5', 25.00),

-- Extra Sphere 1 Expansion PCs
('PC-21', 'sphere1', 21, 'Available', 'NVIDIA RTX 4060 Ti', 'AMD Ryzen 5 7600X', '32GB DDR5', '24" 240Hz Esports Monitor', '1TB NVMe', 12.50),
('PC-22', 'sphere1', 22, 'Available', 'NVIDIA RTX 4060 Ti', 'AMD Ryzen 5 7600X', '32GB DDR5', '24" 240Hz Esports Monitor', '1TB NVMe', 12.50)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  gpu = EXCLUDED.gpu,
  price_per_hour = EXCLUDED.price_per_hour;

-- 3. LOUNGE SETUPS
INSERT INTO public.lounge_setups (id, name, description, capacity, status, price_per_hour) VALUES
('PS5-BOOTH-01', 'PS5 Lounge Booth Alpha', 'Leather sectional sofa, 65" LG C3 4K 120Hz OLED, 4x DualSense Edge Controllers.', 4, 'Available', 18.00),
('PS5-BOOTH-02', 'PS5 Lounge Booth Bravo', 'Dual-couch setup, 75" Sony Bravia XR 4K OLED, Pulse 3D headsets, PS VR2 ready.', 6, 'Occupied', 20.00),
('PS5-BOOTH-03', 'PS5 Lounge Booth Charlie', 'Recliner gaming chairs, 65" Samsung S90C QD-OLED, preloaded with EA FC 25 & Tekken 8.', 4, 'Available', 18.00),
('PS5-BOOTH-04', 'PS5 Lounge Booth Delta', 'VIP Private Pod with Dolby Atmos soundbar and ambient Philips Hue sync lighting.', 4, 'Reserved', 22.00)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  price_per_hour = EXCLUDED.price_per_hour;

-- 4. FOOD & DRINK ITEMS (15+ FOOD, 10+ DRINKS)
INSERT INTO public.food_items (id, name, category, description, price, available, image_url) VALUES
-- Food Items
('f1', 'Cyber Glitch Smash Burger', 'Food', 'Double smashed wagyu beef patties, melted cheddar, neon special sauce, brioche bun.', 12.99, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'),
('f2', 'Mecha Loaded Cheese Fries', 'Food', 'Crispy waffle fries loaded with bacon bits, jalapeños, melted cheese & garlic aioli.', 8.50, true, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=400&q=80'),
('f3', 'Overdrive Spicy Tonkotsu Ramen', 'Food', 'Rich pork broth, chashu pork belly, ajitama egg, spicy chili oil, fresh noodles.', 14.50, true, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80'),
('f4', 'Tactical Buffalo Wings (8pcs)', 'Food', 'Crispy jumbo wings tossed in signature fiery buffalo sauce with blue cheese dip.', 11.00, true, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80'),
('f5', 'Neon Pepperoni Pizza Slice', 'Food', 'Extra large NY style slice with crispy pepperoni edge & mozzarella stretch.', 5.50, true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'),
('f6', 'Matrix Truffle Mac & Cheese', 'Food', 'Four-cheese baked macaroni infused with black truffle oil and panko crust.', 10.50, true, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80'),
('f7', 'Cyberpunk Bao Buns (3pcs)', 'Food', 'Fluffy steamed bao buns with slow-cooked pork belly, pickled cucumber & hoisin.', 11.50, true, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80'),
('f8', 'Stealth Crispy Chicken Sliders', 'Food', 'Three buttermilk fried chicken mini-burgers with spicy slaw and pickles.', 11.99, true, 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=400&q=80'),
('f9', 'Quantum Nachos Supreme', 'Food', 'Tortilla chips stacked with ground beef, queso, guacamole, salsa and sour cream.', 9.99, true, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80'),
('f10', 'Headshot BBQ Pork Ribs', 'Food', 'Half-rack smoky slow-roasted pork ribs served with seasoned potato wedges.', 16.50, true, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'),
('f11', 'Esports Mozzarella Sticks (6pcs)', 'Food', 'Golden fried mozzarella sticks served with warm marinara dipping sauce.', 7.50, true, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=400&q=80'),
('f12', 'Gamer Garlic Parmesan Knots', 'Food', 'Freshly baked dough knots brushed with garlic butter, parmesan & parsley.', 6.00, true, 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=400&q=80'),
('f13', 'Apex Veggie Quesadilla', 'Food', 'Grilled tortilla filled with sautéed bell peppers, onions, spinach & jack cheese.', 9.50, true, 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=400&q=80'),
('f14', 'Chrono Churros with Chocolate', 'Food', 'Cinnamon-sugar dusted Spanish churros served with warm dark chocolate sauce.', 6.99, true, 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=400&q=80'),
('f15', 'Hyperdrive Lava Brownie', 'Food', 'Warm chocolate lava cake topped with vanilla bean ice cream and fudge drizzle.', 7.50, true, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'),

-- Drinks Items
('d1', 'Monster Energy Original 16oz', 'Drinks', 'High energy fuel for marathon gaming sessions.', 4.00, true, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=400&q=80'),
('d2', 'Red Bull Blue Edition (Juneberry)', 'Drinks', 'Refreshing energy boost with vibrant berry flavor.', 4.50, true, 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=400&q=80'),
('d3', 'Neon Blue Raspberry Slushie', 'Drinks', 'Signature frozen slushie topped with popping candy.', 5.00, true, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80'),
('d4', 'Iced Matcha Green Tea Latte', 'Drinks', 'Japanese ceremony grade matcha with oat milk and vanilla syrup.', 5.50, true, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80'),
('d5', 'Cyber Cold Brew Coffee', 'Drinks', 'Slow-steeped dark roast cold brew infused with nitrogen foam.', 4.75, true, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80'),
('d6', 'Boba Thai Milk Tea', 'Drinks', 'Sweet creamy Thai tea served over fresh brown sugar tapioca pearls.', 5.75, true, 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=400&q=80'),
('d7', 'GamerFuel Dragonfruit Lemonade', 'Drinks', 'Electrolyte-charged dragonfruit lemonade over crushed ice.', 4.25, true, 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=400&q=80'),
('d8', 'Mountain Dew Voltage (Can)', 'Drinks', 'Charged with raspberry citrus flavor and ginseng.', 2.75, true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'),
('d9', 'Zero-Calorie Sparking Water Lime', 'Drinks', 'Crisp sparkling mountain water with natural key lime essence.', 2.50, true, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80'),
('d10', 'Overclocked Mango Smoothie', 'Drinks', 'Real Alphonso mango blended with Greek yogurt and honey.', 6.25, true, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  available = EXCLUDED.available;

-- 5. ANNOUNCEMENTS (8 REALISTIC ANNOUNCEMENTS)
INSERT INTO public.announcements (id, title, content, tag, date, is_active) VALUES
('ann-01', 'Valorant 5v5 Showdown Tournament Announced', 'Get your team ready for this Saturday! $2,500 prize pool in cash and SCRAP credits. Registration open at Reception.', 'TOURNAMENT', CURRENT_DATE, true),
('ann-02', 'Sphere Elite Upgraded with RTX 4090s', 'All 8 stations in Sphere Elite now feature flagship RTX 4090 24GB GPUs and 540Hz displays.', 'HARDWARE', CURRENT_DATE - INTERVAL '1 day', true),
('ann-03', 'Late Night Gaming Pass Special', 'Get unlimited gaming access from 11 PM to 7 AM for only $30. Includes 1 Free Energy Drink.', 'PROMO', CURRENT_DATE - INTERVAL '2 days', true),
('ann-04', 'Counter-Strike 2 LAN League Season 4', 'CS2 weekly ladder match nights every Thursday at 7 PM. All ranks welcome to compete for ranking points.', 'ESPORTS', CURRENT_DATE - INTERVAL '3 days', true),
('ann-05', 'Cyber Kitchen Autumn Menu Launch', 'Try our new Cyber Glitch Smash Burger and Overdrive Ramen today at the Cyber Kitchen.', 'FOOD', CURRENT_DATE - INTERVAL '4 days', true),
('ann-06', 'PS5 Pro & EA FC 25 Lounge Addition', 'All PS5 Lounge Booths have been updated with PS5 Pro consoles and 4K 120Hz displays.', 'CONSOLE', CURRENT_DATE - INTERVAL '5 days', true),
('ann-07', 'Scheduled Fiber Network Upgrade', 'Routine network optimization will occur on Tuesday from 4:00 AM to 5:00 AM. Minimal disruption expected.', 'MAINTENANCE', CURRENT_DATE - INTERVAL '6 days', true),
('ann-08', 'Earn 2x SCRAP Loyalty Rewards This Weekend', 'All PC and PS5 station rentals earn double SCRAP points Friday through Sunday!', 'REWARDS', CURRENT_DATE - INTERVAL '7 days', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  tag = EXCLUDED.tag;
