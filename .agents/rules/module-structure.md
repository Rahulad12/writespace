---
paths:
  - "src/**"
  - "apps/**"
  - "packages/**"
  - "services/**"
  - "backend/**"
  - "frontend/**"
---
# Module Structure — Feature-Based Modular Architecture

> Always run `/scaffold <feature-name> <frontend|backend>` instead of creating folders manually.
> TypeScript is mandatory and strictly enforced on both layers — no exceptions.

---

## TypeScript Contract (applies to every file, both layers)

- `tsconfig.json` must have `"strict": true` and `"noImplicitAny": true`
- No `@ts-ignore` without an accompanying `// reason:` comment on the same line
- No `@ts-expect-error` without a comment explaining why it is expected
- No `as T` type assertions as a substitute for proper typing
- All exported functions must have explicit return types
- Hooks return typed data — never `unknown` or `any` in a hook signature
- Service functions return `Promise<T>` — never `Promise<any>`
- DTOs and response types always explicitly defined — never expose raw DB model shapes to callers
- Form types derived from schema: `z.infer<typeof schema>` — never hand-rolled duplicates
- Barrel `index.ts` files must re-export with explicit types

---

## Top-level `src/` layout (applies to BOTH frontend and backend packages)

```
src/
├── shared/          ← cross-module utilities, types, hooks, constants, middleware
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── hooks/       ← (frontend only) hooks used by 2+ modules
│   ├── components/  ← (frontend only) generic UI used by 2+ modules
│   └── middlewares/ ← (backend only) auth guard, error handler, rate limiter
└── modules/         ← all feature modules live here
    ├── <module-a>/
    ├── <module-b>/
    └── <module-c>/
```

**Key rule:** `shared/` is a sibling of `modules/` under `src/` — it is never nested inside a module folder.

---

## SECTION A — Frontend

> Path: `client/src`
> Framework: React
> Component library: antd

### `src/shared/` — cross-module only

```
src/
└── shared/
    ├── types/          ← interfaces and types used by 2+ modules
    ├── utils/          ← pure helper functions, formatters, validators
    ├── constants/      ← app-wide enums, config values, route path constants
    ├── hooks/          ← hooks used by 2+ modules (e.g. useAuth, useToast)
    └── components/     ← truly reusable UI (Button, Modal, Table, Input, Layout)
```

Rules for `shared/`:
- A component or hook belongs here **only if used by two or more modules**
- No module-specific business logic or API calls
- All exports explicitly typed — no inferred `any`
- No imports from any module folder

### `src/modules/` — one folder per domain feature

```
src/
└── modules/
    └── <module-name>/
        ├── index.ts                    ← barrel: re-exports the public API of this module
        ├── page.tsx                    ← route-level component — one per module entry point
        ├── types.ts                    ← types and interfaces scoped to this module only
        ├── utils.ts                    ← helpers scoped to this module only
        ├── hooks/
        │   └── use<Module>.ts          ← all stateful logic for this module
        ├── services/
        │   └── <module>.service.ts     ← raw async API calls — no UI logic, no hooks
        └── components/
            ├── <Module>Form.tsx
            ├── <Module>Table.tsx
            └── <Module>Card.tsx
```

Rules for module folders:
- **Components inside a module are not shared globally.** If another module needs the same UI, move it to `src/shared/components/`
- `page.tsx` is the only file imported by the router — it composes everything else in the module
- `types.ts` may import from `src/shared/types/` but **never from another module**
- `services/` functions call only the HTTP client wrapper — no business logic, no hooks
- `hooks/` imports from `services/` via the module barrel (`index.ts`) — never deep-imports service internals
- `utils.ts` contains pure functions only — no API calls, no hooks, no side effects
- React components use explicit prop types: `const X: React.FC<Props>` or inline `({ foo }: { foo: string })`
- No cross-module imports — `modules/orders/` never imports from `modules/users/`

### Routing registration

Route registration lives in `client/src/App.tsx` or router config.
Import only from the module's `index.ts` barrel — never from internal module paths.

---

## SECTION B — Backend (Node.js, strict TypeScript)

> Path: `server/src`
> Framework: Express
> Database / ORM: pg (node-postgres)

### `src/shared/` — cross-module only

```
src/
└── shared/
    ├── types/          ← shared DTOs, pagination types, error shapes used across modules
    ├── utils/          ← pure helpers (date formatting, string ops, crypto utils)
    ├── constants/      ← error codes, status codes, config keys
    └── middlewares/    ← auth guard, error handler, request logger, rate limiter
```

Rules for `shared/`:
- Middleware lives here — never duplicated per module
- No DB access and no module-specific business logic
- All exports explicitly typed — no implicit `any`
- No imports from any module folder

### `src/modules/` — one folder per domain feature

```
src/
└── modules/
    └── <module-name>/
        ├── index.ts                          ← registers routes + re-exports public types
        ├── types/
        │   └── <module>.types.ts             ← request DTOs, response types, domain interfaces
        ├── routes/
        │   └── <module>.routes.ts            ← route definitions only — no logic
        ├── controller/
        │   └── <module>.controller.ts        ← parse req, call service, return response
        └── services/
            └── <module>.service.ts           ← all business logic + DB/ORM calls
```

Layer responsibilities (strictly enforced):

| Layer | Allowed | Forbidden |
|---|---|---|
| `routes` | Register paths, attach middleware | Any logic, DB access |
| `controller` | Parse req, call service, send res | Business logic, DB access |
| `services` | All business logic, DB/ORM calls | HTTP concerns, req/res objects |

TypeScript rules per layer:
- Controllers typed with `Request<Params, ResBody, ReqBody, Query>` from express
- Service functions: explicit return type `Promise<ResponseDTO>` — never `Promise<any>`
- DTOs in `types/` — request shapes validated by schema (zod/joi) **before** reaching the controller
- `index.ts` is the module's public contract: mounts routes and re-exports types needed by other modules

### Route registration

Each module's `index.ts` exports its router. The app entry point mounts all module routers at `server/src/app.ts`.

---

## SECTION C — What belongs in `src/shared/` vs `src/modules/<module>/`

| Content | `src/shared/` | `src/modules/<module>/` |
|---|---|---|
| Button, Input, Modal (generic) | ✅ used by 2+ modules | ❌ |
| UserAvatar (user-specific) | ❌ | ✅ modules/users/components/ |
| useAuth, useToast, usePermission | ✅ | ❌ |
| useOrderFilters, useProductSearch | ❌ | ✅ inside the module |
| API base URL, env constants | ✅ | ❌ |
| Order status enum | ❌ | ✅ modules/orders/types.ts |
| Auth middleware, error handler | ✅ shared/middlewares/ | ❌ |
| Order validation schema | ❌ | ✅ modules/orders/types/ |
| Pagination helper | ✅ if used by 2+ modules | ❌ |

**Decision rule:** if you find yourself copying a file from one module to another, that file belongs in `src/shared/`. Do not duplicate — move it.

---

## SECTION D — Cross-boundary import rules

```
src/modules/<any>   →  src/shared             ✅ allowed
src/shared          →  src/modules/<any>       ❌ NEVER
src/modules/a       →  src/modules/b           ❌ NEVER — move to shared if needed
frontend package    →  backend package         ❌ NEVER
backend package     →  frontend package        ❌ NEVER
```

---

## Prohibited actions (all layers)

- Never add a component to a module if it is already used elsewhere — move it to `src/shared/`
- Never import from `../module-b/` inside `module-a/` — no cross-module imports
- Never put business logic in a controller, route handler, or page component
- Never rename files without updating `index.ts` barrels and `.agents/context/`
- Never use `any` — use `unknown` + type guards or define the type explicitly
- Never store environment-specific values as hard-coded strings — use `src/shared/constants/`
- Never add a new top-level folder without documenting it in the wiki and creating an ADR
- Never create `shared/` inside a module folder — it belongs at `src/shared/`
