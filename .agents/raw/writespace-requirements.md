# WriteSpace — Blog Platform

> A full-stack blogging platform where users can write, publish, and interact with blog posts. Built with Node.js, Express, React, TypeScript, and PostgreSQL.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Project Overview

WriteSpace is a blogging platform that allows users to register, log in, create blog posts, and interact with others through comments and likes. It follows a clean modular architecture on the backend and a component-based structure on the frontend.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL driver |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `dotenv` | Environment variable management |
| `cors` | Cross-origin resource sharing |
| `nodemon` + `ts-node` | Development server with hot reload |

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| TypeScript | Type safety |
| React Router | Client-side routing |
| Axios | HTTP requests |
| Context API | Global state management (auth) |

---

## Features

### MVP (Phase 1)
- User registration and login with JWT authentication
- Create, read, and delete blog posts
- View all posts on the home feed
- View a single post with full content
- Add comments to a post
- Protected routes (only logged-in users can create/delete)

### Phase 2
- Like / unlike posts
- User profile pages
- Edit existing posts
- Pagination on the home feed

### Phase 3
- Tags on posts
- Search posts by title or tag
- Bookmarks / saved posts

---

## Project Structure

```
writespace/
├── server/                        # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # PostgreSQL pool connection
│   │   │   └── env.ts             # Centralized environment variables
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── post/
│   │   │   │   ├── post.types.ts
│   │   │   │   ├── post.controller.ts
│   │   │   │   └── post.routes.ts
│   │   │   └── comment/
│   │   │       ├── comment.types.ts
│   │   │       ├── comment.controller.ts
│   │   │       └── comment.routes.ts
│   │   ├── shared/
│   │   │   └── middleware/
│   │   │       └── auth.middleware.ts
│   │   ├── app.ts                 # Express app setup
│   │   └── index.ts               # Server entry point
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
└── client/                        # Frontend (React + TypeScript)
    ├── src/
    │   ├── api/                   # Axios API calls
    │   ├── components/            # Reusable UI components
    │   ├── context/               # Auth context
    │   ├── pages/                 # Route-level page components
    │   ├── types/                 # Shared TypeScript interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── tsconfig.json
    └── package.json
```

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| username | VARCHAR(50) | Unique, required |
| email | VARCHAR(100) | Unique, required |
| password | VARCHAR(255) | Hashed with bcrypt |
| bio | TEXT | Optional |
| created_at | TIMESTAMP | Auto-set |

### `posts`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK → users(id) |
| title | VARCHAR(255) | Required |
| content | TEXT | Required |
| created_at | TIMESTAMP | Auto-set |

### `comments`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| post_id | INTEGER | FK → posts(id) |
| user_id | INTEGER | FK → users(id) |
| content | TEXT | Required |
| created_at | TIMESTAMP | Auto-set |

### `likes`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| post_id | INTEGER | FK → posts(id) |
| user_id | INTEGER | FK → users(id) |
| — | UNIQUE | One like per user per post |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT token |

### Posts — `/api/posts`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Get all posts |
| GET | `/:id` | No | Get a single post |
| POST | `/` | Yes | Create a new post |
| DELETE | `/:id` | Yes | Delete own post |

### Comments — `/api/comments`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:postId` | No | Get comments for a post |
| POST | `/:postId` | Yes | Add a comment to a post |

---

## Requirements

### System Requirements
- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL v14 or higher

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^5.x",
    "pg": "^8.x",
    "dotenv": "^17.x",
    "cors": "^2.x",
    "bcryptjs": "^3.x",
    "jsonwebtoken": "^9.x"
  },
  "devDependencies": {
    "typescript": "^.x",
    "ts-node": "^10.x",
    "nodemon": "^3.x",
    "@types/express": "^5.x",
    "@types/pg": "^8.x",
    "@types/cors": "^2.x",
    "@types/bcryptjs": "^2.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/node": "^20.x"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "typescript": "^6.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=writespace
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key_here
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd writespace
```

### 2. Set up the database

```bash
psql -U postgres -c "CREATE DATABASE writespace;"
psql -U postgres -d writespace -f server/db/schema.sql
```

### 3. Start the backend

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`  
Frontend runs on: `http://localhost:5173`

---

*WriteSpace — built to practice SQL and full-stack TypeScript development.*