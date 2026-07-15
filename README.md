# Riad Management & Reservation System

A full-stack web application for a Marrakech riad rental agency.
Customers can browse riads, view rooms, check availability, and make
reservations. Administrators can manage the catalog and reservations via a
protected dashboard.

**Tech stack**
- **Frontend:** Next.js 15 (App Router, JavaScript), TailwindCSS, TanStack Query, React Hook Form + Zod
- **Backend:** Node.js + Express (JavaScript), Prisma ORM, JWT auth
- **Database:** PostgreSQL

---

## 1. Prerequisites

- Node.js >= 18
- PostgreSQL running locally (or a hosted PostgreSQL URL)

## 2. Database setup (local)

Create a database and user, then copy credentials into `backend/.env`:

```sql
CREATE DATABASE riad_management;
CREATE USER riad_user WITH PASSWORD 'riad_password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE riad_management TO riad_user;
```

> The `CREATEDB` privilege is required so Prisma can create its shadow database
> during migrations.

## 3. Backend

```bash
cd backend
npm install
cp .env.example .env        # adjust DATABASE_URL if needed
npx prisma migrate dev       # creates tables
npm run seed                 # inserts sample riads, rooms, admin
npm run dev                  # http://localhost:4000
```

API base: `http://localhost:4000/api`

Default admin credentials (seeded by `npm run seed`):
`admin@riad.com` / `admin123`

### Tests

```bash
npm test
```

Verifies: reservation creation succeeds when available, returns `409 Conflict`
on overlapping dates, and `400` when end date is before start date.

### SQL deliverables

Plain SQL files are also provided:
- `backend/schema.sql` — DDL
- `backend/seed.sql` — seed data

## 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev                  # http://localhost:3000
```

### Public pages
- `/` — homepage listing all riads (search, filter, pagination)
- `/riads` — riad listing
- `/riads/[id]` — riad details with rooms
- `/reservation` — reservation form (`?roomId=` preselects a room)
- `/reservation/success` — confirmation with reservation number

### Admin pages
- `/admin/login` — admin login
- `/admin` — dashboard (stats + recent reservations)
- `/admin/riads` — manage riads (CRUD)
- `/admin/riads/new`, `/admin/riads/[id]/edit`
- `/admin/rooms` — manage rooms
- `/admin/reservations` — view / confirm / cancel reservations

## 5. REST API

| Method | Endpoint                      | Description                       |
| ------ | ----------------------------- | --------------------------------- |
| GET    | `/api/riads`                  | List riads (pagination, search)  |
| GET    | `/api/riads/:id`              | Single riad with rooms            |
| POST   | `/api/riads`                  | Create riad (admin)               |
| PUT    | `/api/riads/:id`              | Update riad (admin)               |
| DELETE | `/api/riads/:id`              | Delete riad (admin)               |
| GET    | `/api/rooms`                  | List all rooms                    |
| GET    | `/api/riads/:id/rooms`        | Rooms for a riad                  |
| POST   | `/api/rooms`                  | Create room (admin)               |
| PUT    | `/api/rooms/:id`              | Update room (admin)               |
| DELETE | `/api/rooms/:id`              | Delete room (admin)               |
| POST   | `/api/reservations`           | Create reservation                |
| GET    | `/api/reservations`           | List reservations (admin)         |
| PATCH  | `/api/reservations/:id`       | Update status (admin)             |
| POST   | `/api/auth/login`             | Admin login → JWT                 |
| POST   | `/api/auth/register`          | Create admin user                 |
| GET    | `/api/stats`                  | Dashboard statistics              |

## 6. Business rules enforced

- Riad/room price must be > 0, required fields validated (Zod).
- Reservation: start date not in past, end date after start date.
- No overlapping reservations for the same room (returns `409 Conflict`).
- Customer email is unique (upsert).

## 7. Deployment

### Monorepo on Vercel

The root `vercel.json` defines two services (`frontend`, `backend`) and
rewrites so the backend is reachable from the frontend at `/api/backend`:

- Import the repo as a **Vercel monorepo** (Root Directory = `.`).
- Vercel reads `vercel.json`: the `frontend` service uses the Next.js
  framework; the `backend` service is deployed as a Node server.
- Set the frontend environment variable:
  - `NEXT_PUBLIC_API_URL=/api/backend` (so calls hit the rewrite proxy)
- Set the backend environment variables:
  - `DATABASE_URL` → your PostgreSQL provider (Neon / Supabase / Railway)
  - `JWT_SECRET`, `CLIENT_URL` (optional, CORS)
  - Add a build/start step: `npx prisma migrate deploy`
- **Database → PostgreSQL** (Railway / Neon / Supabase).

> Locally, `NEXT_PUBLIC_API_URL` stays `http://localhost:4000/api`.

### Alternative (separate projects)

- **Frontend → Vercel:** import the `frontend` folder, set
  `NEXT_PUBLIC_API_URL` to the deployed backend URL.
- **Backend → Railway / Render:** deploy the `backend` folder, set
  `DATABASE_URL` to your PostgreSQL provider and
  run `npx prisma migrate deploy` as a build/start step.
