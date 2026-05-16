# writespace

A fullstack application combining a React frontend with a Node.js/Express backend and PostgreSQL database for collaborative writing and discussion.

## Stack

- **Frontend:** React + Ant Design (antd) + TypeScript
- **Backend:** Node.js + Express 5.x + TypeScript 6.x
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

## Project Structure

```
writespace/
├── client/              ← React frontend
│   ├── src/
│   │   ├── shared/      ← Shared types, utils, hooks, components
│   │   └── modules/     ← Feature modules (one folder per domain)
│   └── package.json
├── server/              ← Express backend
│   ├── src/
│   │   ├── shared/      ← Shared types, utils, middlewares
│   │   ├── modules/     ← Feature modules (auth, comment, post, etc.)
│   │   ├── app.ts       ← Express app setup
│   │   └── index.ts     ← Entry point
│   ├── dist/            ← Compiled JavaScript
│   ├── package.json
│   └── .env             ← Environment variables
├── .agents/             ← AI-native SDLC configuration
└── docs/                ← Additional documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulad12/writespace.git
   cd writespace
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure server environment**
   
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/writespace
   JWT_SECRET=your-secret-key-change-this
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Create a PostgreSQL database named `writespace`:
   ```bash
   createdb writespace
   ```

5. **Build the server**
   ```bash
   npm run build
   ```

6. **Install client dependencies** (in a new terminal)
   ```bash
   cd client
   npm install
   ```

### Development

**Backend Development Server:**
```bash
cd server
npm run dev
```
Starts on http://localhost:5000 with auto-reload via nodemon.

**Frontend Development Server:**
```bash
cd client
npm run dev
```
Starts on http://localhost:5173 (or another available port).

### Building for Production

**Build Server:**
```bash
cd server
npm run build
```
Outputs compiled code to `dist/`.

**Start Production Server:**
```bash
cd server
npm start
```

**Build Client:**
```bash
cd client
npm run build
```
Outputs optimized build to `build/` or `dist/`.

## Testing

**Run Server Tests:**
```bash
cd server
npm run test
```
Uses Jest for unit and integration testing.

## Code Quality

**Lint Server:**
```bash
cd server
npm run lint
```

**Lint Client:**
```bash
cd client
npm run lint
```

## API Conventions

The backend follows these patterns:

- **Routes:** Feature-based modular architecture in `src/modules/`
- **Layer Separation:** Routes → Controller → Service
- **Validation:** Schema-based validation using Zod
- **Authentication:** JWT middleware for protected routes
- **Error Handling:** Centralized error handling middleware

## Frontend Patterns

- **Component Library:** All UI uses Ant Design (antd) components
- **State Management:** React Query for server state (configured)
- **Routing:** React Router (configured)
- **Types:** Strict TypeScript with no `any` types
- **Shared Logic:** Reusable hooks and utilities in `src/shared/`

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- User credentials are validated using bcryptjs
- Successful login returns a JWT token
- Token must be sent in the `Authorization` header for protected routes
- Token secret is configured via `JWT_SECRET` environment variable

## Key Features

- **Authentication Module:** User login/logout and token management
- **Posts Module:** Create, read, update, delete posts
- **Comments Module:** Add comments to posts

## Module Structure

Each module follows this structure:

**Backend (server/src/modules/\<feature\>/)**
```
├── routes.ts      ← Express route handlers
├── controller.ts  ← Request handling logic
├── service.ts     ← Business logic and database operations
├── types.ts       ← TypeScript interfaces and DTOs
└── __tests__/     ← Module tests
```

**Frontend (client/src/modules/\<feature\>/)**
```
├── components/    ← React components
├── hooks/         ← Custom hooks for data fetching/state
├── services/      ← API client functions
├── types.ts       ← TypeScript interfaces
└── __tests__/     ← Component and hook tests
```

## Development Workflow

1. **Create a feature branch** off `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/issue-id-description
   ```

2. **Scaffold new modules** (use provided scaffolding tool):
   ```bash
   /scaffold feature-name client  # or server
   ```

3. **Follow the architectural checklist** in `.agents/rules/architectural.md`

4. **Write tests** alongside features

5. **Self-review before submitting:**
   ```bash
   /review
   ```

6. **Push to your feature branch** and open a Pull Request targeting `develop`

## Environment Variables

**Server (.env)**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/writespace
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Never commit secrets** — use environment variables and `.env` (which is in .gitignore).

## Documentation

- `.agents/wiki/WIKI.md` — Complete project reference
- `.agents/rules/` — Coding standards and conventions
- `.agents/decisions/` — Architecture Decision Records
- `docs/` — Additional documentation

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` is correct
- Ensure the database `writespace` exists

### Port Already in Use
- Server: Change `PORT` in `.env`
- Client: The dev server will automatically select an available port

### TypeScript Errors
- Run `npm run build` to check for compilation errors
- Ensure all types are properly imported and no `any` types are used

## Support & Contact

For issues or questions, please refer to the project documentation in `.agents/` or open an issue in the repository.

## License

ISC
