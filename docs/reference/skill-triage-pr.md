*Reference, for users of the code-reviewer plugin looking up one skill.*

# triage-pr

| Field | Value |
|---|---|
| File | `skills/triage-pr/SKILL.md` |
| Description | Use first on any pull request, before reading line by line, to decide whether to review now, ask for a split, wait for CI, bring in another reviewer, or stop on a wrong approach. |
| Used for | Every PR, first. |
| Output | Decision: review, split, wait, stop or reassign; intent sentence; reviewable line count; core files; specialists needed. |
| Size thresholds | up to ~200 lines review; ~200-400 one session of at most 60-90 minutes; ~400-800 warn; over ~800 ask for a split |
| Response time | first response within one business day |
| Excluded from line count | generated files, lockfiles, vendored code, pure moves |

Related: [skills and workflows index](index.md).
