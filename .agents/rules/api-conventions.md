---
paths:
  - "**/services/**"
  - "**/api/**"
  - "**/hooks/**"
  - "**/queries/**"
  - "**/routes/**"
  - "**/controllers/**"
  - "**/handlers/**"
---
# API Conventions

## Service layer (frontend)
- Raw async functions only — no UI logic, no hooks
- Always use the project's HTTP wrapper — never the raw HTTP client directly
- All functions have explicit return types: `Promise<ResponseDTO>`

## Service layer (backend)
- Controllers call services — never put business logic in the route handler
- Services contain all business logic and call the DB/ORM directly
- No repository layer unless explicitly added via ADR

## Layer responsibility (backend — strictly enforced)

| Layer | Allowed | Forbidden |
|---|---|---|
| `routes` | Register paths, attach middleware | Any logic, DB access |
| `controller` | Parse req, call service, send res | Business logic, DB access |
| `services` | All business logic, DB/ORM calls | HTTP concerns, req/res objects |

## TypeScript types per layer (backend)
- Controllers typed with `Request<Params, ResBody, ReqBody, Query>` from express
- Service functions: explicit `Promise<ResponseDTO>` return type — never `Promise<any>`
- Request bodies validated by schema (zod/joi) before reaching the controller

## Data fetching (frontend)
- Always use `keepPreviousData` / `placeholderData` on paginated list queries
- `staleTime` and `refetchOnMount` set globally — do not override without reason
- Import service functions from the module's `index.ts` barrel — never deep-import

## Mutations (frontend)
- `onSuccess`: show success toast + invalidate relevant query keys
- `onError`: use `showToastErrors(error)` — never `toast.error(err.message)` directly
- Use `isPending` (not `isLoading`) for mutation loading state

## Query keys (frontend)
- Use a key factory function — never hand-roll key arrays
- `MAIN_KEY` string: kebab-case matching the resource name

## API response shape
- Success: `{ data: T, meta?: PaginationMeta }`
- Error: `{ error: { code: string, message: string, details?: unknown } }`
- Never return raw database models — always map to a DTO/response type

## Error handling
- 401 / 403 handled globally by the HTTP interceptor (frontend)
- Never access `error.response` directly in components
- Backend: all unhandled errors caught by a global error handler middleware
