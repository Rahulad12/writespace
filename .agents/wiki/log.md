# Wiki Log

**Summary**: Append-only record of all wiki operations.
**Last updated**: 2026-05-05

---

## 2026-05-05

- **Completed**: Issue #10 — Define PostgreSQL schema and initial migrations
  - Installed `node-pg-migrate` and `tsx` as dev dependencies
  - Created `.node-pg-migrate.ts` config file
  - Added `migrate`, `migrate:down`, `migrate:create` scripts to `server/package.json`
  - Created 4 migration files in `server/migrations/`:
    - `001_create_users.ts` — users table with password_hash, updated_at, indexes
    - `002_create_blogs.ts` — blogs table with blog_status enum, author_id FK, status/created_at indexes
    - `003_create_bookmarks.ts` — bookmarks table with unique(user_id, blog_id) constraint
    - `004_create_follows.ts` — follows table with unique(follower_id, following_id) and no-self-follow check
  - Updated `server/src/modules/auth/auth.types.ts` — renamed `password` to `password_hash` in UserRow
  - Updated `server/src/modules/auth/auth.controller.ts` — changed INSERT column and bcrypt compare to use `password_hash`
  - Removed old raw SQL files from `server/src/shared/database-table/`
  - Added `DATABASE_URL` to `server/.env`
  - Fixed test import paths in `auth.controller.test.ts` and `auth.middleware.test.ts`
  - Added `"types": ["jest", "node"]` to `server/tsconfig.json`
  - All migrations tested: up and down both work
  - All 14 tests pass, build succeeds
- **Ran**: context-sync — updated `.agents/context/` files (73 files)
- **Completed**: Issue #11 — Implement user registration and login API with JWT
  - Created Zod validation middleware (`server/src/shared/middleware/validator.ts`) wired to auth routes
  - Updated login schema to accept email OR username as `identifier` field
  - Strengthened password validation: min 8 chars, uppercase letter, number required
  - Updated auth controller to query by email OR username
  - Added username login test case (total: 15 tests passing)
  - Manual API testing verified: 201 register, 409 duplicate, 400 validation, 200 login, 401 invalid creds
  - JWT confirmed: contains id, username, iat, exp (7 day TTL)
  - Password never returned in any response
- **Completed**: Issue #12 — Create JWT authentication middleware and route guards
  - Already existed: `authenticateToken` and `optionalAuth` middleware with 7 tests
  - Covers: valid token, missing token, expired token, invalid token, optional pass-through
  - Applied to auth routes, ready for other protected routes
- **Completed**: Issue #13 — Implement blog CRUD API endpoints
  - Created blog module following module-structure.md conventions
  - Created `blog.types.ts` — Zod schemas (createBlogSchema, updateBlogSchema), DTOs, BlogRow and BlogWithAuthor interfaces
  - Created `blog.service.ts` — business logic with DB calls (createBlog, getBlogs, getBlogById, updateBlog, deleteBlog)
  - Created `blog.controller.ts` — request parsing with proper error handling and auth checks
  - Created `blog.routes.ts` — routes with authenticateToken middleware on protected endpoints
  - Registered routes in `app.ts` at `/api/blogs`
  - Created `blog.service.test.ts` — 14 tests for service layer
  - Created `blog.controller.test.ts` — 10 tests for controller layer
  - All 24 tests pass, build succeeds
  - Endpoints: POST /api/blogs (auth), GET /api/blogs (public), GET /api/blogs/:id (public), PUT /api/blogs/:id (auth), DELETE /api/blogs/:id (auth)
- **Ran**: context-sync — updated `.agents/context/` files

## 2026-05-04

- **Updated**: `.agents/rules/testing.md` — co-located test-code structure, `/test` for requirement cases, pre-commit test checks
- **Updated**: `.agents/skills/test-gen/SKILL.md` — reflect co-located test structure and pre-commit check step
- **Moved**: test files to co-located locations (`server/src/modules/auth/auth.controller.test.ts`, `server/src/shared/middleware/auth.middleware.test.ts`)
- **Added**: Jest + ts-jest to server (`npm install --save-dev jest @types/jest ts-jest`)
- **Added**: `test` script to `server/package.json` and created `server/jest.config.js`
- **Ran**: context-sync — updated `.agents/context/file-tree.md`, `dependencies.md`, `symbols.md` (64 files)

## 2026-05-03

- **Init**: Set up AI-native SDLC configuration via `agents.setup.md`
- **Scope**: fullstack
- **Created**: `AGENTS.md`
- **Created**: `.agents/README.md`
- **Created**: `.agents/rules/` — 6 rule files (architectural, code-style, api-conventions, module-structure, security, testing)
- **Created**: `.agents/wiki/` — WIKI.md, index.md, log.md, mistakes.md
- **Created**: `.agents/decisions/` — README.md, ADR-000-template.md
- **Created**: `.agents/context/` — file-tree.md, dependencies.md, symbols.md
- **Created**: `.agents/sessions/` — README.md, current.md
- **Created**: `.agents/runbooks/` — deploy.md, rollback.md, incident-response.md, feature-flags.md
- **Created**: `.agents/taskboard/` — TASKBOARD.md, README.md
- **Created**: `.agents/skills/` — 7 skills (taskboard, prompt, scaffold, review, test-gen, context-sync, adr)
- **Created**: `.agents/raw/README.md`
- **Fixed**: `server/src/index.ts` was empty — added `import './app'` to start the server
