# .agents/taskboard/

Local mirror of the GitLab task board.

## Columns

| Column | Meaning |
|---|---|
| **To Do** | Open, not started (label: `TO DO`) |
| **In Progress** | Being worked on (label: `IN PROGRESS`) |
| **Done** | Closed issues |

## Start of session

Run `/taskboard sync` to pull fresh state before starting work.

## Configuration

GitLab is not configured for this project yet.
To enable: Set `GITLAB_TOKEN` and `GITLAB_PROJECT_ID` environment variables.
