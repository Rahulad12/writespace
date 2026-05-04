# Incident Response Runbook

---

## Severity levels

| Level | Definition | Response time |
|---|---|---|
| P0 | Production down / data loss | Immediate |
| P1 | Major feature broken | < 1 hour |
| P2 | Degraded performance | < 4 hours |
| P3 | Minor issue | Next sprint |

## Triage steps
1. Confirm the issue in observability tool
2. Check recent deployments in pipeline history
3. Check error logs
4. Determine severity level
5. If P0/P1: notify team immediately

## Escalation
- P0: page on-call immediately
- P1: notify team channel

## Resolution
- Fix forward if safe, otherwise → rollback runbook
- Write incident summary and append to `.agents/wiki/log.md`
