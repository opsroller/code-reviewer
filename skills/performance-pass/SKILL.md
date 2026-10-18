---
name: performance-pass
description: Use for the performance pass of a review when a change runs on a hot path (per request, per frame, per item, start-up) or touches data that can grow, or when the project has budgets for time, memory, size or load time.
---

# Performance pass

Flag cost only where size or frequency makes it plausible. Measure or ask
for a measurement before blocking. Budgets come from the project's review
notes.

## Steps

1. **Find the hot path.** How often does this code run (once, per
   request, per frame, per item in a collection) and on how much data
   (bounded, user-controlled, grows with time)?
2. **Check algorithmic cost.** Nested loops over growing data, repeated
   linear searches, queries inside loops (N+1), sorting inside loops,
   string building by repeated concatenation.
3. **Check work per iteration.** Allocations in tight loops, repeated
   lookups of the same object, I/O or blocking calls on a latency-critical
   or UI thread, logging in hot loops.
4. **Check caches.** Correct key, bounded size, invalidated on change,
   safe under concurrency. A cache without invalidation is a correctness
   bug.
5. **Check resource use.** Handles, connections and buffers released on
   every path, including errors; memory that grows without bound;
   input-driven allocation sizes (also a security finding).
6. **Check budgets.** Against the project's budgets (frame time, response
   time, memory, binary or download size, load time). If a change might
   exceed one, ask for a measurement (profile, benchmark, before/after
   numbers) rather than guessing.
7. **Check determinism where required.** Real-time or simulation code
   that must be reproducible: seeded randomness, fixed timestep, stable
   iteration order, no wall-clock time in logic.

## Decision rules

| Situation | Severity |
|---|---|
| Measured or obvious budget breach, or unbounded growth on a hot path | 🔴 Blocking |
| Plausible cost on a hot path, no measurement yet | 🟡 Should fix, or a `question` asking for numbers |
| Micro-optimization of cold code | Don't comment; at most 🟡 (optional) |

Prefer clear code over clever code unless a measurement says otherwise.

## Documentation this work owes

A change that sets or changes a budget, a limit or a cache owes
**reference** for it; a trade-off between speed and clarity owes an
**explanation**.

## Failure modes

- Premature-optimization comments on code that runs once.
- Missing the query in a loop because the loop is in the caller.
- Blocking on a guess instead of asking for a profile.
