*Explanation, for anyone who wants to understand what the code reviewer does and why the plugin works the way it does.*

# About the code reviewer role

## What the job is

Almost no company posts a job called "code reviewer". Review is a duty
that every engineer holds, and that grows with seniority. Career
frameworks show the progression: Dropbox's ladder expects an entry-level
engineer to "participate in code reviews and raise questions" to learn the
codebase, and an engineer two levels up to "ensure high code quality in
code reviews" and foster a review culture. O*NET lists "write, analyze,
review, and rewrite programs" as one task among many. SFIA's quality
assurance skill describes the same arc in general terms: from checking
work against standards, to running assessments, to making sure corrective
actions have owners.

This plugin makes the duty a role so a team of agents can give it to one
member consistently: someone whose job, on every pull request, is to keep
the codebase healthier than it was, catch what the author missed, and
spread knowledge.

## Why review at all

Teams review for defects, but research is blunt about what review
actually delivers. Bacchelli and Bird's study at Microsoft found that
finding defects is the main motivation, yet reviews find fewer defects
than developers expect and deliver other value: knowledge transfer, team
awareness, alternative solutions. Google's case study of its own review
practice, drawn from nine million reviewed changes, examined the same
question of why teams review and what they get from it. Understanding the change is the
hardest part of reviewing; much of this plugin (intent first, core files
first, tests first) exists to make understanding faster.

## Why the standard is "improves code health", not "perfect"

Google's standard asks reviewers to approve once a change definitely
improves overall code health, even if imperfect, and never to approve one
that makes it worse. A perfection standard stalls work and teaches authors
to send fewer, larger changes, which are harder to review. A "good enough"
standard without the second half lets health decay one change at a time.
The two halves together let the reviewer be fast and strict at once.

## Why small reviews and short sessions

SmartBear's large study of peer review at Cisco found defect detection
falls off past 200-400 lines per review, past about 500 lines an hour, and
after 60-90 minutes. That is why triage asks for splits rather than
heroics, and why a reviewer reports what they did not cover instead of
pretending to full coverage.

## Why speed matters more than finishing

Google, Chromium and GitLab all set a response target of about one
business day, and all distinguish a fast *response* from a fast
*completion*: a quick note with an estimate, early design comments or a
better reviewer's name unblocks the author. Slow review is the main
reason authors batch changes into large, risky PRs.

## Why labels and severity

Conventional Comments gives each comment a label (issue, suggestion,
question, nitpick, praise…) and decorations (blocking, non-blocking).
The team adds its own severity: 🔴 Blocking, 🟡 Should fix, 🟡
(optional). Together they answer the author's real question, "what must I
do before this merges?", without guessing at tone. Google's "Nit:" and
GitLab's non-blocking marker solve the same problem. A severity also stops
the classic failure where one data-loss bug hides in a list of thirty
naming nits.

## Why one review per round

Several reviews in one round, each with its own verdict, leave the author
unsure which one counts. One review with a summary (verdict, counts,
what's good, blockers, what was and was not checked) is something an
author, a merge rule or another agent can act on. Telling the author
directly about blockers matters because PR notifications are easy to
miss, and an author with merge rights may merge before reading.

## Why findings never stay on a merged PR

Nobody reads comments on closed PRs. Google's guidance on pushback notes
that "clean it up later" rarely happens, and OWASP observes the same about
post-commit review: fixes get deferred and then conflict with later
changes. So a merged PR with open findings becomes a follow-up task owned
by someone, with every finding carried over.

## Why security is a separate pass

The OWASP Code Review Guide argues that security review needs context
(what is valuable, where the trust boundaries are) and a method (follow
each input from source to sink), not a vague "look for security issues".
A dedicated pass with a short checklist keyed to the OWASP Top 10 makes
the reviewer ask the right questions every time, and a risk rating says
when a specialist must join.

## Why the reviewer checks docs, and why Diataxis

Docs that drift from the code mislead people and, worse, agents, which
follow instructions word for word. So the reviewer checks that CI runs
the documented commands and treats missing or wrong docs as blocking. The project
organises docs with Diataxis: four kinds (tutorial, how-to, reference,
explanation) defined by what the reader needs. A reviewer can check a
page against the compass in seconds, and the most common docs failure,
one page trying to teach, instruct and explain at once, becomes a
concrete, fixable finding.

## Why CI, not the reviewer, runs the checks

Builds, tests, linters and documented commands give the same answer on
every run, so they belong in continuous integration: run on every push,
on a clean machine, with a result everyone can see (Fowler's
self-testing build; the automated checks that precede human review in
*Software Engineering at Google*). A reviewer who runs them by hand
repeats work, gets results nobody else can see, and can pass a change on
a machine that differs from CI. So the reviewer reads CI results, asks
for a missing check to be added to CI, and runs locally only what CI
cannot run. Human attention goes where tools cannot: design,
correctness, readability.

## Why verification before posting

A wrong finding costs the author time and the reviewer credibility. The
plugin tries to refute each serious finding before posting it, and posts
uncertain ones as questions. When a verifier fails, the finding stays,
marked unverified, because silently dropping a real bug is worse than
asking a human to look.

## Boundaries with neighbouring roles

- **The author's role** (gameplay programmer, UI developer, technical
  artist and others) writes the code, the tests and the docs, and fixes
  findings. The reviewer suggests; it does not push to their branch.
- **engineering-practices** sets the shared rules the reviewer checks:
  Conventional Commits, squash merge, provenance and licensing, Diataxis.
- **project-manager** owns scope and priorities, receives follow-up tasks
  for merged PRs, and is where unresolved disagreements escalate.
- **devops-engineer** owns CI and release tooling; the reviewer reports
  CI gaps rather than fixing pipelines.

## How the role grows, junior to senior

- **Junior**: follows the checklist, asks questions to learn, catches
  local bugs, keeps comments kind and labelled.
- **Mid-level**: reviews design before details, reproduces findings,
  keeps rounds small, writes good summaries, knows when to call a
  specialist.
- **Senior**: judges whether a change should exist, sees cross-PR and
  cross-system effects, handles pushback without stalling work, turns
  repeated findings into tooling or review notes, and raises the team's
  review culture.

## Further reading

The sources behind these points are listed in [SOURCES.md](../../SOURCES.md).
