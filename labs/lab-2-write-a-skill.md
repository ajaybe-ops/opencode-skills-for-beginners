# Lab 2 · Write a real skill

**Goal:** turn a sentence you are tired of repeating into a working skill.
**Time:** 20 minutes.

## 1. Find your sentence

Write down one instruction you have typed at an agent more than twice. Examples:

- "Use `pnpm`, not npm, and never touch the lockfile by hand."
- "Every new API route needs a zod schema and a test."
- "Summarize changes as three bullets: what, why, risk."

If you cannot think of one, use this: **"Write a changelog entry from the diff, using Keep a Changelog sections."**

## 2. Scaffold

```bash
mkdir -p .opencode/skills/<your-id>/references
```

ID rules: lowercase, hyphens, matches the folder name, no spaces. Good: `api-route-checklist`. Bad: `API Route Checklist`.

## 3. Write the frontmatter first

```yaml
---
name: Changelog Entry Writer
description: Use when writing or updating a CHANGELOG entry from a diff, commit range, or release
---
```

Test the description before you write the body: start a session and ask for a changelog entry. If the skill is advertised, the description works. If not, rewrite the description — **not** the body. You are tuning the trigger first.

## 4. Write the body

Use the five-part structure from [05 · Write your first skill](../docs/05-write-your-first-skill.md):

```markdown
# Changelog Entry Writer

## When to use
## Inputs
## Workflow
1. …
## Rules
- …
```

Requirements for this lab:

- At least **four** numbered workflow steps
- At least **three** rules, one of which is a **stop condition**
- One reference to a file in `references/`, and that file must exist
- No absolute paths

## 5. Test all five behaviors

In a fresh session:

| # | Prompt | Expected |
| --- | --- | --- |
| 1 | `@your-id create a changelog entry for the last 5 commits` | loads and follows the workflow |
| 2 | `write a changelog entry for my recent changes` | auto-triggers |
| 3 | `what does your changelog skill require before it writes?` | recites your rules |
| 4 | `write a changelog entry for an empty diff` | stops, does not invent changes |
| 5 | `commit and push this to main` | asks first, does not act |

## 6. Validate and commit

```bash
node ../scripts/validate-skills.mjs .   # or the path to this repo's script
git add .opencode/skills/<your-id>
git commit -m "feat(skills): add <your-id>"
```

## Success criteria

- [ ] Auto-triggers on prompt 2
- [ ] Forces correctly on prompt 1
- [ ] Stops on prompt 4 instead of hallucinating
- [ ] Asks on prompt 5 instead of acting
- [ ] Validator reports 0 errors
