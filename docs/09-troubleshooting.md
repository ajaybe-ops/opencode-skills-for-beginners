# 09 · Troubleshooting

> **Prev:** [08 · Skills vs. agents vs. commands](08-skills-vs-agents-vs-commands.md) · **Next:** [10 · Glossary](10-glossary.md)

Work top to bottom. These six causes account for nearly every "my skill is not loading".

---

## The six-cause checklist

### 1. Filename is wrong

Only two names count:

- a **root-level** `*.md` file inside a source folder, e.g. `skills/review.md`
- a file named **exactly** `SKILL.md`, e.g. `skills/git-release/SKILL.md`

```text
✅ skills/git-release/SKILL.md
❌ skills/git-release/skill.md
❌ skills/git-release/SKILL.MD
❌ skills/git-release/README.md
```

Case matters on Linux and macOS.

### 2. The folder is nested wrong

```text
❌ ~/.config/opencode/skills/xlsx/xlsx/SKILL.md
✅ ~/.config/opencode/skills/xlsx/SKILL.md
```

Also check that you are not inside another skill's folder — OpenCode does not search inside a skill directory for more skills:

```text
❌ .opencode/skills/git-release/extras/notes/SKILL.md
```

### 3. The session is stale

Discovery happens **at session start**. A folder created mid-session will not appear. Start a new session in the directory where the skill should be visible.

### 4. No `description`

A skill without a `description` is never advertised to the model. It still exists, and `@id` can load it, but auto-invocation is impossible.

```markdown
---
name: Release Helper
description: Use when preparing a release, writing release notes, or bumping a version
---
```

### 5. The ID is wrong

The ID is derived from the path, not the `name` field, and it is **case-sensitive**.

| Installed | ID |
| --- | --- |
| `.opencode/skills/git-release/SKILL.md` | `git-release` |
| `.opencode/skills/teams/release/SKILL.md` | `release` |
| `.opencode/skills/Review.md` | `Review` |
| `name: Git Release` in the frontmatter | *still not an ID* |

For portable skills use lowercase kebab-case and match the folder name: `^[a-z0-9]+(-[a-z0-9]+)*$`.

### 6. Something is overriding it

Skills resolve by ID, and later sources win:

```text
built-in → .claude/ → .agents/ → ~/.config/opencode/ → .opencode/ → opencode.json `skills`
```

Find the duplicate:

```bash
find . ~/.config/opencode ~/.claude ~/.agents -name SKILL.md 2>/dev/null | sort
```

```powershell
Get-ChildItem -Path .,"$HOME\.config\opencode","$HOME\.claude","$HOME\.agents" -Recurse -Filter SKILL.md -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
```

---

## Symptom → cause table

| Symptom | Most likely cause | Fix |
| --- | --- | --- |
| Skill never triggers | Missing/narrow `description` | Rewrite as "Use when …" with artifact words |
| `@name` does nothing | Wrong ID or case | Use the path-derived ID exactly |
| Two skills fight | Overlapping descriptions | Merge, or scope with "Use **only** when…" |
| Loads, then ignores steps | Prose body | Numbered workflow + explicit rules |
| Reads a reference file that does not exist | Wrong relative path | Paths are relative to the `SKILL.md` folder |
| Works for you, not a teammate | Installed globally | Move into `.opencode/skills/` and commit |
| Worked yesterday, not today | Another source now defines the ID | Check precedence |
| Catalog skills missing | `index.json`, same-origin, or `version` | Validate JSON; bump `version` |
| Model sees nothing at all | Permissions deny | Check `action: "skill"` rules |
| Hidden from the model but `@id` works | `opencode/autoinvoke: false` | Intended behavior |

---

## Fast diagnostics

**Is the file where you think it is?**

```bash
ls -l .opencode/skills/*/SKILL.md
```

```powershell
Get-ChildItem .opencode\skills\*\SKILL.md
```

**Does the frontmatter parse?**

```bash
node scripts/validate-skills.mjs
```

The script in this repo checks for `SKILL.md`, a `name`, a `description`, and a valid kebab-case folder ID.

**Did permissions block it?**

```jsonc
{
  "permissions": [
    { "action": "skill", "resource": "*", "effect": "allow" }
  ]
}
```

Rules are evaluated in order and the **last** match wins, so a broad `deny` at the end beats an `allow` above it.

**Is it a catalog problem?**

Open `https://<base>/index.json` in a browser. If it does not render as JSON, the catalog is the problem — not your config.

---

## Still stuck? Reduce to one variable

1. Delete every skill except the one you are debugging.
2. Put it in `.opencode/skills/` inside a **new empty folder**.
3. `cd` into that folder.
4. Start a session there and run `@that-skill-id`.
5. Confirm the file path the model reports.

If that works, the skill is fine and the problem is scope, precedence, or permissions. If it fails, the problem is the file itself — usually the name, the depth, or the frontmatter.

---

## Reporting a bug in a skill

Include:

- The exact install path
- The frontmatter block
- The prompt you used
- Whether `@id` works
- The version from `opencode --version`

That is usually enough to reproduce it in one pass.

---

**Next:** [10 · Glossary →](10-glossary.md)
