---
name: issues
description: Read raw requirements and break them into structured, actionable issues
allowed-tools: [Bash, Read, Write, Edit, Task]
argument-hint: "<path-to-requirements-file | raw text>"
---

# Issue Generator — Raw Requirements → Structured Issues

Input: **$ARGUMENTS**

## Step 1 — Read the requirements

If `$ARGUMENTS` is a file path (exists on disk), read it.
If `$ARGUMENTS` is raw text (no matching file), treat it as the requirements body.

Supports: `.md`, `.txt`, `.docx` (extract text), or any file with readable content.

If multiple files are given, read all of them and merge into one requirements corpus.

## Step 2 — Parse and decompose

Read the requirements and break them into discrete issues using these rules:

1. **One issue per feature/task** — each issue should be independently implementable
2. **No mega-tasks** — if a requirement is "build authentication," split into: register, login, JWT middleware, session handling, password reset, etc.
3. **Identify dependencies** — note which issues must be done before others
4. **Classify each issue** with:
   - **Type**: `feature` | `bug` | `enhancement` | `tech-debt` | `docs` | `chore`
   - **Priority**: `critical` | `high` | `medium` | `low`
   - **Labels**: auto-generated from keywords (e.g., `auth`, `database`, `ui`, `api`, `testing`, `security`)
   - **Complexity**: `S` | `M` | `L` | `XL`
   - **Acceptance criteria**: 2-5 concrete, testable conditions
   - **Dependencies**: list of other issue numbers this depends on (if any)

## Step 3 — Generate issue files

For each issue, write a file to `.agents/issues/ISSUE-<N>.md` where N is sequential starting from the next available number.

Check `.agents/issues/` for existing files to determine the next N.

Each issue file format:
```markdown
---
id: ISSUE-<N>
type: feature|bug|enhancement|tech-debt|docs|chore
priority: critical|high|medium|low
labels: [label1, label2]
complexity: S|M|L|XL
dependencies: [ISSUE-X, ISSUE-Y]
status: backlog
created: YYYY-MM-DD
---

# <Short, action-oriented title>

## Context
<1-2 sentences: why this is needed, what problem it solves>

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Acceptance Criteria
- [ ] Criteria 1 (testable)
- [ ] Criteria 2 (testable)
- [ ] Criteria 3 (testable)

## Technical Notes
<Implementation hints, relevant files, architectural considerations>

## Dependencies
- Blocked by: ISSUE-X, ISSUE-Y (if any)
- Blocks: ISSUE-Z (if any)
```

## Step 4 — Update the backlog index

Read or create `.agents/issues/BACKLOG.md` and update it with a table of all issues:

```markdown
# Issue Backlog

| ID | Title | Type | Priority | Complexity | Status |
|----|-------|------|----------|------------|--------|
| ISSUE-1 | ... | feature | high | M | backlog |
```

This table should be sortable and serve as the master index for all issues.

## Step 5 — Push to GitLab (if configured)

Check if `GITLAB_TOKEN` and `GITLAB_PROJECT_ID` are set in the environment.

If YES, create GitLab issues for each new issue file:
```bash
for f in .agents/issues/ISSUE-*.md; do
  # Skip already-pushed (check for pushed: true in frontmatter)
  grep -q "pushed: true" "$f" && continue

  # Parse frontmatter
  TITLE=$(head -20 "$f" | grep "^# " | sed 's/^# //')
  BODY=$(sed -n '/^---$/,/^---$/!p' "$f" | sed '/^$/d')
  LABELS=$(grep "^labels:" "$f" | sed 's/labels: //' | tr -d '[]"' | sed 's/,/, /g')

  # Create via GitLab API
  curl -s --request POST \
    --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{\"title\":\"$TITLE\",\"description\":\"$(echo $BODY | sed 's/"/\\"/g')\",\"labels\":\"$LABELS\"}" \
    "https://gitlab.com/api/v4/projects/$GITLAB_PROJECT_ID/issues"

  # Mark as pushed
  sed -i 's/status: backlog/status: backlog\npushed: true/' "$f"
done
```

If NO, print:
```
GitLab not configured. Set GITLAB_TOKEN and GITLAB_PROJECT_ID to push issues remotely.
Issues saved locally in .agents/issues/
```

## Step 6 — Report

Print a summary:
```
Parsed N issues from requirements:

| ID | Title | Type | Priority | Complexity |
|----|-------|------|----------|------------|
| ISSUE-1 | ... | feature | high | M |
| ISSUE-2 | ... | feature | medium | S |

Dependency graph:
  ISSUE-2 → depends on → ISSUE-1
  ISSUE-5 → depends on → ISSUE-3, ISSUE-4

Saved to .agents/issues/
```

## Edge cases

- If the requirements are too vague (no concrete features/tasks identifiable), ask the user to clarify before generating issues.
- If the requirements already contain structured issues (e.g. from a previous `/issues` run), detect and skip duplicates by comparing titles.
- If a single file contains both requirements AND implementation notes, separate them — requirements go into issue bodies, implementation notes go into `## Technical Notes`.
- If the input is code (not requirements text), skip this skill and suggest `/scaffold` instead.
