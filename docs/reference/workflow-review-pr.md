*Reference, for users of the code-reviewer plugin running the review-pr workflow.*

# review-pr workflow

File: `workflows/review-pr.js`. Invoke as `/code-reviewer:review-pr` or
"run the code-reviewer review-pr workflow with args { … }".

## Arguments

| Arg | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `pr` | string | yes | | `owner/repo#N`, a branch, or a `base..head` range |
| `focus` | string | no | | Extra focus passed to every pass |
| `post` | boolean | no | `false` | Post the review and notify the author; otherwise return a draft |
| `sharedAccount` | boolean | no | `false` | Reviewer and author share one account: Comment review starting "Passed" or "Changes needed" |

Missing `pr` returns a usage string.

## Phases

| Phase | Agents | Skill |
|---|---|---|
| Triage | 1 | `triage-pr` |
| Plan docs | 1 | `docs-review` section 1 (compass) |
| Passes | 8 in parallel: design, correctness, tests, security, performance, readability, build-cross-pr, docs-hygiene | `review-pr`, `checklist.md`, `security-pass`, `performance-pass`, `docs-review` |
| Verify | 1 per blocking or should-fix finding | refute attempt |
| Review | 1 | `review-comments` |
| Do docs | 1 | `review-profile` (pitfalls into review notes) |
| Check docs | 0 or 1 | `docs-review` section 3 |

## Output

| Field | Meaning |
|---|---|
| `verdict` | `approve`, `request-changes` or `comment` |
| `blocking`, `should_fix`, `optional` | Counts |
| `summary`, `comments` | The review text |
| `posted`, `author_notified` | Whether the review was posted and the author told directly |
| `follow_up` | Link to the owner's follow-up task when the PR had already merged |
| `docs_owed_missing` | Doc kinds the PR owes and lacks (each a blocking finding) |
| `review_notes` | Review-notes pages updated |
| `docs_check` | `{ ok, problems }` for those pages |

If triage does not return `review`, the output is `{ verdict, triage, note }`.

## Behaviour rules

- A finding whose verifier returns no result is kept and marked
  `unverified`; it is never dropped.
- A pass that returns no result is reported in coverage as not checked.
- Optional, praise, question and note findings are not verified.
- Only one agent edits the review notes page.
