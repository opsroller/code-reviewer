# Code reviewer

A Claude Code role plugin for the job of reviewing pull requests. The
code reviewer triages each PR, reads it in a fixed order, runs passes for
design, correctness, tests, security (OWASP), performance and docs
(Diataxis), verifies its findings, and leaves one review per round with
Conventional Comments, severity labels (🔴 Blocking, 🟡 Should fix,
🟡 (optional)) and a clear verdict. It follows up until the change lands
healthy, and opens a follow-up task when a PR merged with findings open.

The plugin is a job function, not a project: it says how to review well.
The project says with what (stack, commands, rules) in its `CLAUDE.md`,
profile and review notes.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install engineering-practices@opsroller
/plugin install code-reviewer@opsroller
```

## Documentation

**Start here.** [Review your first pull request](docs/tutorials/first-task.md)
walks through a practice PR from triage to an approved re-review.

**Get a job done.** Task guides for working reviewers:
- [How to review a pull request](docs/how-to/how-to-review-a-pull-request.md),
  the everyday job;
- [How to re-review a pull request after fixes](docs/how-to/how-to-re-review-after-fixes.md),
  including PRs that merged with findings open;
- [How to check the docs in a pull request](docs/how-to/how-to-check-docs-in-a-pull-request.md),
  the Diataxis pass on its own;
- [How to set up a project's review notes](docs/how-to/how-to-set-up-project-review-notes.md),
  once per project.

**Look something up.** The [reference](docs/reference/index.md) describes
the agent, each skill and each workflow with its arguments and outputs.

**Understand the approach.** [About the code reviewer role](docs/explanation/about-the-role.md)
covers what the job is, why the methods look the way they do, the
boundaries with other roles, and how a reviewer grows.

The research behind it is in [SOURCES.md](SOURCES.md).

## License

Copyright (C) 2026 Charles (opsroller) and contributors. Licensed under the GNU General Public License v2.0 or later (`GPL-2.0-or-later`); see `LICENSE`.
