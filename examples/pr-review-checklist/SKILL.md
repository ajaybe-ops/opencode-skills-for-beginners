---
name: PR Review Checklist
description: Use when reviewing a pull request, a diff, or a branch before merge, or when asked whether a change is safe to ship
---

# PR Review Checklist

A review that finds the bug CI cannot see: the one in the logic.

## When to use

- The user asks for a review of a diff, branch, or PR
- A merge is being considered
- A change touches auth, money, data deletion, or migrations

## Inputs

- The diff: `git diff <base>...HEAD` or the PR's changed files
- The repo's test and lint commands, if discoverable
- Any stated intent from the author

If you cannot see the diff, ask for it. Do not review from the description alone.

## Workflow

1. **Read the stated intent.** One sentence: what is this supposed to change?
2. **Read the diff in file order.** Note files that are unrelated to the intent.
3. **Check correctness.** Off-by-one, empty inputs, null/undefined, error paths, retries, timeouts.
4. **Check boundaries.** Authn/authz on every new path, tenant isolation, input validation, output encoding.
5. **Check data.** Migrations reversible? Backfill safe on a live table? Deletes scoped?
6. **Check tests.** Do they assert behavior, or just execute lines? Is the failure case covered?
7. **Check blast radius.** Feature flag? Rollback path? Logging that would leak secrets?
8. **Report findings ordered by severity**, each with file:line and a concrete fix.

## Rules

- Cite `file:line` for every finding. No vague "consider improving error handling".
- Separate **blocking** issues from **nice-to-have** suggestions.
- If the diff is too large to review well, say so and propose a split before continuing.
- Never approve a change you could not read in full.
- Do not restate the diff back to the author. They wrote it.
- If nothing is wrong, say so plainly and name the two things you verified.
- Read `references/severity-guide.md` before assigning severity.

## Output format

```markdown
## Verdict
<approve | approve with nits | request changes>

## Blocking
1. `src/auth/session.ts:42` — refresh token accepted after rotation. Fix: compare `token_version` before issuing.

## Non-blocking
- `src/ui/Button.tsx:12` — prop name `onClickk` typo.

## Verified
- Auth middleware applied to both new routes.
- Migration has a working `down()`.
```

## Stop conditions

Stop and ask, rather than guessing, when:

- The diff includes generated files or lockfiles you cannot interpret
- The change requires domain knowledge not present in the repo
- You would need to run destructive commands to verify behavior
