---
name: docs-review
description: Use for the documentation pass of every review: check that a change ships with the docs it owes in the same PR, that docs match the tree, and that each touched page follows Diataxis (one kind per page, title patterns, landing pages).
---

# Docs review

Documentation is part of the change, not an afterthought. This pass
checks that the PR's docs exist, are true and follow Diataxis. Based on
<https://diataxis.fr> (the compass, tutorials, how-to guides, reference,
explanation) and the team's Diataxis guide, whose review checklist is
folded into section 3. When the project names its own docs guide in its
profile, that guide's checklist is binding and wins over this one.

## 1. What does the change owe? (compass)

Classify each user-visible change with the two compass questions:
**action or cognition?** and **acquisition (study) or application
(work)?**

| Informs | Serves | Kind |
|---|---|---|
| action | study | tutorial |
| action | work | how-to guide |
| cognition | work | reference |
| cognition | study | explanation |

What each kind of work usually owes:

| Work | Owes |
|---|---|
| New feature or system | reference for its interface; explanation if a design choice was made; how-to if users must do something new |
| Bug fix | reference update if behaviour changed; a troubleshooting how-to if users hit it |
| Decision between alternatives | an explanation page (ADR style) |
| New onboarding path | a tutorial, run from a clean start in CI |
| Changed build, test, run or release steps | the how-to and README that describe them |
| Deleted or deprecated code | its docs deleted or marked deprecated |

**Missing docs for a code, asset or behaviour change is 🔴 Blocking**
(team checklist).

## 2. Do the docs match the tree?

- Every command the changed docs (and README, CONTRIBUTING, agent
  instructions) tell people to run passes in a CI job on a clean
  checkout; read the job's result. A command no CI job runs is a finding
  asking for it in CI. Agents follow docs word for word.
- Paths, names, flags, config keys and CI job names in docs exist.
- Reference generated from source was regenerated.

A doc that is wrong is worse than a missing one: 🔴 when it would make a
reader or agent do the wrong thing.

## 3. Diataxis checklist (each touched page)

- [ ] **One kind per page.** Nothing instructional, opinionated or "why"
  in reference; no instructions in explanation; no explanation beyond a
  clause plus a link in tutorials and how-tos.
- [ ] **Titles follow the pattern.** How-to titles name a user goal
  ("How to <goal>", not a menu or tool operation); explanation titles read
  with "About <topic>"; reference is named for the thing described;
  tutorials say what we will build.
- [ ] **Reference mirrors the structure** of the code or product (one page
  per module, command, spec) and matches its sibling pages' format.
- [ ] **Tutorials have one fixed path**, expected output at each step, no
  options or alternatives, and are run from a clean start by CI.
- [ ] **How-tos are action only**, may branch for real situations, link
  to reference for option lists, and skip what any competent user knows.
- [ ] **Explanation is bounded** by a topic or "why" question, gives
  context, decisions and alternatives, and links out for steps and facts.
- [ ] **Landing pages introduce**: README and index pages group pages
  with a sentence each, not a bare link dump; lists over ~7 are grouped.
- [ ] **Every page opens with one line** saying what kind it is and who
  it is for (where the project's guide requires it).
- [ ] **No empty per-kind folders** created ahead of content.
- [ ] **Links connect the kinds**: a how-to links to its reference, a
  tutorial links to explanation for the why.
- [ ] **License and headers** follow the project's convention for docs.

## 4. Writing the findings

- Mixed kinds: name the sentences that belong elsewhere and the kind they
  belong to ("these three paragraphs are explanation; move them to an
  About page and link"). 🟡 Should fix, or 🔴 if the page misleads.
- Bad title: suggest the patterned title. 🟡 Should fix.
- Tutorial or command that fails in CI: 🔴 Blocking, with the failing
  job and output. One that no CI job runs: ask for it in CI, 🔴 when the
  PR adds or changes it.
- Do not rewrite the docs yourself; say what kind the text is and where
  it goes. Small wording suggestions in a suggestion block are fine.

## Failure modes

- Checking spelling and missing that the documented command no longer
  exists.
- Accepting "docs to follow" for a behaviour change.
- Asking for an FAQ: split each answer into its real kind instead.
- Treating "basic vs advanced" as the tutorial/how-to line; the line is
  study vs work.
