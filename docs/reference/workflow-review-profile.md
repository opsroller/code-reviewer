*Reference, for users of the code-reviewer plugin running the review-profile workflow.*

# review-profile workflow

File: `workflows/review-profile.js`. Invoke as `/code-reviewer:review-profile`.

## Arguments

| Arg | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `repo` | string | no | current repository | `owner/repo` or a path |
| `page` | string | no | path in the project profile, else `docs/reference/review-notes.md` | Where the notes go |

## Phases

| Phase | Agents | Skill |
|---|---|---|
| Survey | 8 in parallel, read-only: stack, commands, architecture, project rules, security model, budgets, pitfalls, specialists | `review-profile` steps 1-3 |
| Plan docs | 1 | compass; the notes are reference |
| Do docs | 1 (sole editor) | `review-profile` steps 4-6; one docs PR |
| Check docs | 1 | `docs-review` sections 2-3 |

## Output

| Field | Meaning |
|---|---|
| `status` | `done` or `needs-fixes` |
| `pages`, `pr` | Pages written and the docs PR |
| `doc_conflicts` | Docs that disagree with the tree |
| `explanation_owed` | Explanation pages the owner should write |
| `check` | `{ ok, problems }` |

## Behaviour rules

- A survey agent that returns no result leaves its section empty and
  listed as unverified in `doc_conflicts`.
- Survey agents never edit files; only the Do docs agent writes.

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `survey:<section>` (`survey:Stack`, `survey:Commands`, `survey:Architecture`, `survey:Project rules`, `survey:Security model`, `survey:Budgets`, `survey:Pitfalls`, `survey:Specialists`), `plan`, `write`, `check`.

Independent steps: `check`. They review work this run produced, so in inline mode send each to a reviewer with no part in the work and name them in `run.reviewers`; a step you answer yourself is reported in `self_reviewed`.
