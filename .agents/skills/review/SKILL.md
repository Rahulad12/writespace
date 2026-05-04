---
name: review
description: Pre-MR self-review and MR description generator
allowed-tools: [Bash, Read]
argument-hint: "[path to review, or blank for git diff HEAD~1]"
---

# Review Skill

Input: **$ARGUMENTS** (path or blank)

## Step1 — Get the diff
```bash
git diff HEAD~1 --name-only 2>/dev/null || git diff --cached --name-only
git diff HEAD~1 2>/dev/null || git diff --cached
```

## Step2 — Run automated checks
```bash
cd server && npm run build 2>&1 | tail -20
cd client && npm run build 2>&1 | tail -20
```

## Step3 — Manual checklist (read diff and check each)

### Code quality
- [ ] No `console.log` statements
- [ ] No `// @ts-ignore` without reason comment
- [ ] No `any` types — use `unknown` + type guards
- [ ] No `as T` type assertions as a substitute for proper typing
- [ ] Explicit return types on all exported functions
- [ ] No hardcoded colors or inline styles
- [ ] No relative imports across package boundaries
- [ ] No cross-module imports (`modules/a` → `modules/b`)

### Architecture
- [ ] Folder structure matches `module-structure.md` — modules in `src/modules/`, shared in `src/shared/`
- [ ] No business logic in controllers / route handlers / page components
- [ ] No UI logic in service functions
- [ ] Shared components in `src/shared/components/` if used by 2+ modules; otherwise inside the module
- [ ] Nothing added inside a module's folder that should be in `src/shared/`

### Security
- [ ] No secrets or tokens in code
- [ ] All inputs validated before use
- [ ] Auth middleware present on protected routes

### Tests
- [ ] Test file exists for every new service and hook
- [ ] Happy-path test present
- [ ] At least one error-path test present

### Documentation
- [ ] If architectural decision was made: ADR exists in `.agents/decisions/`

## Step4 — Output the review

Report: PASS or list of issues to fix.

## Step5 — Generate MR description

```markdown
## What
[one-line summary of what changed]

## Why
Closes #[issue-iid]

## How to test
1. [step]
2. [step]

## Checklist
- [ ] Tests pass
- [ ] Lint passes
- [ ] TypeScript strict — zero errors
- [ ] Self-review complete (`/review`)
```
