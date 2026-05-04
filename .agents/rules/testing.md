---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/tests/**"
  - "**/__tests__/**"
---
# Testing

> Run `/test-gen <source-file>` to generate test stubs — do not write test files from scratch.

## Structure
- **Automated test-code** (`.test.ts`, `.test.tsx`, `.spec.ts` files) are co-located with source files in their respective module/package directories
  - Pattern: For source file `<package>/src/<path>/<file>.ts`, test file is `<package>/src/<path>/<file>.test.ts`
  - Example: `server/src/modules/auth/auth.controller.ts` → `server/src/modules/auth/auth.controller.test.ts`
  - Example: `client/src/shared/utils/format.ts` → `client/src/shared/utils/format.test.ts`
  - Example: `server/src/shared/middleware/auth.middleware.ts` → `server/src/shared/middleware/auth.middleware.test.ts`
- **Requirement-based test cases** are stored in the top-level `/test` directory, organized per module:
  - Pattern: `/test/<package>/<module-path>/` (mirror the source module structure)
  - Example: `test/server/modules/auth/` for auth module server-side test cases
  - Example: `test/client/components/button/` for button component client-side test cases
- All automated tests must pass (run `cd <package> && npm run test`) before any commit or push to GitHub
- One describe block per component, function, or class
- Test names: "should [behaviour] when [condition]"

## Frontend — what to test
- Service functions: mock HTTP client, assert correct endpoint and payload
- Hooks: use `renderHook` + `act`
- Components: user interaction and visible output only — not implementation details

## Backend — what to test
- Service layer: unit test with mocked DB/ORM calls
- Controllers: integration test using a test HTTP client (supertest or equivalent)
- Schemas / DTOs: valid input + at least two invalid input cases

## Mocking
- Mock the HTTP client at module level for frontend service tests
- Mock DB/ORM calls (not services) for backend service unit tests
- Never mock data-fetching library internals (React Query, SWR)

## Coverage expectations
- All service functions: happy-path + one error-path test minimum
- All schemas: valid input + at least two invalid input cases
- Frontend components: user-facing behaviour only
- Backend controllers: 200, 400, 401/403 for every endpoint
