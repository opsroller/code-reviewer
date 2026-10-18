*Tutorial, for someone using the code-reviewer plugin for the first time.*

# Review your first pull request

In this tutorial we will review one small pull request with the
code-reviewer role, from triage to a posted review. We use a practice PR so
nothing real is at stake. It takes about 30 minutes.

## Before we start

We need:
- Claude Code with the `engineering-practices` and `code-reviewer` plugins
  installed (see the [README](../../README.md));
- a repository we can push to, with a `CLAUDE.md` naming its test command;
- the `gh` command-line tool signed in, or another way to open PRs.

## 1. Make a practice pull request

In the repository, create a branch and add a function with a deliberate
bug. Any language works; here is the idea in pseudocode:

```
average(values):
    return sum(values) / length(values)
```

Commit it with the message `feat: add average helper`, push the branch
`feat/average-helper`, and open a PR with the description "Adds an
average helper for the stats page."

The PR page should show one changed file and green or no CI.

## 2. Ask for triage

In Claude Code, in the repository, type:

```
Use the code-reviewer agent to triage PR #<number>.
```

The agent first loads `engineering-practices` and reads `CLAUDE.md`
(onboarding). Then it follows `triage-pr`. The output should look like:

```
Decision: review
Intent: add an average helper for the stats page
Reviewable lines: 3
Core files: <the file you added>
```

Notice that it states the intent in one sentence before looking at the
code. If it says **wait**, CI is red: fix CI and ask again.

## 3. Run the full review without posting

Type:

```
Run the code-reviewer review-pr workflow with args { pr: "#<number>" }.
```

We watch seven phases go by: Triage, Plan docs, Passes, Verify, Review,
Do docs, Check docs. The workflow returns a draft and posts nothing,
because we did not pass `post: true`.

The draft should contain a comment like:

```
🔴 issue (blocking): an empty list makes average divide by zero

average([]) → division by zero. Guard the empty case and add a test.
```

Notice three things: the 🔴 severity, the Conventional Comments label
`issue (blocking)`, and the concrete failure (input → wrong result).
There should also be a blocking finding for missing docs and tests, and
a summary that starts with the verdict **Request changes**.

## 4. Post the review

Type:

```
Run the code-reviewer review-pr workflow with args { pr: "#<number>", post: true }.
```

Open the PR page. We should see exactly **one** review with inline
comments and a summary listing counts, what is good, the blocking items,
and what was and was not checked.

## 5. Fix and re-review

On the branch, guard the empty case, add a test for it and a one-line
reference entry for the helper in the docs, push, then type:

```
Run the code-reviewer re-review workflow with args { pr: "#<number>", post: true }.
```

The new review should resolve the fixed threads and end with **Approve**
(or **Passed**, if reviewer and author share one account).

## What we did

We triaged a PR, drafted a review, posted one review with
severity-labelled comments, and re-reviewed the fix. Next:
- [How to review a pull request](../how-to/how-to-review-a-pull-request.md)
  for real PRs;
- [About the code reviewer role](../explanation/about-the-role.md) for why
  the review works this way.
