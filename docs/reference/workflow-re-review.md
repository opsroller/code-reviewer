*Reference, for users of the code-reviewer plugin running the re-review workflow.*

# re-review workflow

File: `workflows/re-review.js`. Invoke as `/code-reviewer:re-review`.

## Arguments

| Arg | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `pr` | string | yes | | `owner/repo#N` |
| `post` | boolean | no | `false` | Post the review and resolve fixed threads |
| `sharedAccount` | boolean | no | `false` | Comment review starting "Passed" or "Changes needed" |

## Phases

| Phase | Agents | Skill |
|---|---|---|
| Collect | 1 | `follow-up-review` |
| Plan docs | 1 | `docs-review` section 1 on the new commits |
| Check threads | 1 per open thread | `follow-up-review` |
| Review | 1 | `review-comments`; merged PR: follow-up task for the owner |
| Do docs | 1 | `review-profile`, `follow-up-review` |
| Check docs | 0 or 1 | `docs-review` section 3 |

## Output

| Field | Meaning |
|---|---|
| `status` | `blocked` when blocking items remain open, else `clear`; `nothing-to-do` verdict when no threads and no new commits |
| `verdict` | `approve`, `request-changes`, `comment` or `follow-up-opened` |
| `open_items` | Threads still open or regressed |
| `follow_up` | Owner's follow-up task, for merged PRs |
| `docs_owed_missing`, `docs`, `docs_check` | Documentation results |

## Behaviour rules

- A thread whose checker returns no result is treated as `still-open`
  and marked `unverified`.
- A merged PR never ends with findings only on the PR.
