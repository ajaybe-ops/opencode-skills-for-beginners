# 08 · Skills vs. agents vs. commands

> **Time:** 6 minutes · **Prev:** [07 · Load from a URL](07-load-from-url.md) · **Next:** [09 · Troubleshooting](09-troubleshooting.md)

OpenCode gives you several ways to shape agent behavior. They overlap just enough to be confusing. Here is the short version.

---

## The one-line distinction

| Primitive | Who starts it | What it is |
| --- | --- | --- |
| **Skill** | the **model**, when a task matches | a procedure the agent can load on demand |
| **Agent** | **you**, by selecting it | a role with its own model, tools, and permissions |
| **Command** | **you**, by invoking it | a saved prompt, run deliberately |
| **MCP server** | the model, as a tool | external tools and data over a protocol |
| **Plugin** | the runtime | code that extends OpenCode itself |

## Skills

**A skill is knowledge.** It answers "how do we do this here?" and costs nothing until it is used.

Use a skill when:

- The knowledge is procedural and repeatable ("how we write migrations")
- It should apply across many tasks, not just when you remember
- You want it versioned in the repo with no code
- Multiple agents should be able to reuse it

```text
.opencode/skills/migrations/SKILL.md
```

## Agents

**An agent is a role.** It bundles a persona, a model, a tool allowlist, and permissions. Switching agents can change *what the assistant is allowed to do*, not just what it knows.

Use an agent when:

- You want a cheap/fast model for one kind of work and a strong model for another
- You need a restricted toolset (read-only reviewer, no-bash planner)
- You want a different system prompt entirely

A skill can be loaded *by* an agent. An agent is not a substitute for a skill, and vice versa.

> Configuration details for agents live in the official docs: <https://opencode.ai/docs/agents/>

## Commands

**A command is a prompt with a name.** You type it; it runs. Nothing decides for you.

Use a command when:

- The action is explicit and intentional ("deploy staging")
- It takes arguments you want to supply each time
- You do not want the model choosing it on its own

If you find yourself typing the same prompt daily, a command removes the typing. If you find the model *should* have known to do it, that is a skill.

## Side-by-side

| Question | Skill | Agent | Command |
| --- | --- | --- | --- |
| Can the model trigger it unprompted? | ✅ yes | — | ❌ no |
| Can it change the model? | ❌ | ✅ | ❌ |
| Can it restrict tools? | ❌ | ✅ | ❌ |
| Is it just Markdown? | ✅ | mostly | ✅ |
| Should it live in the repo? | ✅ often | sometimes | ✅ often |
| Good for "how we do X"? | ✅ | ❌ | ❌ |
| Good for "only read, never write"? | ❌ | ✅ | ❌ |

## Practical combinations

**Reviewer skill + review agent.** The skill holds your review checklist; a read-only agent holds the permission boundary.

**Deploy command + deploy skill.** The command is the deliberate trigger; the skill holds the runbook steps so the prompt stays short.

**Global code-review skill.** Every project gets the same baseline, and each repo can override it with a project-scoped skill of the same ID.

## What about MCP and plugins?

| You want… | Reach for |
| --- | --- |
| To teach a procedure in Markdown | **Skill** |
| To query Jira/Postgres/Linear live | **MCP server** |
| To add a new tool or hook to OpenCode | **Plugin** |
| To pin a model and toolset | **Agent** |
| To save a prompt you repeat | **Command** |

A common beginner mistake is reaching for an MCP server to encode a workflow. If no live data is involved, a skill is lighter, safer, and reviewable in a diff.

---

## Check yourself

1. You want "always run the linter before committing". Skill or agent?
2. You want a reviewer that physically cannot edit files. Skill or agent?
3. You want a one-shot `/release 1.4.0`. Skill, agent, or command?

<details>
<summary>Answers</summary>

1. Skill — it is a procedure the model should apply on its own.
2. Agent — the restriction is a permission boundary, not knowledge. Pair it with a review skill.
3. Command, ideally backed by a release skill that holds the steps.
</details>

---

**Next:** [09 · Troubleshooting →](09-troubleshooting.md)
