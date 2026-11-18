# Severity guide

Use these four levels, and do not inflate them. A review where everything is critical is a review nobody reads.

## Blocker — must fix before merge

The change is wrong, unsafe, or will break production.

- Data loss, corruption, or an unsafe migration on a live table
- Auth bypass, missing authorization check, or cross-tenant leak
- Secrets or credentials committed
- Crash on a realistic input
- Silent failure where the caller believes the operation succeeded
- Breaking change to a public contract with no version bump

```text
src/auth/session.ts:42 — accepts a rotated refresh token (auth bypass)
```

## Major — should fix in this PR

Real defect, limited blast radius, or a trap for the next person.

- Missing error handling on a network or filesystem call
- N+1 query on a hot path
- Test that asserts nothing
- Race condition under concurrent writes
- Unbounded retry or missing timeout

## Minor — fix if cheap

Correct but costly to maintain.

- Duplicated logic that already exists in a helper
- Misleading name (`getUser` that also writes)
- Dead code left behind
- Missing test for an edge case that cannot lose data

## Nit — optional

Style and taste. Say "nit" so the author knows it is not a demand.

- Naming preferences
- Comment wording
- Import order
- Formatting the formatter would fix

## How to phrase a finding

```text
<severity> · <file>:<line> — <what is wrong>. <why it matters>. Fix: <concrete action>.
```

Example:

```text
Major · src/api/search.ts:88 — retry loop has no cap. A 503 storm will
pin a worker indefinitely. Fix: cap at 3 attempts with jittered backoff.
```

## What never belongs in a review

- Restating the diff
- "This could be cleaner" with no target
- Architecture rewrites disguised as comments
- Style demands the linter already enforces
- Praise that is not specific enough to be useful
