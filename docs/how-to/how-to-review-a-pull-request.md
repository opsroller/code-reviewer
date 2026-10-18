*How-to guide, for anyone asking the code-reviewer role to review a PR.*

# How to review a pull request

This guide shows you how to get a full review of one PR, posted as one
review with a verdict.

1. **Make sure the project has review notes.** If the project's docs have
   no review notes page, run the `review-profile` workflow first (see
   [How to set up a project's review notes](how-to-set-up-project-review-notes.md)).
2. **Draft the review.**
   ```
   Run the code-reviewer review-pr workflow with args { pr: "owner/repo#123" }.
   ```
   Add `focus: "the migration"` to point the passes at one area.
3. **Read the result.**
   - If the decision is **split**, **wait**, **stop** or **reassign**, the
     workflow returns the triage comment instead of a review. Post it, or
     fix the cause (red CI, conflicts, missing description) and run again.
   - Otherwise read the draft: each comment has a severity, a label, a
     failure and a direction. Findings marked *unverified* had a verifier
     that failed; check them yourself before posting.
4. **Post it.** Run again with `post: true`. If you post from the same
   account as the author, add `sharedAccount: true`; the review becomes a
   Comment review that starts with "Passed" or "Changes needed".
5. **If there is a blocker**, check that the author was told directly (the
   result's `author_notified`). If not, tell them through the project's
   channel.
6. **If the PR already merged**, check the result's `follow_up` link: the
   findings must be in a follow-up task for the owner, not only on the PR.
7. **Check the docs step.** `docs_owed_missing` lists doc kinds the PR
   should have shipped (blocking findings). `review_notes` lists pages the
   reviewer updated; `docs_check` must be `ok`.

For a single pass without the workflow, ask the `code-reviewer` agent
directly ("review PR #123 for security only") and it follows the matching
skill.

See the [review-pr workflow reference](../reference/workflow-review-pr.md)
for all arguments and outputs.
