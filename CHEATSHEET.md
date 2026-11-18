# Cheatsheet

One page. Print it, pin it, ignore the rest of the repo until you need it.

## The shape of a skill

```text
.opencode/skills/<id>/
├── SKILL.md
└── references/        ← optional
```

```markdown
---
name: Display Name
description: Use when <situation> and <artifact> are involved
---

# Display Name

## When to use
## Inputs
## Workflow
1. …
## Rules
- …
```

## Where things go

| Scope | Path |
| --- | --- |
| Global | `~/.config/opencode/skills/<id>/SKILL.md` |
| Project | `.opencode/skills/<id>/SKILL.md` |
| Claude compat | `~/.claude/skills/`, `.claude/skills/` |
| Agents compat | `~/.agents/skills/`, `.agents/skills/` |
| Catalog | `"skills": ["https://…/catalog/"]` in `opencode.json` |

Windows global: `C:\Users\<you>\.config\opencode\skills\`

## Three commands

```bash
# make a project skill
mkdir -p .opencode/skills/my-skill && $EDITOR .opencode/skills/my-skill/SKILL.md

# install from the directory
curl -fsSL https://opencodeskills.dev/install.sh | sh -s -- install --project git-commits

# validate this repo's examples
node scripts/validate-skills.mjs
```

## Invoke

```text
Write me a commit message for the staged diff.     ← auto, description match
@commit-message-writer write the commit message     ← explicit, always works
```

- Use the **path-derived ID**, not the frontmatter name
- IDs are **case-sensitive**
- Start a **new session** after creating or installing a skill

## Frontmatter

```yaml
name: Commit Message Writer
description: Use when writing, reviewing, or fixing git commit messages
metadata:
  opencode/autoinvoke: false    # optional: hide from auto-discovery
```

| Field | Effect |
| --- | --- |
| `name` | Display label only |
| `description` | Controls auto-discovery — required for triggers |
| `metadata.opencode/autoinvoke: false` | Hidden from the model, still `@id`-loadable |
| `disable-model-invocation: true` | Alias for the above |

## Precedence (lowest → highest)

```text
built-ins → .claude → .agents → ~/.config/opencode → .opencode → opencode.json skills
```

Same ID in two places? The later one wins.

## Description patterns

```yaml
✅ description: Use when writing or fixing git commit messages and PR descriptions
✅ description: Use when creating, editing, or analyzing .xlsx spreadsheets
✅ description: Use only when the user asks to deploy to production

❌ description: Git helper
❌ description: Helps with stuff
❌ description: (missing)
```

## Install methods

```bash
# 1. CLI, interactive
curl -fsSL https://opencodeskills.dev/install.sh | sh

# 2. zip
unzip xlsx.zip -d ~/.config/opencode/skills/

# 3. catalog URL (OpenCode 2)
#    opencode.json → "skills": ["https://opencodeskills.dev/catalog/"]

# 4. by hand — just create the folder and SKILL.md
```

## It's not loading — check in this order

1. Filename exactly `SKILL.md` (or root-level `*.md`)
2. Not nested (`skills/x/x/SKILL.md` is wrong)
3. New session started
4. `description` exists
5. ID matches path, correct case
6. No higher-precedence skill with the same ID

## Permissions

```jsonc
{ "permissions": [
  { "action": "skill", "resource": "*",          "effect": "allow" },
  { "action": "skill", "resource": "deploy-*",   "effect": "ask"   },
  { "action": "skill", "resource": "internal-*", "effect": "deny"  }
]}
```

Last matching rule wins.

## Links

- Official docs — <https://opencode.ai/docs/skills/>
- Skill directory — <https://opencodeskills.dev/>
- This repo's guide — [README.md](README.md)
