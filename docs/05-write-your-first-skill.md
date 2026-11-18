# 05 · Write your first skill

> **Time:** 20 minutes · **Prev:** [04 · Use a skill](04-use-a-skill.md) · **Next:** [06 · Global vs. project](06-global-vs-project.md)

You already installed one. Now write one you will keep. We will build a commit-message skill, but the structure applies to anything: deploy checklists, review procedures, document formats, data pipelines, incident runbooks.

---

## Step 1 · Pick a workflow you repeat

Good first skills are **narrow, checkable, and frequent**:

- ✅ "Write commit messages in Conventional Commits format."
- ✅ "Summarize a PR diff into reviewer-friendly bullets."
- ✅ "Convert a CSV into a formatted .xlsx with a summary sheet."
- ❌ "Be a better engineer." (not a procedure)
- ❌ "Handle all my documents." (no boundary)

Write down the one sentence you are tired of repeating. That sentence becomes the skill.

## Step 2 · Create the folder

```bash
mkdir -p .opencode/skills/commit-message-writer/references
```

```powershell
New-Item -ItemType Directory -Force .opencode\skills\commit-message-writer\references
```

Directory form is strongly preferred over a flat `commit-message-writer.md`, because supporting files get a private base directory:

```text
commit-message-writer/
├── SKILL.md
└── references/
    └── conventional-commits.md
```

## Step 3 · Write frontmatter

```markdown
---
name: Commit Message Writer
description: Use when writing, reviewing, or fixing a git commit message or pull request description
---
```

### The `description` is 90% of the skill

It is the only thing the model sees before loading. Write it as **"Use when …"** and include the words a user would actually type.

| ❌ Doesn't trigger | ✅ Triggers |
| --- | --- |
| `description: Git helper` | `description: Use when writing, reviewing, or fixing a git commit message or PR description` |
| `description: Excel stuff` | `description: Use when creating, editing, or analyzing .xlsx spreadsheets, formulas, or pivot tables` |
| `description: Helps with security` | `description: Use when auditing code for SQL injection, XSS, auth bypass, or secret leakage` |

Checklist for a description:

- Starts with a verb phrase or "Use when…"
- Names the **artifact** (commit message, .xlsx, SQL schema)
- Names the **situation** (before committing, during review, under load)
- Stays roughly under 200 characters
- Does not overlap with a skill you already have

### Optional switches

```yaml
metadata:
  opencode/autoinvoke: false   # hide from auto-discovery, keep @id working
```

Use this for anything destructive: deploys, migrations, bulk deletions, expense approvals.

## Step 4 · Write the body

A body that models follow has five parts. Not every skill needs all five, but the order is reliable.

```markdown
# Commit Message Writer

## When to use
The user asks for a commit message, or a commit is about to be created.

## Inputs
- The staged diff (`git diff --staged`)
- Optional: the issue or ticket ID

## Workflow
1. Run `git diff --staged` and read the whole change. If the diff is empty, stop and say so.
2. Classify the change: feat, fix, docs, refactor, test, chore, perf, build, ci.
3. Choose a scope from the changed paths — `auth`, `api`, `ui`. Never invent one.
4. Draft `<type>(<scope>): <imperative summary>` in 72 characters or less.
5. If the body needs detail, add a blank line and wrap at 72 columns.
6. Show the message. Wait for approval. Only then run `git commit`.

## Rules
- Imperative mood: "add", not "added" or "adds".
- One logical change per commit. If the diff mixes unrelated work, say so instead of hiding it.
- Never claim a ticket reference the user did not provide.

## Examples
Input: adds retry with backoff to GET/PUT
Output: `feat(http): retry idempotent requests on 429`

Input: fixes null crash in avatar upload
Output: `fix(upload): guard against missing filename`
```

### Why this shape works

| Section | Job |
| --- | --- |
| **When to use** | Disambiguates from neighboring skills |
| **Inputs** | Stops the agent from inventing data |
| **Workflow** | Numbered steps the model can follow and you can audit |
| **Rules** | Constraints, including hard stops |
| **Examples** | Shows the target format better than prose can |

### Writing rules that actually constrain behavior

| Weak | Strong |
| --- | --- |
| "Be concise." | "Keep the subject line ≤ 72 characters." |
| "Use good judgment." | "If the diff touches more than one module, stop and ask which change to commit first." |
| "Don't make mistakes." | "If `git diff --staged` returns nothing, report that and stop." |
| "Follow best practices." | "Reference `references/conventional-commits.md` for allowed types." |

Explicit stop conditions are the highest-value lines in any skill. They are what turns a suggestion into a procedure.

## Step 5 · Add supporting files (optional)

Keep the body short; push reference material into files the body points at:

```markdown
## Reference
Read `references/conventional-commits.md` before choosing a type.
```

Paths inside a skill are **relative to the folder containing `SKILL.md`**. The agent receives that base directory plus a sample of up to ten supporting file paths — but **it does not read them until the body tells it to**.

That is the right place for long lookup tables, style guides, templates, and schemas. It is the wrong place for critical instructions, because a model under time pressure may skip a file it was not explicitly told to open.

## Step 6 · Test it like a user

Start a **new** session, then try three prompts:

```text
1. @commit-message-writer write a message for my staged changes
2. Write a commit message for my staged changes.        ← does it auto-trigger?
3. What does the commit-message-writer skill require before committing?   ← did the rules land?
```

Then test the boundaries:

```text
4. Write a commit message for an empty diff.            ← should stop, not hallucinate
5. Commit this and push to main.                        ← should ask, not act
```

If (2) fails but (1) works, your description is too vague. If (5) acts without asking, your rules are too soft.

## Step 7 · Version it

Skills are code. Keep them in git:

```bash
git add .opencode/skills/commit-message-writer
git commit -m "feat(skills): add commit-message-writer"
```

Two habits that pay off:

- **One skill per commit** — makes `git log` a changelog of your agent's behavior.
- **Bump a `version` in frontmatter** if you serve the skill from an HTTP catalog, since caches key off it.

## Step 8 · Prune

Re-read every skill monthly and ask: *did this fire in the last 30 days?* Skills that never fire are not free — they add description noise that makes real matches less certain. Delete the folder and move on.

---

## Common failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Never auto-triggers | Vague description | Add the artifact and situation words |
| Triggers constantly | Description too broad | Narrow it; add "Use **only** when…" |
| Triggers on everything | Two overlapping skills | Merge them or sharpen the boundary |
| Steps skipped | Body is prose, not a list | Numbered workflow + explicit rules |
| Reads the wrong file | Absolute or `../` paths | Use paths relative to `SKILL.md` |
| Different result each run | Ambiguous inputs | Add an **Inputs** section and stop conditions |
| Works locally, not for teammate | Installed globally | Move it into `.opencode/skills/` and commit |

---

## Check yourself

1. Rewrite this description: `description: Helps with tests`.
2. What belongs in `references/` rather than in the body?
3. Why should a destructive skill set `opencode/autoinvoke: false`?

<details>
<summary>Answers</summary>

1. Example: `Use when writing, fixing, or reviewing unit, integration, or end-to-end tests, including flaky test triage`.
2. Long lookup material (style guides, schemas, type tables) that is only needed for part of the workflow — while critical instructions stay in the body.
3. So it never loads by accident. The model cannot see it; you must type `@skill-id` deliberately.
</details>

---

**Next:** [06 · Global vs. project →](06-global-vs-project.md)
