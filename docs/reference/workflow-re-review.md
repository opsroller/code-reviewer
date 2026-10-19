*Reference, for users of the code-reviewer plugin running the re-review workflow.*

# re-review workflow

File: `workflows/re-review.js`. Invoke as `/code-reviewer:re-review`.

## Arguments

| Arg | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `pr` | string | yes | | `owner/repo#N` |
| `post` | boolean | no | `false` | Post the review and resolve fixed threads |
| `sharedAccount` | boolean | no | `false` | Comment review starting "Passed" or "Changes needed" |
| `notes` | `"verdict"` or `"pr"` | no | `"verdict"` | Where repeated findings go. `"verdict"`: the review summary and the output; no file is edited and no PR is opened. `"pr"`: the review notes page, with a docs PR if the project requires one |

## Phases

| Phase | Agents | Skill |
|---|---|---|
| Collect | 1 | `follow-up-review` |
| Plan docs | 1 | `docs-review` section 1 on the new commits |
| Check threads | 1 per open thread | `follow-up-review` |
| Review | 1 | `review-comments`; merged PR: follow-up task for the owner |
| Do docs | 1 | `review-profile`, `follow-up-review`; with `notes: "verdict"` (the default) it runs before Review and edits nothing |
| Check docs | 0 or 1 | `docs-review` section 3; only with `notes: "pr"` |

## Output

| Field | Meaning |
|---|---|
| `status` | `blocked` when blocking items remain open, else `clear`; `nothing-to-do` verdict when no threads and no new commits |
| `verdict` | `approve`, `request-changes`, `comment` or `follow-up-opened` |
| `open_items` | Threads still open or regressed |
| `follow_up` | Owner's follow-up task, for merged PRs |
| `docs_owed_missing`, `docs`, `docs_check` | Documentation results. With `notes: "verdict"`, `docs` is `{ pages_touched: [], owed_by_author, pitfalls }` and the same lines are in the review summary under "Pitfalls for the review notes" |

## Behaviour rules

- A thread whose checker returns no result is treated as `still-open`
  and marked `unverified`.
- A merged PR never ends with findings only on the PR.

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `collect`, `docs-plan`, `thread:<thread id>` (one per open thread), `review`, `docs`, `docs-check`.

Independent steps: `docs-check`. They review work this run produced, so in inline mode send each to a reviewer with no part in the work and name them in `run.reviewers`; a step you answer yourself is reported in `self_reviewed`.
