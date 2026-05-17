-- Seed data for RentHub categories and items

-- Insert sample users (for testing)
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('Rajesh Kumar', 'rajesh@example.com', '$2a$10$PLACEHOLDER', NOW(), NOW()),
('Priya Singh', 'priya@example.com', '$2a$10$PLACEHOLDER', NOW(), NOW()),
('Amit Patel', 'amit@example.com', '$2a$10$PLACEHOLDER', NOW(), NOW()),
('Sneha Desai', 'sneha@example.com', '$2a$10$PLACEHOLDER', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 🚗 VEHICLES
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Honda City', 'Vehicles - Cars', 'Sedan for daily rentals and road trips', 1500, '/day', 1, 4.8, 42),
('Royal Enfield Classic', 'Vehicles - Bikes', 'Comfortable cruiser bike for city commute', 500, '/day', 1, 4.7, 28),
('Mountain Bike - Trek', 'Vehicles - Bicycles', 'Professional grade mountain bike for fitness', 300, '/day', 2, 4.9, 15),
('Maruti Swift', 'Vehicles - Cars', 'Compact car perfect for city driving', 1200, '/day', 2, 4.6, 35),
('Bajaj Scooter', 'Vehicles - Scooters', 'Fuel-efficient scooter for daily commute', 400, '/day', 3, 4.5, 22);

-- 🎮 ELECTRONICS & ENTERTAINMENT
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('PlayStation 5', 'Electronics - Gaming', 'Latest PS5 console with controllers', 1200, '/day', 1, 5.0, 67),
('Xbox Series X', 'Electronics - Gaming', 'Microsoft next-gen gaming console', 1100, '/day', 2, 4.9, 54),
('Meta Quest 3', 'Electronics - VR', 'Premium VR headset for immersive gaming', 800, '/day', 3, 4.8, 31),
('MacBook Pro 14"', 'Electronics - Laptops', '16GB RAM, M2 Pro chip for professionals', 1800, '/day', 1, 4.9, 48),
('Dell 4K Monitor', 'Electronics - Monitors', '27" 4K UHD display with USB-C', 500, '/day', 2, 4.7, 19),
('Sony 4K Projector', 'Electronics - Projectors', 'Bright projector for outdoor movie nights', 2000, '/day', 3, 4.8, 25),
('Bose SoundLink Max', 'Electronics - Speakers', 'Premium Bluetooth speaker with 24hr battery', 600, '/day', 1, 4.9, 38);

-- 📷 CAMERAS & GEAR
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Canon EOS R5', 'Cameras - DSLR', '45MP mirrorless camera for professionals', 2500, '/day', 2, 4.9, 56),
('Sony FE 24-70mm', 'Cameras - Lenses', 'Versatile zoom lens for all occasions', 800, '/day', 1, 4.8, 33),
('DJI Mini 3 Pro', 'Cameras - Drones', 'Compact drone with 4K camera and 45min flight', 1500, '/day', 3, 4.9, 44),
('GoPro Hero 11', 'Cameras - Action', 'Rugged action camera for adventure sports', 700, '/day', 2, 4.8, 29),
('Manfrotto Tripod', 'Cameras - Accessories', 'Professional tripod with 360° head', 400, '/day', 1, 4.7, 18),
('DJI Gimbal 3', 'Cameras - Gimbals', 'Stabilized gimbal for smooth video', 600, '/day', 3, 4.8, 22);

-- 🎉 EVENTS & PARTY
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Folding Chair Set (20)', 'Events - Chairs', 'Premium folding chairs for outdoor events', 800, '/day', 1, 4.6, 14),
('Party Tent 20x20', 'Events - Tents', 'Waterproof tent with removable sides', 1500, '/day', 2, 4.8, 21),
('LED Stage Lights (48)', 'Events - Lighting', 'RGB LED lights with controller', 1200, '/day', 3, 4.9, 17),
('PA System 2000W', 'Events - Sound', 'Professional amplifier and speakers', 1800, '/day', 1, 4.8, 25),
('Decoration Arch Kit', 'Events - Decor', 'Balloon arch and stand for weddings', 600, '/day', 2, 4.7, 19);

-- 🛠️ TOOLS & EQUIPMENT
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Bosch Power Drill Kit', 'Tools - Power Tools', 'Professional 18V drill with 50+ bits', 500, '/day', 1, 4.9, 47),
('Stanley Hand Tool Set', 'Tools - Hand Tools', 'Complete set with 100+ tools', 350, '/day', 2, 4.7, 28),
('JCB Excavator', 'Tools - Construction', 'Mini excavator for construction projects', 5000, '/day', 3, 4.8, 9),
('Lawn Mower - Automatic', 'Tools - Gardening', 'Self-propelled lawn mower for large areas', 800, '/day', 1, 4.6, 12),
('Aluminum Ladder 30ft', 'Tools - Ladders', 'Sturdy extension ladder for high work', 600, '/day', 2, 4.8, 15);

-- 🏕️ TRAVEL & ADVENTURE
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Coleman Tent 4-Person', 'Travel - Camping', 'Weatherproof tent with easy setup', 400, '/day', 1, 4.8, 36),
('Trekking Backpack 60L', 'Travel - Trekking', 'Comfortable pack with rain cover', 300, '/day', 2, 4.7, 24),
('Samsonite Luggage Set', 'Travel - Luggage', 'Lightweight 3-piece hardcase set', 600, '/day', 3, 4.9, 31),
('GoPro Adventure Bundle', 'Travel - GoPro', 'Action cam with mounts and accessories', 800, '/day', 1, 4.8, 19),
('Portable Camping Cooker', 'Travel - Coolers', 'Gas stove with portable tank', 300, '/day', 2, 4.6, 14);

-- 🧼 HOME APPLIANCES
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Dyson Vacuum V15', 'Appliances - Vacuum', 'Cordless vacuum with HEPA filter', 900, '/day', 1, 4.9, 38),
('Voltas 1.5 Ton AC', 'Appliances - AC', '5-star energy efficient air conditioner', 1200, '/day', 2, 4.8, 22),
('LG Washing Machine', 'Appliances - Washing', 'Fully automatic 7kg front-load machine', 1000, '/day', 3, 4.7, 18),
('Kent RO Water Purifier', 'Appliances - Water', 'Advanced RO+UV+UF purification', 800, '/day', 1, 4.8, 25),
('Philips Air Fryer', 'Appliances - Kitchen', 'Compact 4L air fryer for healthy cooking', 400, '/day', 2, 4.9, 32);

-- 👶 BABY & KIDS
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('Graco Baby Stroller', 'Baby - Strollers', 'Foldable stroller with sunshade', 400, '/day', 1, 4.8, 16),
('Chicco Car Seat', 'Baby - Car Seats', 'Safety-rated car seat for infants', 500, '/day', 2, 4.9, 20),
('LEGO Mega Collection', 'Baby - Toys', '5000+ pieces LEGO sets for kids', 300, '/day', 3, 4.7, 14),
('Study Desk with Chair', 'Baby - Furniture', 'Height-adjustable desk for children', 600, '/day', 1, 4.6, 11);

-- 🧑‍💻 OFFICE & STUDY
INSERT INTO items (name, category, description, price, period, owner_id, rating, reviews) VALUES
('ASUS ROG Gaming Laptop', 'Office - Laptops', 'High-performance laptop for coding', 2000, '/day', 1, 4.9, 34),
('Autonomous Standing Desk', 'Office - Desks', 'Electric standing desk with memory preset', 800, '/day', 2, 4.8, 21),
('Smart Whiteboard 75"', 'Office - Whiteboards', 'Interactive digital whiteboard', 1500, '/day', 3, 4.8, 18),
('WiFi 6 Router', 'Office - Connectivity', 'Ultra-fast mesh WiFi with 300mbps', 400, '/day', 1, 4.7, 25),
('Herman Miller Office Chair', 'Office - Chairs', 'Ergonomic chair for long work hours', 700, '/day', 2, 4.9, 28);
