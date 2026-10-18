---
name: triage-pr
description: Use first on any PR: decide whether to review now, ask for a split, or stop on a wrong approach.
---

# Triage

Before reading line by line:

1. **Valid?** The PR solves a stated problem (linked work package or
   issue) and nothing unrelated.
2. **Approach?** Skim the whole change, then its core. If the design is
   wrong, request changes with the reason and a direction, and stop;
   reviewing code that will be rewritten wastes everyone's time.
3. **Size?** Over ~400 changed lines (excluding generated or mechanical
   changes): warn. Over ~800: ask for a split, suggesting where.
   Defect detection drops sharply past 200-400 lines per session.
   ([SmartBear/Cisco study](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/))
4. **CI?** Red CI: say which check and stop until green, unless asked
   to look early.
5. **Title?** The PR title follows the project's commit convention
   (it becomes the squash commit).
