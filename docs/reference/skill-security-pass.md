*Reference, for users of the code-reviewer plugin looking up one skill.*

# security-pass

| Field | Value |
|---|---|
| File | `skills/security-pass/SKILL.md` |
| Description | Use for the security pass of every review that touches input, authentication, authorization, data, secrets, dependencies, configuration or error handling, or for a focused security review of changed code. |
| Used for | Changes touching input, auth, data, secrets, dependencies, configuration or error handling. |
| Output | Security findings named by OWASP Top 10 (2025) category, marked demonstrated or hypothetical. |
| Method | context and risk rating, source-to-sink tracing, checklist by control |
| Controls | input validation, output encoding, authentication, authorization, session and tokens, cryptography, error handling, logging, configuration, supply chain, memory safety, secrets |
| Blocking | exploitable path, leaked secret, missing auth check, reachable injection sink |

Related: [skills and workflows index](index.md).
