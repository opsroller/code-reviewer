---
name: follow-up-review
description: Use after the author responds to a review: re-review the fixes, settle pushback, resolve threads, give the next round's verdict, and open a follow-up task for the owner when a PR merged with findings still open.
---

# Follow-up review

Review is not done when the comments are posted; it is done when the
change lands healthy or the open findings are tracked. Based on Google
eng-practices ("Handling pushback", "Speed of code reviews", "The
standard": resolving conflicts) and the team checklist.

## Re-review a round of fixes

1. **Respond fast**, as for a first review (within one business day).
2. **Review the fix, not the whole PR again.** Read the commits since your
   last review (fixes pushed as separate commits help). Check each of your
   threads: is it fixed, answered, or declined with a reason?
3. **Check that fixes did not break something else.** Read CI on the new
   head: the tests pass and each 🔴's failing test now passes; re-check
   the cross-PR picture if the base moved.
4. **Resolve threads** that are addressed. Leave open the ones that are
   not, with one line on what is still missing.
5. **Leave one review for the round** (`review-comments`), with the
   updated counts and verdict. New findings are allowed only when the fix
   introduced them or you missed a 🔴; say which.

## Handle pushback

- **Is the author right?** They often know the code better. If their
  argument holds, say so and drop the point.
- **If not**, explain again, showing you understood their view. Stay
  courteous; keep to facts, data and principles.
- **"I'll clean it up later"**: later rarely comes. New complexity is
  fixed in this PR unless it is an emergency. A real follow-up is a
  tracked issue, linked in the thread, assigned to someone.
- **Stuck after two rounds?** Move to a call or a direct conversation,
  then record the outcome as a comment on the PR. Still stuck: escalate to
  whoever the project names (a lead, a maintainer, the project manager).
  Never let a PR sit because author and reviewer disagree.

## A PR merged with open findings

When a PR merged before your review, or with 🔴/🟡 findings open:

1. Do not leave findings only on the closed PR; nobody reads them.
2. Open a **follow-up task for the owner** (the project's tracker or work
   package system; the project-manager routes it), listing each open
   finding with severity, file:line, the failure and the direction, and
   linking the merged PR.
3. 🔴 on a merged PR: tell the author and the owner directly at once; a
   revert may be the right fix.
4. Note in the PR (one comment) where the follow-up lives.

## Documentation this work owes

- A decision settled in pushback goes into the project's docs as an
  **explanation** (ADR style), asked of the author, so the argument is not
  repeated.
- A finding repeated across PRs goes into the project's review notes
  (**reference**, via `review-profile`).

## Failure modes

- Re-reviewing the whole PR and raising fresh nits every round.
- Resolving a thread because the author replied, not because it is fixed.
- Accepting "follow-up" with no issue link.
- Findings left on a merged PR and never seen again.
