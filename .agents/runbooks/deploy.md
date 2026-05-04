# Deployment Runbook

**CI/CD platform**: Not configured yet
**Deployment target**: Not configured yet

---

## Pre-deploy checklist
- [ ] All tests pass on `develop`
- [ ] Code reviewed and approved
- [ ] No open blocking issues
- [ ] Feature flags set correctly for this release
- [ ] Notify team before deploying to production

## Deploy steps

### Staging
```bash
# To be configured
```

### Production
```bash
# To be configured
```

## Post-deploy checklist
- [ ] Check error rate for 10 minutes
- [ ] Verify key user flows manually
- [ ] Update `.agents/sessions/current.md` with deploy notes
- [ ] Close milestone issues if release is complete

## Rollback trigger
If error rate exceeds threshold or a P0 bug is found → run rollback runbook immediately.
