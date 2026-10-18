*Reference, for users of the code-reviewer plugin looking up one skill.*

# performance-pass

| Field | Value |
|---|---|
| File | `skills/performance-pass/SKILL.md` |
| Description | Use for the performance pass of a review when a change runs on a hot path (per request, per frame, per item, start-up) or touches data that can grow, or when the project has budgets for time, memory, size or load time. |
| Used for | Hot paths, growing data, or project budgets. |
| Output | Performance findings, or requests for measurements. |
| Checks | hot path, algorithmic cost, work per iteration, caches, resource release, budgets, determinism |
| Blocking | measured or obvious budget breach, unbounded growth on a hot path |

Related: [skills and workflows index](index.md).
