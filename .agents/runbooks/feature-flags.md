# Feature Flags Runbook

**System**: Not configured yet

---

## Creating a flag
```bash
# To be configured — CLI or UI steps for your flag system
```

## Naming convention
`[package]-[module]-[description]` — e.g. `api-payments-stripe-v2`

## Flag lifecycle
1. **Create** — off by default, targeting off
2. **Enable for internal** — target by user email or role
3. **Gradual rollout** — 10% → 50% → 100%
4. **Full release** — flag on for all users
5. **Retire** — remove flag and all conditional code within one sprint of full release

## Retirement checklist
- [ ] Flag is at 100% for at least one full sprint
- [ ] All conditional blocks referencing the flag removed from code
- [ ] Flag deleted from flag system
- [ ] ADR updated if flag guarded a significant architecture change
