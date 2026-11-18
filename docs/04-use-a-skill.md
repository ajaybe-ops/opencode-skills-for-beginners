# 04 · Use a skill

> **Time:** 10 minutes · **Prev:** [03 · Install a skill](03-install-a-skill.md) · **Next:** [05 · Write your first skill](05-write-your-first-skill.md)

There are two ways to get a skill into a conversation: let the agent choose, or force it. Most of the time you should let it choose — but knowing the manual path makes debugging trivial.

---

## Way 1 · Just describe the task (recommended)

OpenCode advertises every eligible skill at each step. Describe what you want and the matching skill is loaded automatically.

```text
Review my staged changes and write a commit message.
```

The agent compares your request to descriptions like *"Use when writing, reviewing, or fixing git commit messages"* and loads `commit-message-writer` before answering.

**Good prompts name the artifact:**

| Prompt | Likely to trigger |
| --- | --- |
| "Turn this CSV into a formatted spreadsheet." | `xlsx` |
| "The API returns 429s under load." | `rate-limiting`, `caching-strategies` |
| "Write release notes for v2.3.0." | `git-commits`, `changelog-writing` |

**Weak prompts leave the match to chance:**

| Prompt | Problem |
| --- | --- |
| "Help me with this." | no artifact, no action |
| "Do the thing from yesterday." | no shared context |
| "Make it better." | nothing to match against |

## Way 2 · Force it with `@skill-id`

Mention the ID and OpenCode loads that skill regardless of description matching:

```text
@hello-skill show me what you do
@pdf-handling extract the tables from invoice.pdf into markdown
```

Rules that trip people up:

- Use the **path-derived ID**, not the frontmatter `name`.
- IDs are **case-sensitive**.
- No `.md`, no folder path, no `@skills/`.

| Installed at | Correct invocation |
| --- | --- |
| `.opencode/skills/git-release/SKILL.md` | `@git-release` |
| `.opencode/skills/teams/release/SKILL.md` | `@release` |
| `.opencode/skills/Review.md` | `@Review` |
| `.opencode/skills/git-release/SKILL.md` (`name: Git Release`) | `@git-release` ← not `@Git Release` |

## How to verify it actually loaded

Ask questions only the file can answer:

```text
Load hello-skill, then tell me:
1. The absolute path of the SKILL.md you read.
2. The exact wording of step 2 in the workflow.
```

If the answer matches the file byte-for-byte, it loaded. If it paraphrases something plausible but different, the model is guessing — your skill did not load.

Practical checks, in order:

1. New session? (Discovery happens at session start.)
2. `description` present in the frontmatter?
3. Filename exactly `SKILL.md`?
4. ID spelled exactly, with the right case?
5. Is another source shadowing the same ID?

## Keep loaded skills from becoming noise

Skills stay in the conversation once loaded. If a long session drifts, start fresh rather than piling on more instructions.

For skills you want **available but never automatic** — think "dangerous deploy helper" — set:

```yaml
metadata:
  opencode/autoinvoke: false
```

The agent no longer sees it in the list, but `@deploy-prod` still works. That is exactly the behavior you want for anything with side effects.

## Control who can load what

Permissions use `action: "skill"` and the skill ID as the resource. Rules run in order; the last match wins.

```jsonc
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [
    { "action": "skill", "resource": "*",            "effect": "allow" },
    { "action": "skill", "resource": "internal-*",   "effect": "deny"  },
    { "action": "skill", "resource": "deploy-*",     "effect": "ask"   }
  ]
}
```

| Effect | Result |
| --- | --- |
| `allow` | Advertised and loaded without asking |
| `ask` | Advertised, but you approve each load |
| `deny` | Hidden from the model and impossible to load |

Scope the same rules to one agent by putting them under `agents.<id>.permissions`.

## A worked session

```text
you  ›  My staged diff adds a retry wrapper. Write the commit message.

     · skill commit-message-writer loaded
     · running: git diff --staged

ai   › feat(http): retry idempotent requests on 429

       Adds exponential backoff for GET/PUT with a 3-attempt cap.
       Commit this message? [y/N]
```

Note what made it work: the request named a real action ("write the commit message") that the description promises.

---

## Check yourself

1. You installed `pr-review-checklist` and typed `@PR Review Checklist`. Why does it fail?
2. What is the difference between `deny` and `opencode/autoinvoke: false`?
3. Your skill loads but the agent ignores its steps. What is the most likely cause?

<details>
<summary>Answers</summary>

1. The ID is `pr-review-checklist` — path-derived, lowercase kebab-case, case-sensitive.
2. `deny` blocks loading entirely. `autoinvoke: false` hides it from automatic discovery but still allows explicit `@id` loading.
3. The body is vague. Models follow concrete, numbered steps and explicit rules far more reliably than prose like "be careful and use good judgment".
</details>

---

**Next:** [05 · Write your first skill →](05-write-your-first-skill.md)
