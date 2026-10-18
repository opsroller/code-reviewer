---
name: review-profile
description: Use when a project has no reviewer notes yet, when they are stale, or when the same finding has appeared in two reviews: builds and maintains the project-specific half of the review as a reference page in the project's docs.
---

# Review profile

The role is generic; the project supplies the specifics. The review notes
are a **reference** page in the project's docs (where the project profile
says; for example `docs/reference/review-notes.md`) that every review
loads first. Based on the checklist practice in the SmartBear/Cisco study
(checklists catch omissions, the hardest defects to find), OWASP's
"preparation and context" step, and Chromium's and GitLab's
domain-reviewer rules.

## What the notes record

| Section | Contents |
|---|---|
| Stack | Languages, frameworks and versions; style guides and where they live. |
| Commands | Build, lint, format, type-check, test, sanitizer or strict builds, and how to run the app. Don't review what these enforce. |
| Architecture | Layers and modules, forbidden dependencies, contracts between areas, owners per area. |
| Project rules | License (and header or SPDX convention for new files and manifests), documentation framework (e.g. Diataxis) and docs layout, commit convention, merge method, PR size limit, required checks, owned paths per role. |
| Security model | Trust boundaries, sensitive data, auth model, dependency and disclosure policy. |
| Budgets | Frame time, response time, memory, size, load time; determinism and platform rules. |
| Pitfalls | Stack and project-specific traps learned from docs and past reviews, each with a one-line check. |
| Specialists | Which areas need which reviewer (security, migrations, accessibility, localization). |

## Steps

1. **Read** the project's `CLAUDE.md`, profile, README, CONTRIBUTING,
   CI config, linters and formatter configs, and docs index.
2. **Run** the documented commands on a clean checkout; record what
   works and fix the notes (or file an issue) where docs disagree with
   the tree.
3. **Skim** recent merged PRs and their review threads for repeated
   findings.
4. **Write** the notes as reference: describe, don't instruct or argue;
   tables and lists; state rules flatly ("New files must carry the SPDX
   header. Never edit the lockfile by hand."). Open with one line saying
   what kind of page it is and who it is for.
5. **Link** it from the project's reference index, and link out to the
   project's style guide and docs guide rather than copying them.
6. **Ship** it as a normal PR in the project, reviewed by someone else.

## Keeping it current

- A finding that appears in **two reviews** becomes a pitfall entry.
- A project rule that changes (license, docs framework, merge method)
  is updated the same day.
- Remove pitfalls the tooling now catches; add the tool to Commands.

## Documentation this work owes

This skill's output is itself a **reference** page. If you had to make a
judgement call while writing it (why a rule exists, a trade-off), ask the
owner for an **explanation** page rather than putting the why in the
reference.

## Failure modes

- Copying the style guide into the notes; it drifts.
- Notes that name commands nobody has run.
- A pitfall list that only grows; nobody reads 80 entries.
- Leaving out the project rules (license, docs framework), then missing a
  template license or an unstructured docs page in review.
