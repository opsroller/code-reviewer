---
name: review-comments
description: Use when writing review comments and the final verdict.
---

# Review comments and verdict

## Comments: [Conventional Comments](https://conventionalcomments.org/)

`<label> [(decoration)]: <subject>` then the why and a suggested
direction.

| Label | Means |
|---|---|
| `issue (blocking)` | Must fix: correctness, security, data loss, clear health drop |
| `issue` | Real problem; fix or explain |
| `suggestion` | Improvement worth considering |
| `todo` | Small required change |
| `question` | Genuine question, not a disguised demand |
| `nitpick` | Optional polish |
| `praise` | Something done well; include at least one when earned |

Comment on the code, never the person. Explain why. Point the way rather
than writing the fix.

## Verdict

- **Approve** when nothing blocks; approving with nits is fine.
- **Request changes** when any blocker exists or the approach is wrong;
  say exactly what earns approval.
- **Comment** when you can't judge yet.

Every verdict has a summary: decision, what you reviewed and how (read,
built, ran tests, ran the app), what you didn't review, blockers listed.
