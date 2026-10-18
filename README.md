# Code Reviewer

Code reviewer: reviews pull requests for design, correctness, tests, security, performance and readability, with labelled comments and a clear verdict.

This plugin is a **job function**, not a project. It says how the job is done; the project it works on says with which tools, in its `CLAUDE.md` and project profile.

## Skills

| Skill | Use when |
|---|---|
| `triage-pr` | Use first on any PR: decide whether to review now, ask for a split, or stop on a wrong approach. |
| `review-pr` | Use to review a PR in full after triage: ordered passes and a generic checklist. |
| `security-pass` | Use for the security pass of a review, or a focused security review of changed code. |
| `performance-pass` | Use for the performance pass of a review, especially in real-time, game or hot-path code. |
| `review-comments` | Use when writing review comments and the final verdict. |
| `review-profile` | Use when a project has no reviewer notes yet, or they are stale: builds the project-specific half of the review from the repo. |

## Workflows

Multi-agent workflows (Claude Code Workflow scripts in `workflows/`).

| Workflow | Does |
|---|---|
| `/code-reviewer:review-pr` | Review a pull request in parallel passes, verify each finding, and draft labelled comments with a verdict |

## Agent

`agents/code-reviewer.md` defines the role as a subagent.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install code-reviewer@opsroller
```

Versioned on its own with semver tags (`v0.1.0`). Changes follow Conventional Commits.
