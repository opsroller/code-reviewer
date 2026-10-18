---
name: review-pr
description: Use to review a pull request in full after triage says "review": the reading order, the passes, how to verify findings, and the team checklist in checklist.md.
---

# Review a pull request

The method for one review round. The team checklist in
[`checklist.md`](checklist.md) is the authority for what to look for,
severity and output; this skill says in what order and how. Based on
Google eng-practices (standard, what to look for, navigating a CL), the
SmartBear/Cisco study, and Bacchelli and Bird's finding that understanding
the change is the hardest part of review.

## Before you start

- `triage-pr` returned **review**.
- Load the project's review notes (`review-profile`): stack pitfalls,
  commands, budgets, style guide, docs layout. Skip whatever the project's
  linters, formatters and type checkers enforce.
- Time-box: one session of at most 60-90 minutes, at most ~500 lines per
  hour. Bigger PRs get several sessions or a split.

## The standard

Approve once the change **definitely improves overall code health**, even
if imperfect. Never approve one that clearly worsens it (emergencies
aside, and then with a tracked follow-up). Technical facts and data beat
opinion; the style guide settles style; where it is silent, match the
surrounding code or accept the author's choice; design choices rest on
principles, and when the author shows two approaches are equally valid,
take theirs.

## Reading order

1. **Broad view.** Description, linked task, the list of files. Re-read
   the one-sentence intent from triage.
2. **Tests first, when present.** They show the intended behaviour and
   which edges the author thought of.
3. **The core.** The files with the main logical change. Design problems
   found here are posted immediately, before finishing the rest.
4. **Everything else**, in a logical order, skipping nothing. Read every
   line of human-written code; scan generated code and data files. Look
   beyond the diff: the whole function, the whole file, the callers.
5. **Run it.** Build, run the tests and the strictest cheap configuration
   (extra warnings, sanitizers, strict type checking). Run the commands
   the docs tell people to run, on a clean checkout: docs must match the
   tree. For user-facing
   changes run the app or ask for a demo, screenshots or a recording.
6. **Try to break it.** Empty, zero, one, max, negative, malformed, a
   repeated call, a call in the wrong order, a failure halfway through.

## Passes

Work through the sections of `checklist.md` in this order. Each pass asks
one kind of question, so you notice more than in one mixed read.

| # | Pass | Main question | Skill |
|---|---|---|---|
| 1 | Design | Right place, right time, right size? Anything speculative? Contract changes intentional and announced? | |
| 2 | Correctness | Does it do what the description says, and nothing else, on every path? | |
| 3 | Inputs and boundaries | Is untrusted data checked where it enters? | `security-pass` |
| 4 | Security | Can an attacker or accident turn this into harm? | `security-pass` |
| 5 | Tests | Would the tests fail if the code broke? | |
| 6 | Performance | Is there a plausible size or frequency that makes this slow? | `performance-pass` |
| 7 | Readability | Could the next person change this safely? | |
| 8 | Build, CI, cross-PR | Does it still build and pass everywhere, against the current base and every other open PR? | |
| 9 | Docs and hygiene | Do docs ship with the change, match it and follow Diataxis? Project license on new files and manifests? Commit convention, merge method, scope? | `docs-review` |

Skip a pass only when the PR cannot touch it, and say so in the summary.

## Verify before you post

For every finding that would be 🔴 or 🟡 Should fix:

1. Find the realistic path that triggers it (input → wrong result). Run it
   if you can.
2. Try to refute it: is it guarded elsewhere, impossible by contract, or
   already tested? Read the caller.
3. If it survives, write it up. If you are unsure, post it as a
   `question` instead of an `issue`.
4. When you find one instance of a bad pattern, search the change (and
   nearby code) for the same pattern.

## Then

Write the comments and the one review for this round with
`review-comments`. When the author pushes fixes, use `follow-up-review`.

## Documentation this work owes

A review checks the PR's docs (`docs-review`: the change must ship with
the doc kinds it owes, in the same PR) and produces docs of its own in
the project:
- a finding that has now appeared in two reviews becomes a pitfall in the
  project's review notes, a **reference** page (`review-profile`);
- a design decision argued out in the thread is requested from the author
  as an **explanation** page (ADR style) or a code comment, so the next
  reader has it.

## Failure modes

- Reading in file order and missing that the design is wrong.
- Reviewing only the diff, not the code around it.
- Reasoning about a bug you could have reproduced in two minutes.
- Spending the session on naming while a data-loss path goes unseen.
- A 1,000-line PR reviewed in one sitting: comments trail off after line
  400 and the summary claims full coverage.
- Rubber-stamping: approval without having run or read the change.
