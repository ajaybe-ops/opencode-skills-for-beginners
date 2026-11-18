# Solutions

Read only after attempting the lab.

---

## Lab 1

**Auto-trigger behavior.** "Can you demo how skills work for me?" is a plausible match — the description includes "a demo of how skills work" — so it may load on its own. Whether it does on the first try is less important than what you learned: the description is what did the matching.

**Overbroad description.** Changing it to `Use when the user asks anything at all` makes the skill fire on nearly every request, including unrelated ones. That is the failure mode behind "why does my agent keep doing X?" — the description is too greedy.

**Deleting `description`.** Auto-invocation stops completely; the skill is no longer advertised. `@hello-skill` still works, because explicit loading does not need a description. That is the cleanest demonstration of advertise-vs-load in the whole repo.

---

## Lab 2

There is no single right skill, so grade against behavior, not prose:

| Criterion | What "good" looks like |
| --- | --- |
| Trigger | Prompt 2 loads it without `@` |
| Precision | It does **not** fire on "write a commit message" |
| Workflow | Numbered, each step checkable |
| Stop condition | Empty input produces a refusal, not invented content |
| Side effects | Destructive request produces a question, not an action |
| Reference | The file exists, and the body says **when** to read it |

Two common near-misses:

1. **Rule bloat.** Ten rules that all say "be careful" teach nothing. Two hard constraints beat ten soft ones.
2. **Reference without instruction.** Adding `references/style.md` without a line like *"Read `references/style.md` before choosing headings"* means the model may never open it — supporting files are not loaded automatically.

---

## Lab 3

The fixture has **six** defects. Five are real; one is intentional ambiguity.

### 1. Wrong filename — blocker

```text
labs/fixtures/broken-skill/skill.md      ❌
labs/fixtures/broken-skill/SKILL.md      ✅
```

Discovery only accepts a root-level `*.md` or a file named exactly `SKILL.md`. On Linux and macOS the case mismatch is fatal. This is why `@xlsx` does nothing at all: the skill was never registered.

Running the validator makes it obvious:

```text
No SKILL.md files found. Point the script at a folder that contains skills.
```

### 2. Missing `description` — blocker for auto-discovery

```yaml
---
name: Excel Helper
---
```

Even after the rename, the skill loads only via `@xlsx`. The model never sees it in the available list. Fix:

```yaml
description: Use when creating, editing, or analyzing .xlsx spreadsheets, formulas, or pivot tables
```

### 3. Dangling reference — error

The body says *"follow `references/formulas.md`"*, but that file does not exist. The validator catches it:

```text
references missing file `references/formulas.md`
```

Either create the file or remove the line. A dangling reference is worse than none: the model will either hallucinate the file's contents or stall.

### 4. Folder/ID mismatch — warning

The lab copies the fixture to `xlsx`, so the ID becomes `xlsx` while the frontmatter `name` is `Excel Helper`. That is legal, but confusing — the `name` is a label, the path is the identity. Best practice: folder, ID, and a lowercase-kebab `name` line up.

### 5. Useless body — quality defect

```markdown
1. Ask the user what they want to do.
2. Open the file.
```

No inputs, no rules, no output format. This skill cannot produce a consistent result. The fixed version needs a workflow with real steps and an explicit output shape.

### 6. Missing scope guidance — the ambiguous one

Nothing says when **not** to use it. A reader cannot tell whether this skill covers CSVs, Google Sheets, or Excel macros. Add a boundary:

```markdown
## When not to use
- CSV-only work (no formulas or formatting)
- Google Sheets
```

## The fixed version

```markdown
---
name: xlsx
description: Use when creating, editing, or analyzing .xlsx spreadsheets, formulas, or pivot tables
---

# xlsx

## When to use
The user wants to create, edit, or analyze an Excel workbook.

## When not to use
CSV-only work, Google Sheets, or macro/VBA projects.

## Inputs
- The workbook path, or the data to write
- The sheet name, if the user named one

## Workflow
1. Confirm the file exists before editing. If it does not, ask whether to create it.
2. Read the sheet names and headers before changing anything.
3. When writing formulas, read `references/formulas.md` first.
4. Save to a new file if the original is the only copy.
5. Report which sheet and range changed.

## Rules
- Never overwrite the only copy without asking.
- Never invent a sheet name the user did not mention.
- If the file is not a valid .xlsx, stop and report it.

## Output format
One line: `Updated <sheet>!<range> in <file>.`
```

Validate it:

```bash
node scripts/validate-skills.mjs path/to/xlsx
# ✓ 0 error(s), 0 warning(s)
```

## Bug report format

```text
Path:    ~/skill-lab-3/.opencode/skills/xlsx/skill.md
Symptom: @xlsx does nothing; no skill listed in session
Cause:   Filename is `skill.md`; discovery requires exactly `SKILL.md`
Follow-up: missing `description` would have blocked auto-invocation next
```

That is the whole discipline: **path, symptom, cause, next defect**. It turns "it doesn't work" into something a teammate can act on.
