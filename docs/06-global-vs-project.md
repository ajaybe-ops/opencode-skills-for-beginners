# 06 · Global vs. project skills

> **Time:** 8 minutes · **Prev:** [05 · Write your first skill](05-write-your-first-skill.md) · **Next:** [07 · Load from a URL](07-load-from-url.md)

Two folders, one question: **who needs this?**

| | Global | Project |
| --- | --- | --- |
| Path | `~/.config/opencode/skills/` | `.opencode/skills/` |
| Visible in | every project on your machine | that repository only |
| Travels with git | no | yes |
| Good for | personal workflow, formatting taste, languages you use everywhere | repo commands, deploy steps, team conventions, domain rules |
| Reviewed by | you | your team, in PRs |

Rules of thumb:

- **Personal habit → global.** "I like Conventional Commits."
- **Repo fact → project.** "Our tests run with `pnpm test:unit`, and staging deploys from `main` only."
- **Anything with credentials or environment names → project, and never commit secrets into it.**

If a project skill and a global skill do the same job, the **project one wins**. That is how you let a repo override your personal default without renaming anything.

---

## Precedence, lowest to highest

```text
1. built-in skills
2. ~/.claude/skills, then .claude/skills (ancestor → current dir)
3. ~/.agents/skills, then .agents/skills (ancestor → current dir)
4. ~/.config/opencode/skills
5. .opencode/skills (project root → current dir)
6. explicit `skills` entries in opencode.json (in config order)
```

Skills are selected **by ID**. If two sources define `git-release`, the later source in that list supplies the version OpenCode loads.

```text
~/.config/opencode/skills/git-release/SKILL.md   ← lower precedence
.opencode/skills/git-release/SKILL.md            ← this one loads
```

> [!TIP]
> Precedence is a feature, not a trap. Keep a generic `code-review` global, then let each repo drop in its own `.opencode/skills/code-review/SKILL.md` for repo-specific rules. Same ID, better answer in that repo.

## Discovery details worth knowing

OpenCode searches **upward from your current directory to the project root** and collects matching skill folders at every level:

```text
repo/
├── .opencode/skills/format/SKILL.md          ← found from anywhere in repo
└── services/api/
    ├── .opencode/skills/api-tests/SKILL.md   ← found from services/api downward
    └── src/                                  ← you are here
```

Inside a source folder:

- Every folder containing `SKILL.md` is **one** skill. OpenCode does not search **inside** it for more skills.
- Flat `*.md` files are only picked up at the **source root**, not in subfolders.
- Hidden folders and `node_modules` are skipped.
- Search stops **six directories** below the source root.
- A skill directory named `skills` inside another skill is not discovered.

## Compatible locations

Skills written for other agents work unchanged:

```text
~/.claude/skills/     ~/.agents/skills/
.claude/skills/       .agents/skills/
```

That means the install path you may already have for Claude Code is live in OpenCode too — no migration, no conversion. OpenCode's own docs list these as global and project "compatibility" sources.

## When to prefer global

- A language or framework you use in every repo
- Personal writing and commit style
- Editor/terminal workflows
- Skills you are still experimenting with

Downside: invisible to teammates, and it silently changes every project. If a global skill changes how a shared repo behaves, it should probably be a project skill instead.

## When to prefer project

- Build, test, lint, and deploy commands for one repo
- Architecture rules ("never import `services/` from `components/`")
- Domain vocabulary (what "account", "tenant", or "shipment" means here)
- Anything reviewed in a pull request
- Anything onboarding a new teammate would need

Upside: discoverable, reviewable, diffable. A new contributor gets your agent behavior on clone.

## Sharing with your team

```text
repo/
└── .opencode/
    └── skills/
        ├── api-tests/
        │   ├── SKILL.md
        │   └── references/
        │       └── fixtures.md
        └── release/
            └── SKILL.md
```

Commit the folder. Teammates need no install step. Treat changes like code:

- One skill per PR, with the motivation in the description.
- Test after editing — start a new session and invoke it.
- Review descriptions, not just bodies; descriptions decide when the skill fires.

## Pin behavior with `opencode.json`

If you want to guarantee a shared set of skills regardless of local folders, commit a config that adds explicit sources:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": ["./team-skills"]
}
```

Relative paths resolve from the **active working directory**, not the config file's location. `~/` expands to your home directory; absolute paths are used as written.

Explicit `skills` entries have the **highest** precedence and are combined across every config file — they are not replaced by a later file.

---

## Check yourself

1. Your global `code-review` skill never applies in one repo. Why?
2. A teammate clones the repo and gets your skills with no setup. Which scope did you use?
3. You add `./team-skills` to a config in `~/`, then run OpenCode in `~/code/app`. Where does it look?

<details>
<summary>Answers</summary>

1. That repo likely has its own `.opencode/skills/code-review/SKILL.md`, and project scope outranks global scope for the same ID.
2. Project scope — the skills are committed inside `.opencode/skills/`.
3. `~/code/app/team-skills` — relative paths resolve from the working directory, not from the config file.
</details>

---

**Next:** [07 · Load from a URL →](07-load-from-url.md)
