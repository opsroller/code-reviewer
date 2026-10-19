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
| `notes` | `"pr"` or `"verdict"` | no | `"pr"` | Where repeated findings go. `"pr"`: the review notes page, with a docs PR if the project requires one. `"verdict"`: the review summary and the output; no file is edited and no PR is opened |

Missing `pr` returns a usage string; any other `notes` value returns an error string.

## Phases

| Phase | Agents | Skill |
|---|---|---|
| Triage | 1 | `triage-pr` |
| Plan docs | 1 | `docs-review` section 1 (compass) |
| Passes | 8 in parallel: design, correctness, tests, security, performance, readability, build-cross-pr, docs-hygiene | `review-pr`, `checklist.md`, `security-pass`, `performance-pass`, `docs-review` |
| Verify | 1 per blocking or should-fix finding | refute attempt |
| Review | 1 | `review-comments` |
| Do docs | 1 | `review-profile` (pitfalls into review notes); with `notes: "verdict"` it runs before Review and edits nothing |
| Check docs | 0 or 1 | `docs-review` section 3; never with `notes: "verdict"` |

## Output

| Field | Meaning |
|---|---|
| `verdict` | `approve`, `request-changes` or `comment` |
| `blocking`, `should_fix`, `optional` | Counts |
| `summary`, `comments` | The review text |
| `posted`, `author_notified` | Whether the review was posted and the author told directly |
| `follow_up` | Link to the owner's follow-up task when the PR had already merged |
| `docs_owed_missing` | Doc kinds the PR owes and lacks (each a blocking finding) |
| `review_notes` | Review-notes pages updated; empty with `notes: "verdict"` |
| `pitfalls`, `owed_by_author` | With `notes: "verdict"` only: the pitfall lines (each with its check) and the explanation pages the author owes, also listed in the review summary under "Pitfalls for the review notes" |
| `docs_check` | `{ ok, problems }` for those pages |

If triage does not return `review`, the output is `{ verdict, triage, note }`.

## Behaviour rules

- A finding whose verifier returns no result is kept and marked
  `unverified`; it is never dropped.
- A pass that returns no result is reported in coverage as not checked.
- Optional, praise, question and note findings are not verified.
- Only one agent edits the review notes page, and none does with `notes: "verdict"`.

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `triage`, `docs-plan`, `pass:<dimension>` (`pass:design`, `pass:correctness`, `pass:tests`, `pass:security`, `pass:performance`, `pass:readability`, `pass:build-cross-pr`, `pass:docs-hygiene`), `verify:<file>:<line>` (one per finding), `review`, `review-notes`, `docs-check`.

Independent steps: `verify:<file>`, `docs-check`. They review work this run produced, so in inline mode send each to a reviewer with no part in the work and name them in `run.reviewers`; a step you answer yourself is reported in `self_reviewed`.
