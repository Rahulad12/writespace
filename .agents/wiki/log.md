# Wiki Log

**Summary**: Append-only record of all wiki operations.
**Last updated**: 2026-05-04

---

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
