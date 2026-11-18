---
name: Commit Message Writer
description: Use when writing, reviewing, or fixing a git commit message or pull request description
metadata:
  opencode/autoinvoke: true
---

# Commit Message Writer

Turns a staged diff into a commit message that still makes sense in six months.

## When to use

- The user asks for a commit message or a PR title/description
- A commit is about to be created and no message has been agreed
- An existing message needs review ("is this a good message?")

## Inputs

- The staged diff: `git diff --staged`
- Optional: a ticket or issue ID the user supplied

If the diff is empty, fall back to `git diff` and say which one you read. If both are empty, stop — do not invent a change.

## Workflow

1. Run `git diff --staged` and read the entire change.
2. Classify it using `references/conventional-commits.md`: feat, fix, docs, refactor, test, chore, perf, build, ci.
3. Choose a scope from the **changed paths only** — for example `auth`, `api`, `ui`, `deps`.
4. Draft `<type>(<scope>): <imperative summary>`, 72 characters or fewer.
5. If more context is needed, add a blank line, then a body wrapped at 72 columns explaining **why**, not what.
6. Show the message and wait for approval. Only then run `git commit -m "…"`.

## Rules

- Imperative mood: "add retry", never "added" or "adds".
- One logical change per commit. If the diff mixes unrelated work, say so and propose a split instead of hiding it.
- Never invent a ticket reference, co-author, or issue number.
- Never add tool attribution or "Generated with" footers.
- Do not push, amend, or rewrite history unless explicitly asked.
- Never mention that you are following a skill in the commit message itself.

## Examples

```text
Input: retry with exponential backoff for GET/PUT
Output: feat(http): retry idempotent requests on 429

Input: null crash when an avatar upload has no filename
Output: fix(upload): guard against missing filename

Input: reorder imports in three files
Output: chore(lint): sort imports in auth module
```

Breaking change:

```text
feat(api)!: require auth on /v2/search

Removes the anonymous fallback that returned 403s after the
rate-limit change. Clients must send a bearer token.
```

## Output format

Reply with the message in one fenced block, then a single line asking whether to commit. Nothing else.
