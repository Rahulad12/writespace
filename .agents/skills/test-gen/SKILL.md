---
name: test-gen
description: Generate test file for a source file following testing.md
allowed-tools: [Read, Write, Bash]
argument-hint: "<path/to/source-file>"
---

# Test Generation Skill

Input: **$ARGUMENTS**

## Step1 — Read the source file
Read the full source file. Identify:
- All exported functions and their explicit TypeScript signatures
- All side effects (HTTP calls, DB calls, external services)
- Error paths (what can throw or return an error)

## Step2 — Read testing rules
Read `.agents/rules/testing.md` and identify the correct mocking strategy for this file type.

## Step3 — Determine test file path
- **Automated test-code** is co-located with source files in their module directories
- Pattern: For source `<package>/src/<path>/<file>.ts`, test is `<package>/src/<path>/<file>.test.ts`
- Example: `server/src/modules/auth/auth.controller.ts` → `server/src/modules/auth/auth.controller.test.ts`
- Example: `server/src/shared/middleware/auth.middleware.ts` → `server/src/shared/middleware/auth.middleware.test.ts`
- Example: `client/src/shared/utils/format.ts` → `client/src/shared/utils/format.test.ts`
- **Requirement-based test cases** go in `/test/<package>/<module-path>/` (not co-located)

## Step4 — Generate test file
Generate with:
- One `describe` block matching the source file name
- One `it` block per exported function: happy-path
- One `it` block per function that can fail: error-path
- Correct mocks for HTTP client, DB, or external services per `testing.md`
- Test names in format: "should [behaviour] when [condition]"
- All test variables explicitly typed — no implicit `any` in test files.

## Step5 — Write file and report
Write the generated test file (co-located with source). Report the path and list all generated test cases.
Remind the agent to complete the test bodies — stubs are marked with `// TODO`.

## Step6 — Pre-commit check
Ensure all tests pass by running `cd <package> && npm run test` before any commit or push to GitHub.
