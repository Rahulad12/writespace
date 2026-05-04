# writespace — Agents Instructions

**Stack:** client: React + antd + TypeScript | server: Node.js/Express + TypeScript + PostgreSQL
**Repo type:** single package (client/ + server/ directories)
**Scope:** fullstack

---

## Start Here — Every Session

Run these three commands at the start of every session before touching any code:

```bash
# 1. Refresh codebase context
/context-sync

# 2. Check what was in progress
cat .agents/sessions/current.md

# 3. Pull fresh task board (GitLab not configured)
# /taskboard sync
```

Then read:
- `.agents/README.md` — master navigation for all rules, wiki, and skills
- `.agents/rules/architectural.md` — mandatory 4-phase checklist for every new feature
- `.agents/rules/module-structure.md` — strict folder rules for client/ and server/

---

## Critical Rules — NEVER Break

1. Follow the exact folder and file structure for client/ and server/ — see `.agents/rules/module-structure.md`
2. Never push to `main` — always push to `develop` or a feature branch
3. Never rename, reorganize, or restructure existing files without updating `.agents/context/`
4. Never add files to a package that belongs to a different layer
5. Form validation must use a schema library — never trust raw form input
6. Never store secrets or tokens in source code
7. All UI must use antd component library — no inline styles or one-off components
8. Shared logic lives in `src/shared/` only — never duplicate across modules
9. Before starting any feature, run `/scaffold` — do not create module folders manually
10. Before opening any MR, run `/review` — do not skip the self-review step
11. Every architectural decision gets an ADR — run `/adr new <title>`
12. At the end of every session, update `.agents/sessions/current.md`
13. When you make a mistake that required rework, append it to `.agents/wiki/mistakes.md`

---

## Dev Commands

### Client
```bash
cd client && npm run dev
cd client && npm run build
cd client && npm run lint
```

### Server
```bash
cd server && npm run dev
cd server && npm run build
cd server && npm run test
```

---

## Packages / Services

| Package | Path | Type | Stack |
|---|---|---|---|
| client | client/ | frontend | React + antd + TypeScript |
| server | server/ | backend | Node.js/Express + TypeScript + PostgreSQL |

---

## Key Files

| File | Package | Purpose |
|---|---|---|
| server/src/app.ts | server | Express app setup, middleware, routes |
| server/src/index.ts | server | Entry point (imports app) |
| client/src/App.tsx | client | React app root, routing |
| server/.env | server | Environment variables (DB, JWT, PORT) |

---

## Feature Workflow

1. Branch: `feature/<issue-id>-<short-slug>` off `develop`
2. Run `/context-sync` to refresh `.agents/context/`
3. Run `/scaffold <feature-name> <client|server>` to generate module boilerplate
4. Follow the 4-phase checklist in `.agents/rules/architectural.md`
5. Run `/test-gen <path/to/service>` to generate test stubs
6. Run `/review` before committing — fix all flagged issues
7. Open MR targeting `develop` with `Closes #<id>` in description
8. Update `.agents/sessions/current.md` before ending the session

---

## Skills Reference

| Skill | Invoke | Purpose |
|---|---|---|
| taskboard | `/taskboard [sync\|new <title>\|move #<iid> <col>]` | GitLab board management (not configured) |
| prompt | `/prompt <draft>` | Enhance and refine prompts |
| scaffold | `/scaffold <feature> <client|server>` | Generate module boilerplate |
| review | `/review [path]` | Pre-MR self-review + MR description |
| test-gen | `/test-gen <file-path>` | Generate test file for a source file |
| context-sync | `/context-sync` | Rebuild file-tree, deps, symbols |
| adr | `/adr [new <title> \| list]` | Create or list architecture decisions |

---

## Rules Reference

| Rule file | Covers |
|---|---|
| `architectural.md` | 4-phase feature pre-flight checklist |
| `module-structure.md` | Folder trees for client/ and server/ |
| `api-conventions.md` | Data fetching, mutations, error handling |
| `code-style.md` | TypeScript, imports, UI, banned patterns |
| `security.md` | Auth, secrets, input validation |
| `testing.md` | Test structure, mocking, coverage |

---

## Wiki & Memory

| File | Purpose |
|---|---|
| `.agents/wiki/WIKI.md` | Complete project reference |
| `.agents/wiki/mistakes.md` | Agent error log — read before starting any task |
| `.agents/wiki/log.md` | Append-only change log |
| `.agents/decisions/` | Architecture decision records |
| `.agents/context/` | Live codebase map — refresh with `/context-sync` |
| `.agents/sessions/current.md` | Task handoff — read at session start, update at end |
| `.agents/runbooks/` | Deploy, rollback, incident, feature flag procedures |
