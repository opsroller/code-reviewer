---
name: triage-pr
description: Use first on any pull request, before reading line by line, to decide whether to review now, ask for a split, wait for CI, bring in another reviewer, or stop on a wrong approach.
---

# Triage a pull request

Ten minutes that decide whether a full review is worth doing now. Based on
Google's "Navigating a CL in review" and "Speed of code reviews", the
SmartBear/Cisco review-size data and GitLab's reviewer guidance.

## Steps

1. **Acknowledge fast.** Within one business day of the request, respond.
   If a full review must wait, say when, or name a better reviewer. A
   quick first response matters more than a quick finish.
2. **Read the intent.** Title, description, linked work package or issue.
   Can you state in one sentence what the change should do? If not, ask
   the author before reviewing (`question`).
3. **Should it exist at all?** Does the problem need solving, here, now?
   A feature the project does not want is rejected however well it is
   built. Say why and suggest the alternative, courteously.
4. **Skim the whole change, then find its core.** Identify the files with
   the main logical change. If you cannot find them, the PR is too big or
   badly described: ask where to start or ask for a split.
5. **Check the approach.** If the design is wrong, post a review now with
   the reason and a direction, and stop. Do not review code that will be
   rewritten.
6. **Check the size.** Count changed lines excluding generated files,
   lockfiles, vendored code and pure moves or renames.

   | Reviewable lines | Action |
   |---|---|
   | up to ~200 | Review. |
   | ~200-400 | Review in one session of at most 60-90 minutes. |
   | ~400-800 | Warn; review the core, ask whether it can be split. |
   | over ~800 | Ask for a split, suggesting where (by layer, by concern, refactor first then behaviour). Review the design only. |

   Defect detection falls sharply past 200-400 lines per session and past
   ~500 lines per hour (SmartBear/Cisco). Mechanical changes (renames,
   formatting) may be larger if kept separate from behaviour changes.
7. **Check CI and mergeability.** Red CI: name the failing check and wait,
   unless asked to look early. Conflicts with the base: ask for a rebase.
8. **Check scope and conventions.** One concern per PR; no unrelated
   changes; touches only the paths the author's role owns; the title
   follows the project's commit convention (it becomes the squash
   commit).
9. **Check your fit.** Which areas need a specialist (security, data
   migrations, accessibility, concurrency, localization, performance
   budgets)? Name them and ask for that reviewer; say what you will cover.
10. **Check neighbours.** Other open PRs or recent merges touching the
    same files, contracts or CI jobs. A change fine alone can break
    another once both land.

## Decision

Return one of:

- **review**: proceed with `review-pr`.
- **split**: post a `🟡 Should fix` (or 🔴 if the project has a hard size
  rule) asking for the split, with a proposed cut.
- **wait**: CI red, conflicts, or missing description. Say exactly what
  unblocks it.
- **stop**: wrong approach or unwanted change. Post the design review now
  and request changes.
- **reassign**: you lack the expertise or the time; name who should
  review.

## Failure modes

- Reviewing line by line before checking the approach.
- Silently sitting on a large PR instead of asking for a split.
- Counting generated or vendored lines and refusing a fine PR.
- Starting while CI is red, then finding the same failures by hand.
- Approving a part you did not review without saying so.
