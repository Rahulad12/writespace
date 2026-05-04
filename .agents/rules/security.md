---
paths:
  - "**/auth/**"
  - "**/middleware/**"
  - "**/config/**"
  - "**/guards/**"
---
# Security Rules

## Authentication
- The auth context / hook is the ONLY way to read the current user in frontend components
- Protected routes must be wrapped by the auth guard
- Backend: every protected endpoint passes through the auth middleware
- JWT / session validation happens in middleware — never in route handlers

## Secrets
- No secrets in source code — all URLs and keys come from environment variables
- Never log auth tokens, passwords, or user PII
- `.env` files are gitignored — never commit them

## Input validation
- All form data validated with a schema before it reaches an API call (frontend)
- All request bodies validated with a schema before reaching the controller (backend)
- Never pass raw query strings or URL params to DB queries without validation

## API security
- Role / permission checks done by the auth middleware — do not duplicate in controllers
- Never expose admin endpoints without an explicit role check
- All user-supplied IDs scoped to the authenticated user's resources to prevent IDOR
