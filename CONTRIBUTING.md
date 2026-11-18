# Contributing

Thanks for improving this guide. It exists because skills are simple and most explanations are not.

## What is welcome

- **Corrections.** If OpenCode changed a path, a flag, or a default, that is a bug here.
- **Clearer explanations.** Replace a paragraph with a table or a diagram if it helps.
- **New beginner examples.** A skill that a person could plausibly need in their first week.
- **Translations.** Open an issue first so we can agree on a folder layout.

What is not welcome: enterprise architecture rewrites, links to paid courses, and examples that need credentials or a specific cloud account.

## Ground rules for content

1. **Every claim is checkable.** Link the official docs when behavior could change.
2. **No invented commands.** If you have not run it, do not ship it.
3. **Beginner means beginner.** Define a term the first time you use it, or link the glossary.
4. **No wall of text.** Tables, numbered steps, and short sections beat paragraphs.
5. **One idea per page.** Docs are numbered for a reason; keep them independent.

## Adding an example skill

Place it in `examples/<kebab-case-id>/`:

```text
examples/my-skill/
├── SKILL.md
└── references/        ← optional, only if SKILL.md tells the agent to read it
```

Requirements:

- Folder name is lowercase kebab-case and matches the ID
- `description` starts with "Use when…" and names both situation and artifact
- Body has a `## When to use`, a numbered `## Workflow`, and a `## Rules` section with at least one stop condition
- Every `references/…` path exists
- No absolute paths, no secrets, no company-specific internal names

## Check before you open a PR

```bash
node scripts/validate-skills.mjs
```

It must exit 0. It verifies frontmatter, IDs, referenced files, and every relative Markdown link.

## Commit style

Conventional Commits, one logical change per commit:

```text
docs(troubleshooting): add stale-session cause
feat(examples): add changelog-entry-writer
fix(scripts): skip .github when walking skills
```

## Pull requests

- Say **what was wrong** and **what you changed**, in that order.
- Mention anything you could not verify.
- Keep the diff focused; split unrelated fixes into separate PRs.
- If you change a documented behavior, update the doc **and** the cheatsheet.

## Reporting a docs bug

Include the page, the sentence, what you expected, and what actually happened. A link to the official source settles most disagreements in one round.

## License

By contributing you agree your work is released under the [MIT License](LICENSE).
