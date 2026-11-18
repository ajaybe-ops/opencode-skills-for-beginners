# 07 · Load skills from a URL (OpenCode 2)

> **Time:** 10 minutes · **Prev:** [06 · Global vs. project](06-global-vs-project.md) · **Next:** [08 · Skills vs. agents vs. commands](08-skills-vs-agents-vs-commands.md)

Instead of copying folders, you can point OpenCode at an **HTTP catalog**. It fetches an `index.json`, advertises those skills to the model, and downloads files only when a skill loads. Nothing lands in your skills folder.

Requires **OpenCode 2**.

---

## Use an existing catalog

Add URLs to the `skills` array of `opencode.json` — global at `~/.config/opencode/opencode.json`, or per-repo at the project root:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": [
    "https://opencodeskills.dev/catalog/",
    "https://opencodeskills.dev/catalog/documentation/",
    "https://opencodeskills.dev/catalog/testing/"
  ]
}
```

Then **start a new session**. The catalog's skills now appear beside your local ones.

Trade-offs to weigh before you add the whole directory:

| | Catalog URL | Local folders |
| --- | --- | --- |
| Disk footprint | zero | full copies |
| Updates | automatic | you reinstall |
| Works offline | no | yes |
| Auditable before use | not really | yes — you can read the file |
| Survives a dead URL | no | yes |

> [!WARNING]
> A catalog is **remote instructions** that your agent will follow. Prefer catalogs you trust, and review a skill before you rely on it for anything with side effects. For security-sensitive repos, install locally so the content is in the diff.

## How the protocol works

A catalog is a base URL serving `index.json`:

```json
{
  "skills": [
    {
      "name": "git-release",
      "version": "3",
      "files": ["git-release.md", "references/release-policy.md"]
    },
    {
      "name": "pdf-handling",
      "version": "1",
      "files": ["SKILL.md", "references/forms.md"]
    }
  ]
}
```

For each entry, OpenCode downloads `<base-url>/<name>/<file>`.

| Rule | Requirement |
| --- | --- |
| Paths | Safe, relative, same-origin |
| Entry file | Include `SKILL.md` **or** `<name>.md` |
| Updates | Increment `version` when files change, or the cache will not refresh |

Each downloaded directory becomes a source root named after the entry, so both `git-release.md` and `SKILL.md` resolve to the ID `git-release`.

## Publish your own catalog

Any static host works — S3, Cloudflare R2, GitHub Pages, a bucket behind a CDN. You need:

```text
https://example.com/skills/
├── index.json
├── commit-message-writer/
│   ├── SKILL.md
│   └── references/
│       └── conventional-commits.md
└── pdf-handling/
    └── SKILL.md
```

```json
{
  "skills": [
    {
      "name": "commit-message-writer",
      "version": "1",
      "files": ["SKILL.md", "references/conventional-commits.md"]
    },
    {
      "name": "pdf-handling",
      "version": "1",
      "files": ["SKILL.md"]
    }
  ]
}
```

Checklist before you share the URL:

- `index.json` is served with `Content-Type: application/json`
- Every listed file exists at the exact path
- All listed paths are same-origin and contain no `..`
- `version` is incremented on every content change
- Private skills are **not** in a public catalog

Then teammates add one line:

```jsonc
{ "skills": ["https://example.com/skills/"] }
```

## Mixing catalogs and folders

All `skills` entries are combined. Local paths, `~/` paths, absolute paths, and URLs can coexist:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": [
    "./team-skills",
    "~/shared/opencode-skills",
    "/opt/company-skills",
    "https://opencodeskills.dev/catalog/documentation/"
  ]
}
```

Explicit entries take precedence over discovered folders, in array order.

## Debugging a catalog

| Symptom | Check |
| --- | --- |
| No skills appear | Is the host OpenCode 2? Does `<base>/index.json` return valid JSON? |
| Some entries missing | Does every listed file return 200? |
| Skill loads stale content | Bump `version` in `index.json` |
| 403 / CORS errors | Serve from the same origin as the catalog base URL; allow GET |
| Wrong content loads | Same ID defined in a higher-precedence local folder |

---

## Check yourself

1. What file must a catalog serve at its base URL?
2. You edited a skill's `SKILL.md` in your catalog and the change never shows up. Why?
3. Name one reason to prefer a local install over a catalog for a security-sensitive repo.

<details>
<summary>Answers</summary>

1. `index.json` listing each skill's name, version, and files.
2. `version` in `index.json` was not incremented, so OpenCode reused its cache.
3. The content is visible in a code review and pinned in git, so what the agent runs is auditable and reproducible.
</details>

---

**Next:** [08 · Skills vs. agents vs. commands →](08-skills-vs-agents-vs-commands.md)
