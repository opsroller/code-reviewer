---
name: security-pass
description: Use for the security pass of a review, or a focused security review of changed code.
---

# Security pass

Based on the [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
and [Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/):

- Untrusted input validated (files, network, save data, user text);
  output encoded for its sink.
- No secrets, keys or credentials in code, config, logs or test data.
- Authorisation checked on every path where it applies.
- No injection or unsafe deserialisation; parsers bounded.
- Memory safety in unmanaged languages: bounds, lifetimes, ownership.
- New dependencies justified, pinned, maintained and license-compatible
  with the project.
- No personal data in logs or telemetry beyond the project's policy.

Security findings are blocking unless clearly hypothetical; say which.
