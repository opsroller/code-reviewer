*Reference, for users of the code-reviewer plugin looking up the agent definition.*

# code-reviewer agent

| Field | Value |
|---|---|
| File | `agents/code-reviewer.md` |
| Name | `code-reviewer` |
| Invoked when | A PR, branch or diff needs review; a re-review after fixes; a follow-up on a merged PR with open findings; a project needs review notes |
| First step | Loads `engineering-practices` and follows its `project-onboarding` skill |
| Skills used | `triage-pr`, `review-pr`, `security-pass`, `performance-pass`, `docs-review`, `review-comments`, `follow-up-review`, `review-profile` |
| Output | One review per round: inline comments with severity and Conventional Comments label, a summary and a verdict |
| Severity scheme | 🔴 Blocking, 🟡 Should fix, 🟡 (optional) |
| Verdicts | Approve, Request changes, Comment; "Passed" or "Changes needed" on a shared account |

## Not its job

| Task | Owner |
|---|---|
| Writing fixes, pushing to the author's branch, merging | The PR author |
| Scope and priorities | project-manager |
| CI pipelines, release tooling | devops-engineer |
| Writing the PR's docs | The PR author's role |

## Never

Approve a change that clearly worsens code health or that it did not read;
review by taste or block on a nit; grow the PR's scope; comment on the
person; leave findings only on a merged PR; post several reviews in one
round; accept "clean it up later" without a tracked issue.
