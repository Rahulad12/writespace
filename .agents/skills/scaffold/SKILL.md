---
name: scaffold
description: Generate module boilerplate following module-structure.md
allowed-tools: [Bash, Read, Write]
argument-hint: "<module-name> <package: frontend|backend>"
---

# Scaffold Skill

Input: **$ARGUMENTS**

Parse module name and target package from arguments.

## Step 1 — Read the rules
Read `.agents/rules/module-structure.md` and identify the correct folder tree for the target package.

## Step 2 — Determine paths
- `frontend` → `client/src/modules/<module-name>/`
- `backend`  → `server/src/modules/<module-name>/`

Note: `src/shared/` already exists and is managed separately — never scaffold inside it.

## Step 3 — Create folder structure

### Frontend
```bash
mkdir -p client/src/modules/<module-name>/hooks
mkdir -p client/src/modules/<module-name>/services
mkdir -p client/src/modules/<module-name>/components
```

### Backend
```bash
mkdir -p server/src/modules/<module-name>/types
mkdir -p server/src/modules/<module-name>/routes
mkdir -p server/src/modules/<module-name>/controller
mkdir -p server/src/modules/<module-name>/services
```

## Step 4 — Create stub files with correct TypeScript content

### Frontend stubs
- `index.ts` — barrel with placeholder typed exports
- `page.tsx` — stub page component with `React.FC` type
- `types.ts` — empty type file with a placeholder interface
- `utils.ts` — one placeholder pure function stub with explicit return type
- `hooks/use<Module>.ts` — stub typed query hook
- `services/<module>.service.ts` — stub async function with explicit `Promise<T>` return type
- `components/<Module>Form.tsx` — stub form component with typed props
- `components/<Module>Table.tsx` — stub table component with typed props

### Backend stubs
- `index.ts` — registers router + re-exports types
- `types/<module>.types.ts` — request DTO interface + response DTO interface
- `routes/<module>.routes.ts` — stub router with one placeholder route
- `controller/<module>.controller.ts` — stub controller function with typed Request/Response
- `services/<module>.service.ts` — stub service function with explicit `Promise<ResponseDTO>` return type

## Step 5 — Report
List all created files with their full paths. Remind the agent to:
- Register the route (frontend router or backend app.ts)
- Fill in the TODO stubs
- Run `/test-gen` on the service file
- If any type is used by another module, move it to `src/shared/types/` instead
