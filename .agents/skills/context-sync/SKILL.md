---
name: context-sync
description: Rebuild file-tree, dependencies, and symbol index for the current codebase
allowed-tools: [Bash, Write]
argument-hint: ""
---

# Context Sync Skill

Run at the start of every session. Updates `.agents/context/`.

## Step1 — Rebuild file-tree.md
```bash
find . -type f \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path '*/dist/*' \
  -not -path '*/.agents/*' \
  -not -path '*/coverage/*' \
  | sort
```

Write the output to `.agents/context/file-tree.md` with a timestamp header.

## Step2 — Rebuild dependencies.md
```bash
# List external dependencies per package
for pkg in client server; do
  echo "=== $pkg ===" && cat "$pkg/package.json" 2>/dev/null | grep -A999 '"dependencies"' | head -30
done
```

Write to `.agents/context/dependencies.md` with a timestamp header.

## Step3 — Rebuild symbols.md
```bash
# Export index — all exported functions and types
grep -r "^export " --include="*.ts" --include="*.tsx" -n \
  | grep -v "__tests__" \
  | grep -v "node_modules" \
  | sort
```

Write to `.agents/context/symbols.md` with a timestamp header.

## Step4 — Report
Print timestamp and count of files found. Remind the agent that context is now fresh.
