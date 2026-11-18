# 10 · Glossary

> **Prev:** [09 · Troubleshooting](09-troubleshooting.md) · **Home:** [README](../README.md)

Terms used throughout this repo, in the order you are likely to meet them.

---

**Agent** — A role with its own system prompt, model, tools, and permissions. You select an agent; a skill is loaded in addition to it. See [08](08-skills-vs-agents-vs-commands.md).

**Advertise** — Showing the model the list of skill IDs, names, and descriptions at each step. No body text is included. Skills without a description are not advertised.

**Base directory** — The folder containing `SKILL.md`. Relative paths inside the skill resolve here, and the model receives it plus a sample of up to ten supporting file paths when the skill loads.

**Catalog (HTTP)** — A base URL serving `index.json`, listing skills, versions, and files. Added to the `skills` array in `opencode.json`. OpenCode 2 only. See [07](07-load-from-url.md).

**Command** — A saved prompt you invoke by name. The model cannot trigger it on its own.

**Compatibility sources** — Locations used by other agents that OpenCode also reads: `~/.claude/skills/`, `~/.agents/skills/`, and their project equivalents.

**`description`** — The frontmatter field that decides when a skill is offered to the model. The single highest-leverage line in a skill.

**Directory form** — A skill stored as `skills/<id>/SKILL.md`. Recommended, because supporting files sit beside the entry file.

**Discovery** — The scan OpenCode performs when a session starts, walking the known source folders.

**Flat form** — A skill stored as a root-level `skills/<id>.md` file. Valid, but it cannot ship supporting files as cleanly.

**Frontmatter** — The YAML block between `---` lines at the top of `SKILL.md`. `name`, `description`, `metadata`, and `disable-model-invocation` are interpreted.

**Global scope** — `~/.config/opencode/skills/`. Available in every project on your machine.

**ID** — The identifier used to load a skill, derived from its path. Case-sensitive. `skills/git-release/SKILL.md` → `git-release`.

**`index.json`** — The manifest at a catalog's base URL. Lists `name`, `version`, and `files` per skill. Bump `version` to bust the cache.

**kebab-case** — `lowercase-words-with-hyphens`. The recommended ID shape: `^[a-z0-9]+(-[a-z0-9]+)*$`.

**Load** — Actually pulling a skill's Markdown body into the conversation. Happens on a description match or an explicit `@id`.

**`metadata.opencode/autoinvoke`** — Set to `false` to hide a skill from automatic discovery while keeping `@id` loading available.

**`disable-model-invocation`** — Portability alias for the same behavior. If both are set, `opencode/autoinvoke` wins.

**MCP server** — External tools and data exposed over a protocol. Different from a skill; skills teach procedure, MCP supplies capability.

**`opencode.json` / `opencode.jsonc`** — Configuration file. Its `skills` array adds local folders or HTTP catalogs and has the highest precedence.

**Plugin** — Code that extends OpenCode itself. Unlike a skill, it executes.

**Precedence** — The order sources are consulted when two define the same ID. Later wins: built-ins → `.claude/` → `.agents/` → `~/.config/opencode/` → `.opencode/` → explicit `skills` entries.

**Project scope** — `.opencode/skills/` at the repository root (or in a subdirectory). Shared with everyone who clones the repo.

**Reference file** — Material beside `SKILL.md` in `references/`, read only when the body instructs the agent to open it.

**Shadowing** — When a higher-precedence source supplies a different skill under the same ID, hiding the lower one.

**Skill** — A folder with `SKILL.md` teaching a repeatable workflow, loaded on demand.

**Skill tool** — The tool the model calls with a skill ID to load that skill's body.

**Source root** — A folder OpenCode scans for skills, such as `.opencode/skills/`, a path in the `skills` array, or a downloaded catalog entry.

**Supporting file** — Any file beside `SKILL.md` (scripts, references, templates). Not loaded automatically.

**Trigger** — A user request whose wording matches a skill's `description`, causing the model to load it.

**`@skill-id`** — Explicit invocation in a prompt. Skips description matching.

---

**Home:** [README](../README.md) · **Cheatsheet:** [CHEATSHEET.md](../CHEATSHEET.md)
