*How-to guide, for a reviewer or lead starting reviews on a project, or refreshing stale review notes.*

# How to set up a project's review notes

This guide shows you how to create the project-specific half of every
review: a reference page listing the project's stack, commands, rules,
security model, budgets and pitfalls.

1. **Check where the page should live.** The project profile may name a
   path. If not, the workflow uses `docs/reference/review-notes.md`.
2. **Run the workflow.**
   ```
   Run the code-reviewer review-profile workflow with args { repo: "owner/repo" }.
   ```
   Pass `page: "docs/reference/reviewing.md"` to choose another path.
3. **Read the conflicts.** `doc_conflicts` lists places where the docs
   disagree with the tree (a command that fails, a path that does not
   exist). They go into the PR body as follow-ups for the owning roles.
4. **Check the project rules section** in the new page: license and
   header convention, documentation framework, commit convention, merge
   method. Reviews check these on every PR; if one is missing, ask the
   owner and add it.
5. **Get the docs PR reviewed and merged** like any other change.
6. **Answer the why-questions.** `explanation_owed` lists explanation
   pages the owner should write (why a rule exists). Keep the why out of
   the reference page.

To add one pitfall by hand, edit the Pitfalls table directly, but only
after the same finding has shown up in two reviews.

See the [review-profile workflow reference](../reference/workflow-review-profile.md).
