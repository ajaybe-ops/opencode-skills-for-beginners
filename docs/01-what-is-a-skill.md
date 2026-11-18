# 01 · What is a skill?

> **Time:** 5 minutes · **You need:** nothing installed · **Prev:** [Home](../README.md) · **Next:** [02 · Install OpenCode](02-install-opencode.md)

## The one-sentence definition

A **skill** is a folder containing a `SKILL.md` file that teaches an agent a repeatable workflow, and that the agent loads only when the task needs it.

That is the whole concept. There is no registry, no build step, no daemon.

```text
.opencode/skills/hello-skill/
└── SKILL.md
```

```markdown
---
name: Hello Skill
description: Use when the user asks for a friendly greeting or a demo of skills
---

# Hello Skill

1. Greet the user by name.
2. Say which file you loaded.
```

## Why skills exist

Agents are good at reasoning and bad at remembering *your* way of doing things. Without a skill you repeat yourself every session:

> "No, the changelog goes above the diff, use `### Added` headers, and don't bump the patch version for docs-only changes."

A skill turns that into a file the agent reads on its own. One sentence in a `description`, and the knowledge is available forever — to you and to everyone who clones the repo.

## The two-part trick: advertise, then load

This is the part beginners miss, and it explains most "why isn't my skill doing anything" confusion.

```text
Every model step                          When the task matches
┌─────────────────────────────┐          ┌──────────────────────────────┐
│ Available skills:           │          │ Full SKILL.md body           │
│  • hello-skill — Use when…  │  ──────► │ + base directory             │
│  • git-release — Prepare…   │  loads   │ + up to 10 supporting paths  │
│  • pdf-handling — Use when… │          │                              │
└─────────────────────────────┘          └──────────────────────────────┘
        names + descriptions only              instructions, on demand
```

1. **Advertise.** At every step, OpenCode gives the model a list of skills — **ID, name, description only**. Not the body.
2. **Load.** When your request matches a description (or you write `@skill-id`), the model calls the `skill` tool, and only then does the body enter the conversation.

Consequences worth internalizing:

- Many skills are cheap. Bodies are not in context until used.
- **A skill with no `description` is never advertised.** It still exists and can be loaded by ID, but the agent will not discover it.
- **Descriptions compete.** Two skills both claiming "use for code review" make the choice ambiguous. Write descriptions that describe a *situation*.
- Supporting files (`references/`, `scripts/`) are **not** loaded automatically. The body must tell the agent to read them.

## Anatomy of a real skill

```text
commit-message-writer/
├── SKILL.md                        ← required: frontmatter + instructions
├── references/
│   └── conventional-commits.md     ← read only when the skill says so
└── scripts/
    └── check-subject.sh            ← optional helper the agent can run
```

`SKILL.md` has two layers:

```markdown
---
name: Commit Message Writer                  ← display label (optional)
description: Use when writing a commit…      ← the trigger (this matters)
metadata:
  opencode/autoinvoke: true                  ← optional behavior switches
---

# Commit Message Writer                      ← body: plain Markdown

## When to use
## Workflow
## Rules
## Examples
```

| Frontmatter field | Purpose |
| --- | --- |
| `name` | Human-readable label. Defaults to the path-derived ID. |
| `description` | **The trigger.** Without it the model never sees the skill. |
| `metadata.opencode/autoinvoke: false` | Hide from the model's list; keep it loadable by ID. |
| `disable-model-invocation: true` | Same effect as above (portability alias). |

Everything else — `license`, `compatibility`, custom keys — is accepted but not interpreted by OpenCode.

## What a skill is *not*

| You might think… | Reality |
| --- | --- |
| "It's a plugin" | Plugins run code inside OpenCode. Skills are instructions the model reads. |
| "It's an MCP server" | MCP servers expose tools/data over a protocol. Skills teach procedure. |
| "It's an agent" | Agents are roles with their own model, tools, and permissions. Skills are procedures any agent can load. |
| "It's a slash command" | Commands are prompts *you* invoke. Skills are workflows the *model* invokes. |
| "It's a prompt file" | Close — but a skill has discovery, scoping, permissions, and supporting files. |

Longer comparison: [08 · Skills vs. agents vs. commands](08-skills-vs-agents-vs-commands.md).

## Where they live (preview)

| Scope | Path |
| --- | --- |
| Global | `~/.config/opencode/skills/<id>/SKILL.md` |
| Project | `.opencode/skills/<id>/SKILL.md` |
| Compatible | `~/.claude/skills/`, `~/.agents/skills/`, and project equivalents |
| Catalog | A URL in the `skills` array of `opencode.json` |

The ID is derived from the **path**, not the `name` field:

```text
.opencode/skills/git-release/SKILL.md   → id: git-release
.opencode/skills/teams/release/SKILL.md → id: release
```

---

## Check yourself

1. What are the only two things OpenCode shows the model before a skill is loaded?
2. Why does a skill with no `description` never trigger?
3. Your skill is at `.opencode/skills/My Skill/SKILL.md`. What ID do you type after `@`?

<details>
<summary>Answers</summary>

1. The skill's ID (and name) and its description.
2. Skills without a description are not advertised in the model's available list.
3. `My Skill` — IDs are path-derived and case-sensitive, spaces included. Which is exactly why the docs recommend lowercase kebab-case.
</details>

---

**Next:** [02 · Install OpenCode →](02-install-opencode.md)
