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
- Source: `src/modules/users/services/users.service.ts`
- Test:   `src/modules/users/services/users.service.test.ts`
- Source: `src/shared/utils/format-date.ts`
- Test:   `src/shared/utils/format-date.test.ts`

## Step4 — Generate test file
Generate with:
- One `describe` block matching the source file name
- One `it` block per exported function: happy-path
- One `it` block per function that can fail: error-path
- Correct mocks for HTTP client, DB, or external services per `testing.md`
- Test names in format: "should [behaviour] when [condition]"
- All test variables explicitly typed — no implicit `any` in test files.

## Step5 — Write file and report
Write the generated test file. Report the path and list all generated test cases.
Remind the agent to complete the test bodies — stubs are marked with `// TODO`.
