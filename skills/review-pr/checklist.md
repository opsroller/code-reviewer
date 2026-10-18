# Code review checklist

The team's reviewer checklist, used by `review-pr`. Severity labels and
output rules here are binding for every review; `review-comments` shows how
they combine with Conventional Comments labels. Items marked *(added)*
come from Google's eng-practices "What to look for" and the OWASP Code
Review Guide.

A generic checklist for reviewing a pull request. It is not tied to any
language, engine or project. A project adds its own stack notes in its own
repo, such as "how we bind native code" or "our threading model".

## How to review

1. **Read the intent first.** Read the PR title, description and linked
   task. Know what the change is supposed to do before you judge how it does
   it.
2. **Judge deterministic checks from CI.** Build, tests, linters, type
   checks, sanitizer and strict builds, and documented commands are read
   from the PR's CI results on its current head, not run by hand. Run
   something locally only when it cannot run in CI (for example, it needs
   hardware CI does not have), and say so in the summary. A check the
   review needs that CI does not run is a finding asking for it in CI:
   🔴 when the change's correctness rests on it, 🟡 otherwise. A finding
   shown by a failing CI job or test beats one you reasoned about; to
   show one, suggest the failing test so CI runs it.
3. **Try to break it.** Probe the edges: empty, zero, one, max, negative,
   malformed input, a repeated call, a call in the wrong order.
4. **Comment where the code is.** Use inline comments, one issue per
   comment, with a concrete failure (input → wrong result) and a suggested
   fix.
5. **Label severity.**
   - 🔴 **Blocking**: wrong behaviour, crash, hang, data loss, security
     hole, or a broken project rule. Must be fixed before merge.
   - 🟡 **Should fix**: real but bounded risk, or a maintainability cost.
     Fix now or in a tracked follow-up.
   - 🟡 **(optional)**: nit or style. The author decides.
6. **Say what is good.** One line on what the PR gets right tells the
   author what to keep doing.
7. **Tell the author directly** about anything blocking, not only on the
   PR, so it gets fixed before they merge.
8. **Re-review the fix**, not the whole PR again. Resolve threads once
   they are addressed.

## What to look for

### Correctness
- Does it do what the description says, and nothing else?
- Edge cases: empty collections, bounds, off-by-one, overflow, division by
  zero, null or absent values.
- Loops and retries: is every loop guaranteed to end? Is a retry bounded,
  with a fallback?
- Error paths: are errors reported to the caller or logged, never silently
  swallowed? Is state left consistent after a failure?
- State: are invariants kept after every public call? Is the order of
  operations right?
- Concurrency: shared mutable state, races, re-entrancy, and work on the
  main or UI thread that can block.
- Boundaries: errors (exceptions, panics) never cross into code that
  can't carry them (C APIs, engines, FFI); linked libraries share compile
  flags that affect ABI or error handling.
- Determinism, where the project needs it (seeded randomness, stable
  iteration order, no wall-clock time in logic).

### Inputs and boundaries
- Validate at the trust boundary: user input, files, network, scripts,
  and plugins calling in. Internal code may assume valid input once the
  boundary has checked it.
- Unchecked indexing or casts reachable from outside.
- Resource limits: the size of input files, allocations driven by input.

### Security
- Injection (shell, SQL, path traversal), unsafe deserialization, secrets
  in code or logs, and permissions wider than needed.
- Dependencies: pinned versions, a known source, a compatible license.
- *(added)* Follow each new input from source to sink; the full pass is
  in `security-pass`.

### Design and readability
- Is the logic in the right layer (rules separate from presentation, I/O at
  the edges)?
- Are names clear and specific, functions small, and duplication avoided?
- Are public interfaces minimal and documented? Is any change to a shared
  contract called out as breaking and announced?
- Is const-correctness or immutability used where the language offers it?
  A query should not mutate.
- Is there no dead code, commented-out code, or TODO without a tracked
  issue?
- Does it match the surrounding code's style, naming and comment density?
- *(added)* Complexity: can a reader understand each line, function and
  type quickly? No speculative generality or features nobody asked for.
- *(added)* Comments explain *why*, not *what*; if code needs a comment
  to be understood, ask for simpler code first. Explanations given only in
  the review thread don't help the next reader: ask for them in the code
  or docs.
- *(added)* Old TODOs or warnings the change makes obsolete are removed.

### Tests
- New behaviour has tests. A bug fix has a test that failed before it.
- Tests check outcomes, not internals. They are deterministic, with no
  timing or luck.
- A failing assertion reports and continues, never crashes the whole
  runner.
- Edge cases from the correctness section are covered.

### Performance
- Algorithmic cost on hot paths (per frame, per request, per item).
- Allocations in tight loops, and repeated work that could be computed
  once.
- Only flag performance with a plausible size or frequency. No
  micro-optimizing cold code.

### Build and CI
- Warnings are errors in CI and apply to every target, tests included.
- There is a sanitizer, linter or static-analysis job where the language
  has one.
- CI runs on every platform the project ships to.
- Generated files and lockfiles are regenerated by tooling, never edited
  by hand.

### Integration with other work
- Check the change against the current base and every other open PR,
  not only its own diff: a PR that is fine alone can break another's CI
  job, contract or assumptions once both land.
- A new default-on build option or required file: does every CI job and
  documented command still work?

### Docs and project hygiene
- Docs, contracts and agent instructions match the code as it actually
  is: real paths, real names, real CI. Every documented command is run
  by a CI job; agents follow docs literally.
- License: every file, manifest and LICENSE uses the license the
  project's rules require (no defaulting to a template's license);
  headers and notices are present and consistent.
- Documentation follows the project's documentation framework. For
  Diataxis:
  - Each changed page is exactly one kind: tutorial, how-to guide,
    reference or explanation. No instructions or opinion in reference;
    no explanation beyond a clause and a link in tutorials and how-tos.
  - How-to titles name a user goal ("How to ..."); explanation titles
    read with "About ..."; reference mirrors the structure of the code
    or product and matches its sibling pages' format.
  - Tutorials follow one fixed path, show expected output at each step,
    and are run by CI.
  - Index and README pages introduce and group content; group lists
    longer than about seven items.
  - No empty per-kind docs folders created ahead of content.
  - *(added)* The full docs pass, with the project guide's checklist, is
    in `docs-review`.
- A change to code, assets or behaviour ships with its docs in the same
  PR. Missing docs is a blocking finding.
- Commits and PR title follow the project's commit convention. The merge
  method follows project rules.
- The PR stays in its scope and its owned paths.

## Output

- Where reviewer and author share one account, the host refuses
  Approve and Request changes: post a Comment review that opens with
  "Passed" or "Changes needed".

- Leave one review per round. Its summary gives the verdict, a count of
  blocking items, and what's good.
- Inline comments carry the detail.
- If the PR has already merged, open the follow-up as a task for the
  owner. Don't leave findings only on the closed PR.
