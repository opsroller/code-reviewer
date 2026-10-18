*How-to guide, for anyone following up a review after the author pushed fixes, or after a PR merged with open findings.*

# How to re-review a pull request after fixes

This guide shows you how to run the next review round, resolve threads
and give the new verdict.

1. **Run the re-review.**
   ```
   Run the code-reviewer re-review workflow with args { pr: "owner/repo#123" }.
   ```
   It checks each open thread against the new commits; it does not review
   the whole PR again.
2. **Read the thread results.** Each thread is `fixed`, `answered`,
   `declined-accepted`, `still-open` or `regressed`. A thread whose checker
   failed comes back `still-open` and marked unverified: look at it
   yourself.
3. **If the author pushed back** and the workflow could not settle it,
   talk it through directly (call or chat), then record the outcome as a
   PR comment. Still stuck: escalate to the person the project names.
4. **Post the round.** Run again with `post: true` (and
   `sharedAccount: true` if you share the author's account). Fixed and
   answered threads are resolved; one review gives the new verdict.
5. **If the result says `status: blocked`**, blocking items are still open;
   the PR must not merge. The `open_items` list says what remains.
6. **If the PR had already merged**, the verdict is `follow-up-opened`.
   Check the `follow_up` link: every open finding should be in a task for
   the owner, and the author and owner told directly about any blocker.
7. **Check the docs step**: settled decisions are listed as explanation
   pages the author owes; repeated findings were added to the review notes.

See the [re-review workflow reference](../reference/workflow-re-review.md).
