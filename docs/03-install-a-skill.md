# 03 · Install a skill

> **Time:** 10 minutes · **Prev:** [02 · Install OpenCode](02-install-opencode.md) · **Next:** [04 · Use a skill](04-use-a-skill.md)

Installing a skill means **putting a folder where OpenCode looks**. That is the entire mechanism. Pick the route that fits you.

Before you start, decide the scope:

- **Global** → `~/.config/opencode/skills/` — your personal habits, available in every project.
- **Project** → `.opencode/skills/` — repo-specific commands and conventions, shared through git.

Not sure? [06 · Global vs. project](06-global-vs-project.md) has a decision table.

---

## Option 1 · CLI installer (easiest)

The [opencodeskills.dev](https://opencodeskills.dev/) installer reads the live catalog, lets you pick, and unpacks into the right folder. Node.js **20.12+** required.

```bash
curl -fsSL https://opencodeskills.dev/install.sh | sh
```

```powershell
# Windows PowerShell
irm https://opencodeskills.dev/cli.mjs -OutFile "$env:TEMP\opencode-skills.mjs"
node "$env:TEMP\opencode-skills.mjs"
```

Skip the menus by naming what you want:

```bash
# two skills, global
curl -fsSL https://opencodeskills.dev/install.sh | sh -s -- install xlsx pdf-handling

# into .opencode/skills/ of the current repo
curl -fsSL https://opencodeskills.dev/install.sh | sh -s -- install --project git-commits

# a whole category
curl -fsSL https://opencodeskills.dev/install.sh | sh -s -- install --category recommended --all

# search without installing
curl -fsSL https://opencodeskills.dev/install.sh | sh -s -- list excel
```

Useful flags: `--dir <path>` for a custom folder, `--yes` to skip confirmation in scripts.

---

## Option 2 · Download a zip

Every skill page on the directory has a `.zip`. For example:

```bash
curl -LO https://opencodeskills.dev/downloads/documentation/xlsx.zip
unzip -l xlsx.zip        # look before you extract
unzip xlsx.zip -d ~/.config/opencode/skills/
```

```powershell
# Windows: Expand-Archive, then move the inner folder
Invoke-WebRequest https://opencodeskills.dev/downloads/documentation/xlsx.zip -OutFile "$env:TEMP\xlsx.zip"
Expand-Archive "$env:TEMP\xlsx.zip" -DestinationPath "$env:TEMP\xlsx" -Force
Move-Item "$env:TEMP\xlsx\xlsx" "$HOME\.config\opencode\skills\xlsx" -Force
```

Result must be **exactly** one level deep:

```text
✅ ~/.config/opencode/skills/xlsx/SKILL.md
❌ ~/.config/opencode/skills/xlsx/xlsx/SKILL.md
```

> [!WARNING]
> The nested `xlsx/xlsx` path is the single most common install failure. It happens when you extract an archive that already contains a folder named after the skill **into** a folder with that same name.

---

## Option 3 · Load a catalog by URL (OpenCode 2)

Nothing is written to disk. Add a catalog to the `skills` array in `opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": [
    "https://opencodeskills.dev/catalog/",
    "https://opencodeskills.dev/catalog/documentation/"
  ]
}
```

Put the file at `~/.config/opencode/opencode.json` for every project, or at the repo root for one project. Restart the session; the skills appear alongside your local ones and download only when loaded.

Full explanation, including `index.json` mechanics: [07 · Load from a URL](07-load-from-url.md).

---

## Option 4 · By hand (no downloads, no Node)

This is also how you install **your own** skills.

```bash
# macOS / Linux — project scope
mkdir -p .opencode/skills/hello-skill
$EDITOR .opencode/skills/hello-skill/SKILL.md
```

```powershell
# Windows — project scope
New-Item -ItemType Directory -Force .opencode\skills\hello-skill
notepad .opencode\skills\hello-skill\SKILL.md
```

Paste:

```markdown
---
name: Hello Skill
description: Use when the user asks for a friendly greeting or a demo of how skills work
---

# Hello Skill

1. Greet the user by name.
2. State the absolute path of the SKILL.md you loaded.
3. Ask one short follow-up question.
```

Step 2 is deliberate: it proves the agent read *your* file and not a hallucinated one.

---

## Confirm the install

1. **Start a new session.** Skills are discovered at session start.
2. Ask in a way that is easy to falsify:

```text
Load hello-skill and tell me its exact file path. Do not create any files.
```

3. Check the path matches what you installed.

If nothing happens, go to [09 · Troubleshooting](09-troubleshooting.md). The usual causes are a wrong filename, a nested folder, or a stale session.

## Update and remove

- **Update:** reinstall over the same folder. The CLI and unzip both overwrite.
- **Remove:** delete the skill's own folder.
- **Don't** delete the parent `skills/` folder — it removes every sibling skill too.

---

## Check yourself

1. Which scope does `.opencode/skills/` belong to, and who sees it?
2. You extracted a zip and got `xlsx/xlsx/SKILL.md`. What do you move?
3. Why does a catalog URL need no cleanup step?

<details>
<summary>Answers</summary>

1. Project scope — anyone who clones the repository.
2. Move the inner `xlsx` folder up one level so `SKILL.md` sits at `skills/xlsx/SKILL.md`.
3. Files are fetched on demand and never written to your skills folder.
</details>

---

**Next:** [04 · Use a skill →](04-use-a-skill.md)
