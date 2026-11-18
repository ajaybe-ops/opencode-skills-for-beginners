---
name: Hello Skill
description: Use when the user asks for a friendly greeting, a demo of how skills work, or wants to verify that skill loading is configured correctly
---

# Hello Skill

The smallest useful skill. Use it to prove that discovery, the `skill` tool, and your install path all work.

## Workflow

1. Greet the user by name if you know it, otherwise say "hello" without guessing.
2. State that you loaded the **hello-skill** skill from `SKILL.md`.
3. Ask exactly one short question: what they want to try next.

## Rules

- Do not create, edit, or delete any files.
- Do not invent a file path. If the user asks where this skill lives, report the base directory you were given.
- Keep the whole reply under 60 words.
