# writespace — Project Wiki

**Last updated**: 2026-05-03
**Stack:** client: React + antd + TypeScript | server: Node.js/Express + TypeScript + PostgreSQL
**Scope:** fullstack

---

## Tech Stack

### Client (client/)
- React
- antd (Ant Design) component library
- TypeScript
- (Additional dependencies to be documented as client/package.json is created)

### Server (server/)
- Node.js + Express 5.x
- TypeScript 6.x
- PostgreSQL (pg driver)
- bcryptjs 3.x (password hashing)
- jsonwebtoken 9.x (JWT auth)
- dotenv 17.x
- cors 2.x
- Dev: nodemon, ts-node

## Repository Layout

```
writespace/
├── client/          ← React frontend (src/shared/, src/modules/)
├── server/          ← Express backend (src/shared/, src/modules/)
├── AGENTS.md        ← Agent instructions (root)
└── .agents/         ← AI-native SDLC configuration
```

## Project Scope
Fullstack application with React frontend and Node.js/Express backend using PostgreSQL.

## Frontend Package

Path: `client/src/`

Module structure:
- `src/shared/` — cross-module types, utils, hooks, components
- `src/modules/` — feature modules (one folder per domain)

Component library: antd
Routing: React Router (to be configured)
State management: React Query (to be configured)

## Backend Package

Path: `server/src/`

Existing modules:
- `auth` — authentication module
- `comment` — comments module
- `post` — posts module

Module structure:
- `src/shared/` — cross-module types, utils, middleware
- `src/modules/` — feature modules (auth, comment, post, etc.)

Database: PostgreSQL
ORM/Query builder: pg (node-postgres)
Auth: JWT via jsonwebtoken

## Shared (`src/shared/`)

Per-package shared folders contain:
- types/ — shared DTOs and interfaces
- utils/ — pure helper functions
- constants/ — app-wide constants
- hooks/ (client) or middlewares/ (server)

## API Layer

Server entry: `server/src/index.ts` → imports `server/src/app.ts`
Express app with CORS and JSON middleware
Database connection via pg pool (configured in `server/src/config/db.ts`)

## Authentication

JWT-based authentication
Token stored in environment variable: `JWT_SECRET`
Auth middleware location: `server/src/shared/middlewares/`

## Build & Deployment

Client: `cd client && npm run dev/build/lint`
Server: `cd server && npm run dev/build`

CI/CD: Not configured yet
Deployment target: Not configured yet

## Observability

Logging: Console-based (to be enhanced)
Error tracking: Not configured yet

## Module / Feature Conventions

Key patterns from module-structure.md:
- Feature-based modular architecture
- Strict TypeScript with no `any` types
- Layer separation: routes → controller → service (backend)
- Service layer for API calls, hooks for state (frontend)
- Explicit return types on all exported functions
