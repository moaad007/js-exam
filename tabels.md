# Product Requirements Document (PRD)

# Riad Management & Reservation System

**Version:** 1.0

**Project Type:** Full Stack Web Application

**Frontend:** Next.js 15 (App Router)

**Backend:** Node.js + Express

**Database:** PostgreSQL

**ORM:** Prisma ORM

**Authentication:** JWT (Bonus)

**Deployment**

* Frontend → Vercel
* Backend → Railway or Render
* Database → PostgreSQL (Railway/Neon/Supabase)

---

# 1. Project Overview

A riad rental agency in Marrakech wants to digitize the management of its catalog.

The application must allow customers to:

* Browse available riads
* View rooms
* Check room availability
* Make reservations

Administrators should be able to:

* Manage riads
* Manage rooms
* View reservations
* Manage the catalog

The application consists of two parts:

* Public Website
* Administration Dashboard

---

# 2. Goals

### Public

* Browse riads
* Search riads
* View details
* Reserve a room

### Administration

* CRUD Riads
* CRUD Rooms
* View Reservations
* Prevent double bookings

---

# 3. Tech Stack

## Frontend

Next.js 15

App Router

TypeScript

TailwindCSS

Shadcn UI

React Hook Form

Zod

Axios

TanStack Query

---

## Backend

Node.js

Express

Prisma ORM

JWT Authentication

Multer (optional)

---

## Database

PostgreSQL

---

# 4. User Roles

## Visitor

Can

* Browse riads
* View details
* Reserve rooms

---

## Administrator

Can

* Login
* Create Riads
* Edit Riads
* Delete Riads
* Manage Rooms
* View Reservations

---

# 5. Functional Requirements

---

# Module 1 — Public Website

## Homepage

Display all riads.

Each card contains

* Image
* Name
* City
* Starting price
* Short description
* View Details button

---

## Pagination

Support pagination.

Example

12 riads

6 per page

Page 1

Page 2

---

## Search & Filters (Bonus)

Search by

* Name
* City

Filter

* Price
* Availability

---

# Module 2 — Riad Details

Display

Large image

Name

City

Address

Description

Base price

---

Display available rooms.

Each room contains

* Name
* Type
* Price
* Availability

Example

Room Jasmine

Double

900 MAD

Available

---

# Module 3 — Reservation

Customer selects

Room

Arrival date

Departure date

Customer information

* First name
* Last name
* Email
* Phone

---

Reservation Validation

System must verify

* End date > Start date
* Required fields
* Email format
* Room exists
* Room available

---

Availability Rule

A room cannot be reserved if another reservation overlaps.

Example

Existing reservation

10 July → 15 July

New reservation

12 July → 18 July

❌ Reject

Example

Existing

10 →15

New

16 →20

✅ Accept

---

Reservation Status

Pending

Confirmed

Cancelled

---

Reservation Success

Display confirmation message

Reservation number

---

# Module 4 — Administration Dashboard

Protected route

/admin

---

Dashboard

Cards

Total Riads

Total Rooms

Available Rooms

Reservations

---

Recent Reservations

Newest first

---

# Module 5 — Riad Management

CRUD Operations

Create

Update

Delete

View

---

Fields

Name

City

Address

Description

Price per Night

Image URL

---

Validation

Required fields

Positive price

Image URL format

---

# Module 6 — Room Management

Each room belongs to one riad.

---

Fields

Name

Type

Price per Night

Available

Riad

---

Room Types

Single

Double

Suite

Family

---

CRUD

Create

Update

Delete

View

---

# Module 7 — Reservation Management

Admin can

View reservations

Cancel reservation

Confirm reservation

---

Reservation List

Columns

Reservation ID

Customer

Room

Riad

Arrival

Departure

Status

Created At

---

Sorting

Newest first

---

# 6. Database Design

---

## Table: Riads

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| name          | String    |
| city          | String    |
| address       | String    |
| description   | Text      |
| pricePerNight | Decimal   |
| imageUrl      | String    |
| createdAt     | Timestamp |

---

## Table: Rooms

| Field         | Type    |
| ------------- | ------- |
| id            | UUID    |
| riadId        | UUID FK |
| name          | String  |
| type          | String  |
| pricePerNight | Decimal |
| available     | Boolean |

---

## Table: Clients

| Field     | Type          |
| --------- | ------------- |
| id        | UUID          |
| firstName | String        |
| lastName  | String        |
| email     | String Unique |
| phone     | String        |

---

## Table: Reservations

| Field     | Type                            |
| --------- | ------------------------------- |
| id        | UUID                            |
| clientId  | UUID FK                         |
| roomId    | UUID FK                         |
| startDate | Date                            |
| endDate   | Date                            |
| status    | Pending / Confirmed / Cancelled |
| createdAt | Timestamp                       |

---

# Relationships

```
Riad
 ├── hasMany Rooms

Room
 ├── belongsTo Riad
 ├── hasMany Reservations

Client
 ├── hasMany Reservations

Reservation
 ├── belongsTo Client
 ├── belongsTo Room
```

---

# 7. REST API

## Riads

GET /api/riads

Returns all riads.

---

GET /api/riads/:id

Returns a single riad.

---

POST /api/riads

Create riad.

---

PUT /api/riads/:id

Update riad.

---

DELETE /api/riads/:id

Delete riad.

---

## Rooms

GET /api/riads/:id/rooms

Returns rooms for a riad.

---

POST /api/rooms

Create room.

---

PUT /api/rooms/:id

Update room.

---

DELETE /api/rooms/:id

Delete room.

---

## Reservations

POST /api/reservations

Create reservation.

---

GET /api/reservations

List reservations (Admin).

---

PATCH /api/reservations/:id

Update reservation status.

---

# 8. Business Rules

### Riad

* Name is required.
* Price must be greater than zero.

---

### Room

* Must belong to a riad.
* Price must be greater than zero.

---

### Reservation

* Start date cannot be in the past.
* End date must be after start date.
* No overlapping reservations for the same room.
* Customer email is unique.
* Required fields cannot be empty.

---

# 9. UI Pages

## Public

```
/
```

Homepage

---

```
/riads
```

Riad listing

---

```
/riads/[id]
```

Riad details

---

```
/reservation
```

Reservation form

---

## Admin

```
/admin
```

Dashboard

---

```
/admin/riads
```

Manage riads

---

```
/admin/riads/new
```

Create riad

---

```
/admin/riads/[id]/edit
```

Edit riad

---

```
/admin/rooms
```

Manage rooms

---

```
/admin/reservations
```

Reservations

---

# 10. Folder Structure

```
riad-management/

├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── prisma/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   │
│   ├── tests/
│   │   └── reservation.test.ts
│   │
│   ├── schema.sql
│   ├── seed.sql
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── (public)/
│   │   ├── admin/
│   │   ├── api/
│   │   └── layout.tsx
│   │
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# 11. Testing

At least one integration test must verify the reservation endpoint:

* A reservation is successfully created when the room is available.
* A reservation is rejected with an HTTP `409 Conflict` when the requested dates overlap an existing reservation for the same room.

---

# 12. Deliverables

The project should include:

* Complete backend source code
* Complete frontend source code
* `README.md` with installation, setup, and deployment instructions
* `.env.example` files for both frontend and backend
* `schema.sql` and `seed.sql`
* Git repository or ZIP archive
* Deployed frontend (Vercel) and backend (Railway or Render) with accessible URLs
* Optional screenshots demonstrating the application

---

# 13. Evaluation Mapping (20 Points)

| Requirement                                                     | Points |
| --------------------------------------------------------------- | -----: |
| Database schema, constraints, and seed data                     |      3 |
| Backend CRUD API for riads                                      |      4 |
| Backend room management and reservation availability validation |      4 |
| Frontend riad listing and detail pages                          |      3 |
| Functional reservation form                                     |      3 |
| Admin interface for riad CRUD                                   |      1 |
| Code quality, organization, and error handling                  |      2 |
| Bonus features (authentication, search, filters)                |     +2 |

This PRD fully covers the exam requirements while organizing them into a production-ready specification suitable for building the application with **Next.js + Express + PostgreSQL + Prisma**.
