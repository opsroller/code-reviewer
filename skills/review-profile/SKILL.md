---
name: review-profile
description: Use when a project has no reviewer notes yet, or they are stale: builds the project-specific half of the review from the repo.
---

# Review profile

The role is generic; projects supply the specifics. Build or refresh the
"review notes" section of the project profile with:

- Languages, engine or framework and versions; style guide paths.
- Lint, format, type-check, test and CI commands (don't review what
  these enforce).
- Architecture map: layers, forbidden dependencies, owners per area.
- Known pitfalls of the stack (engine lifecycle, deprecated APIs,
  footguns), learned from docs and from past review findings.
- Budgets (frame time, memory, size), determinism and platform rules.
- Security model, dependency and license policy.
- PR rules: size limits, required checks, merge strategy, commit format.

Add a pitfall whenever the same finding appears in two reviews.
