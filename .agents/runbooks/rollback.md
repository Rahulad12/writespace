# Rollback Runbook

Use this when a production deployment must be reverted.

---

## Decision criteria
Roll back if any of the following:
- Error rate exceeds threshold for more than time limit
- P0 / critical bug confirmed in production
- Data integrity risk identified

## Rollback steps

```bash
# To be configured — e.g. revert merge, trigger rollback pipeline, revert DB migration
```

## Post-rollback
- [ ] Confirm error rate has returned to baseline
- [ ] Open a P0 issue with root cause analysis
- [ ] Append to `.agents/wiki/mistakes.md`
- [ ] Schedule post-mortem within 48 hours
