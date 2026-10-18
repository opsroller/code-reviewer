*Reference, for users of the code-reviewer plugin looking up one skill.*

# review-pr

| Field | Value |
|---|---|
| File | `skills/review-pr/SKILL.md` |
| Description | Use to review a pull request in full after triage says "review": the reading order, the passes, how to verify findings, and the team checklist in checklist.md. |
| Used for | After triage returns review. |
| Output | Findings with severity and label, coverage notes. |
| Reading order | broad view, tests, core files, everything else, run it, try to break it |
| Passes | design, correctness, inputs and boundaries, security, tests, performance, readability, build/CI/cross-PR, docs and hygiene |
| Session limit | 60-90 minutes, at most ~500 lines per hour |
| Standard | approve when the change definitely improves overall code health |
| Companion file | `skills/review-pr/checklist.md` (the team checklist: severity scheme, what to look for, output rules) |

Related: [skills and workflows index](index.md).
