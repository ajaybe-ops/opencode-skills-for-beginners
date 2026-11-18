# Conventional Commits — quick reference

Source of truth: <https://www.conventionalcommits.org/>

## Format

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | a new user-visible capability | `feat(search): add fuzzy matching` |
| `fix` | a bug fix | `fix(auth): reject expired refresh tokens` |
| `docs` | documentation only | `docs(readme): document the skill install flow` |
| `refactor` | code change with no behavior change | `refactor(parser): extract token scanner` |
| `test` | tests only | `test(api): cover empty-payload 400s` |
| `chore` | maintenance, deps, build config | `chore(deps): bump zod to 4.1.2` |
| `perf` | measurable performance improvement | `perf(query): add covering index for tenant lookups` |
| `build` | build system or packaging | `build(docker): drop dev deps from runtime image` |
| `ci` | CI configuration | `ci: cache pnpm store between jobs` |
| `style` | formatting only, no logic | `style: apply prettier to src/ui` |
| `revert` | reverts a previous commit | `revert: feat(search): add fuzzy matching` |

## Scope

Use the **module, package, or directory** the change touches. One word, lowercase.

```text
feat(checkout): …
fix(upload): …
docs(skills): …
```

Omit the scope when the change spans the whole repo or the type is self-explanatory:

```text
ci: pin Node to 22
```

## Subject line

- Imperative mood — it completes "This commit will…"
- No trailing period
- 72 characters maximum, ideally under 50
- Lowercase after the colon

| ❌ | ✅ |
| --- | --- |
| `Fixed bug` | `fix(parser): handle empty input` |
| `feat: Adds new thing.` | `feat(ui): add dark mode toggle` |
| `update stuff` | `chore(deps): bump esbuild to 0.25.1` |

## Body

Explain **why**, not what — the diff already shows what. Wrap at 72 columns.

```text
fix(auth): reject expired refresh tokens

Tokens issued before the clock-skew fix could pass validation for
up to five minutes past expiry. Rejecting on `exp` closes the gap.
```

## Footers

```text
Refs: PROJ-142
BREAKING CHANGE: `search()` now returns a cursor instead of an offset.
Co-authored-by: Name <email>
```

A `!` after the type or scope also marks a breaking change:

```text
feat(api)!: require auth on /v2/search
```

## Splitting a messy diff

Ask: could any part ship on its own and still leave the repo working? If yes, it is its own commit.

```text
❌ feat(api): add endpoint, fix typo, bump deps, reformat tests
✅ feat(api): add /v2/search endpoint
✅ fix(docs): correct install typo
✅ chore(deps): bump zod to 4.1.2
✅ style(tests): apply prettier to test folder
```
