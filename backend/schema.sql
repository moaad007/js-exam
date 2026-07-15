-- Schema for Riad Management & Reservation System (PostgreSQL)

CREATE TABLE riads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  city          VARCHAR(255) NOT NULL,
  address       VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  image_url     VARCHAR(512) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE rooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  riad_id       UUID NOT NULL REFERENCES riads(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  type          VARCHAR(50) NOT NULL CHECK (type IN ('Single','Double','Suite','Family')),
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  available     BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(255) NOT NULL,
  last_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(50) NOT NULL
);

CREATE TABLE reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  room_id       UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL CHECK (end_date > start_date),
  status        VARCHAR(20) NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Pending','Confirmed','Cancelled')),
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_riad ON rooms(riad_id);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_client ON reservations(client_id);
