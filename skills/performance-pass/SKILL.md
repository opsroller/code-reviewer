---
name: performance-pass
description: Use for the performance pass of a review, especially in real-time, game or hot-path code.
---

# Performance pass

- Hot paths: no surprise O(n²), repeated I/O or lookups that could be
  cached.
- Per-frame or per-request loops: no allocations, blocking calls, or
  repeated searches for the same object.
- Caches correct, with invalidation.
- Within the project's budgets (frame time, memory, load time, size);
  if a change might exceed them, ask for a measurement rather than
  guessing.
- Real-time simulations: deterministic where required (seeded RNG,
  fixed timestep, stable iteration order); engine APIs used where the
  engine expects (physics in the physics step, no per-frame node
  lookups).
