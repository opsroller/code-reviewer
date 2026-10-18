---
name: review-pr
description: Use to review a PR in full after triage: ordered passes and a generic checklist.
---

# Review a PR

Load the project profile's review notes, style guide and commands first.
Don't comment on anything the project's linters and formatters enforce.
Time-box: about 60-90 minutes per session, under ~500 lines per hour.

## Passes, in order

1. **Design**: right layer or module, no duplication of existing
   utilities, nothing speculative, contract changes intentional and
   versioned.
2. **Correctness**: edge cases (empty, bounds, off-by-one, overflow,
   units), errors not swallowed, concurrency safe, resources released,
   backward compatible or migrated. Run it when you can.
3. **Tests**: new behaviour tested; tests fail without the change; tests
   deterministic, isolated, readable; assertions meaningful.
4. **Security**: `security-pass`.
5. **Performance**: `performance-pass`.
6. **Readability**: names reveal intent, functions small, complexity
   earned, comments explain why, no dead code.
7. **Consistency**: matches surrounding code and the project's
   conventions.
8. **Docs**: README, API docs, contracts, changelog, migration notes;
   UI strings localisable and accessible.

Then write comments (`review-comments`) and the verdict.
