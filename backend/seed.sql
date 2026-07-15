-- Seed data for Riad Management & Reservation System (PostgreSQL)

INSERT INTO riads (id, name, city, address, description, price_per_night, image_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Riad La Perle', 'Marrakech', '12 Derb Sidi Ahmed, Medina', 'A beautifully restored traditional riad with a central courtyard and rooftop terrace.', 1200, 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=800'),
  ('22222222-2222-2222-2222-222222222222', 'Riad Le Jardin', 'Marrakech', '5 Rue de la Kasbah', 'Peaceful riad surrounded by lush gardens and a refreshing plunge pool.', 1500, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
  ('33333333-3333-3333-3333-333333333333', 'Riad Azure', 'Fes', '22 Boulevard Mohammed V', 'Modern comfort meets Moroccan heritage in the heart of Fes.', 1100, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');

INSERT INTO rooms (id, riad_id, name, type, price_per_night, available) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Room Jasmine', 'Double', 900, true),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Room Rose', 'Single', 600, true),
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Suite Majorelle', 'Suite', 1500, true),
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Room Palm', 'Family', 1800, true),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Room Olive', 'Double', 1000, false),
  ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Room Saffron', 'Double', 850, true);

INSERT INTO clients (id, first_name, last_name, email, phone) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'Alice', 'Martin', 'alice@example.com', '+212600000000');

INSERT INTO reservations (id, client_id, room_id, start_date, end_date, status) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '2026-08-10', '2026-08-15', 'Confirmed');
