# Mistakes Log

**Purpose**: Append-only log of agent errors that required rework.
Read this at the start of every task to avoid repeating known mistakes.
Never edit past entries — only append.

**Format per entry:**
```
## [DATE] — [short title]
**What happened:** [what the agent did wrong]
**Why it was wrong:** [the rule or assumption that was violated]
**How to avoid:** [concrete check or rule to apply next time]
**Related rule:** [link to rule file if applicable]
```

---

## 2026-05-03 — Empty index.ts file

**What happened:** Server's `src/index.ts` was empty, causing the server to start and immediately exit with "clean exit"

**Why it was wrong:** The entry point file had no code to import and run the Express app defined in `app.ts`

**How to avoid:** Always ensure `index.ts` imports the app or contains the bootstrap code. Check that the entry point actually starts the application.

**Related rule:** `.agents/rules/module-structure.md` — backend section, route registration
