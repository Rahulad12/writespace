---
name: taskboard
description: View, sync, and manage the GitLab task board
allowed-tools: [Bash, Read, Write, Edit]
argument-hint: "[sync | new <title> | move #<iid> <todo|in-progress|done> | (blank = show board)]"
---

# Task Board

GitLab: Not configured
Local board file: `.agents/taskboard/TASKBOARD.md`
Command: **$ARGUMENTS**

## Route the command
- blank / `show` → **Show**
- `sync` → **Sync**
- starts with `new ` → **New Issue**
- starts with `move ` → **Move**

## Show
Read and print `.agents/taskboard/TASKBOARD.md`. If missing, run Sync.

## Sync

> Note: GitLab is not configured for this project yet. Set GITLAB_TOKEN and GITLAB_PROJECT_ID to enable.

```bash
echo "GitLab not configured. Set GITLAB_TOKEN and GITLAB_PROJECT_ID environment variables."
```

## New Issue
Parse title from `new <title>`. 
```bash
echo "GitLab not configured. Cannot create issue."
```

## Move Issue
Parse `move #<iid> <todo|in-progress|done>`.
```bash
echo "GitLab not configured. Cannot move issue."
```
