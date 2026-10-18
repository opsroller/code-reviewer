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
