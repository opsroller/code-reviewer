*Reference, for users of the code-reviewer plugin: the landing page for looking things up.*

# Code-reviewer reference

Dry descriptions of what the plugin contains, for looking up while you
work. For steps, see the how-to guides listed in the [README](../../README.md#documentation); for the reasons
behind the methods, see [About the code reviewer role](../explanation/about-the-role.md).

## The agent

[code-reviewer agent](agent.md): what it is invoked for, its skills,
output, severity scheme and boundaries.

## Skills for a review round

The order a review follows:
[triage-pr](skill-triage-pr.md) decides whether to review now;
[review-pr](skill-review-pr.md) is the reading order and passes (with the
team checklist);
[review-comments](skill-review-comments.md) is the comment format,
severity and verdict.

## Skills for specialised passes

[security-pass](skill-security-pass.md) (OWASP),
[performance-pass](skill-performance-pass.md) and
[docs-review](skill-docs-review.md) (Diataxis) are called from `review-pr`
or used alone.

## Skills for after the round and for setup

[follow-up-review](skill-follow-up-review.md) re-reviews fixes and handles
merged PRs; [review-profile](skill-review-profile.md) builds the project's
review notes.

## Workflows

| Workflow | Does | Args |
|---|---|---|
| [review-pr](workflow-review-pr.md) | Full review of one PR, one review posted or drafted | `pr`, `focus?`, `post?`, `sharedAccount?` |
| [re-review](workflow-re-review.md) | Next round after fixes; merged-PR follow-up | `pr`, `post?`, `sharedAccount?` |
| [review-profile](workflow-review-profile.md) | Builds the project's review notes page | `repo?`, `page?` |

## Plugin manifest (`.claude-plugin/plugin.json`)

| Field | Value |
|---|---|
| `name` | `code-reviewer` |
| `version` | `0.1.0` |
| `author.name` | `opsroller` |
| `repository` | `https://github.com/opsroller/code-reviewer` |
| `license` | `GPL-2.0-or-later` |
| `keywords` | `role`, `job-function`, `code-review`, `pull-request`, `conventional-comments`, `owasp`, `diataxis` |

## Sources

[SOURCES.md](../../SOURCES.md) lists the research behind the plugin.
