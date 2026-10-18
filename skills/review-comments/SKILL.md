---
name: review-comments
description: Use when writing review comments and the round's single review: Conventional Comments labels combined with the team's severity scheme (🔴 Blocking, 🟡 Should fix, 🟡 (optional)), tone, the summary and the verdict.
---

# Review comments and verdict

Based on Conventional Comments, Google eng-practices "How to write code
review comments", Michael Lynch's "How to do code reviews like a human",
GitLab's reviewer guidance and the team checklist (whose severity and
output rules are binding).

## One comment = one issue

Inline, on the line where the problem is. Format:

```
<severity> <label> [(decoration)]: <subject>

<why: the concrete failure (input → wrong result) or the rule broken>
<direction: what would resolve it; a small suggested patch if it helps>
```

Example:

```
🔴 issue (blocking): an empty cart makes checkout divide by zero

`average = total / items.length` runs when `items` is empty
(open checkout with nothing in the cart → NaN price, order saved).
Guard the empty case before computing, and add a test for it.
```

## Severity (team scheme) and labels

| Severity | Means | Labels to use |
|---|---|---|
| 🔴 **Blocking** | Wrong behaviour, crash, hang, data loss, security hole, or a broken project rule. Must be fixed before merge. | `issue (blocking)`, `todo (blocking)`, `chore (blocking)` |
| 🟡 **Should fix** | Real but bounded risk, or a maintainability cost. Fix now or in a tracked follow-up (linked issue). | `issue`, `suggestion`, `todo` |
| 🟡 **(optional)** | Nit or style. The author decides. | `nitpick (non-blocking)`, `suggestion (non-blocking)`, `thought`, `typo` |
| no severity | Not a request | `praise`, `question`, `note` |

Rules:
- Unsure whether it is a problem? Use `question`, not `issue`.
- A `question` is a real question, not a demand in disguise.
- "Broken project rule" includes: wrong license on a new file or
  manifest, missing docs for a change, commit or PR title off convention,
  wrong merge method, work outside the PR's owned paths.
- Nothing a linter or formatter enforces.

## Tone

- Comment on the code, never the person. Avoid "you"; use "we", the code
  as subject, or a question ("Could this move to the parser?").
- Explain why: cite the style guide, a principle, a measurement or a
  reproduced failure, not taste. "I found this hard to follow" is honest;
  "this is ugly" is not.
- Point the way; the author owns the fix. Offer code when it is faster
  to show than to tell, a few times per round at most.
- Say how strongly you feel; mark optional things optional.
- Keep a round to what matters: dozens of comments bury the blockers.
  Raise design first; naming and polish in later rounds.
- At least one sincere `praise` when earned: say what is good and why, so
  the author keeps doing it.

## The review (one per round)

Leave **one review per round**: inline comments carry the detail; the
summary carries the verdict. Template:

```
<Verdict line>

Blocking: <n>  ·  Should fix: <n>  ·  Optional: <n>

What's good: <one or two lines>

Blocking items:
1. <file:line> <subject>

Checked: <read every line / built / ran tests / ran the app / ran the
documented commands / cross-PR check against the base and open PRs>
Not checked: <parts or areas, and who should>
```

## Verdict

| Verdict | When |
|---|---|
| **Approve** | No 🔴 left. Approving with 🟡 comments is fine when they are optional, trivial, or the author will clearly handle them; say which. |
| **Request changes** | Any 🔴, or the approach is wrong. Say exactly what earns approval. |
| **Comment** | You cannot judge yet (questions open, partial review). Say what you need. |

**Shared account rule.** Where reviewer and author post from one account,
the host refuses Approve and Request changes: post a **Comment** review
whose first line is **"Passed"** (would approve) or **"Changes needed"**
(would request changes).

## After posting

- **Tell the author directly** about anything 🔴, not only on the PR
  (the team's chat, thread or message channel), so it is fixed before
  they merge.
- **PR already merged?** Do not leave findings only on the closed PR:
  open a follow-up task for the owner (see `follow-up-review`).

## Failure modes

- Several reviews in one round, each with a different verdict.
- A verdict without a summary, or a summary that claims more coverage
  than you did.
- Mixing a 🔴 into a wall of nits.
- "Why didn't you…" phrasing; sarcasm; "just" and "obviously".
- Labels without reasons; reasons without a direction.
