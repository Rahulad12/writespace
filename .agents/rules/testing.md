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
- Co-locate tests with source files inside the module folder
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
