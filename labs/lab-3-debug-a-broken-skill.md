# Lab 3 · Debug a broken skill

**Goal:** diagnose a skill that will not load, using the six-cause checklist instead of trial and error.
**Time:** 15 minutes.

## Setup

The broken fixture lives in [`fixtures/broken-skill/`](fixtures/broken-skill/). Read it first, **without** opening the solution.

```bash
mkdir -p ~/skill-lab-3
cp -r fixtures/broken-skill ~/skill-lab-3/.opencode/skills/xlsx
```

```powershell
New-Item -ItemType Directory -Force "$HOME\skill-lab-3\.opencode\skills"
Copy-Item -Recurse fixtures\broken-skill "$HOME\skill-lab-3\.opencode\skills\xlsx"
```

## Tasks

1. List **every** reason this skill will fail, before running it.
2. Run `node ../scripts/validate-skills.mjs` on it and compare the validator's findings to yours.

   ```bash
   # from the repo root
   node scripts/validate-skills.mjs labs/fixtures/broken-skill
   ```

3. Start a session in `~/skill-lab-3` and try `@xlsx`.
4. Fix the skill, one defect at a time. After each fix, start a new session and retest. Record which fix changed the outcome.
5. Write a three-line bug report as if filing it: path, symptom, cause.

## Success criteria

- [ ] You found at least four distinct defects
- [ ] You can name which defect prevented `@xlsx` from loading at all
- [ ] You can name which defect prevented auto-discovery after the file was found
- [ ] The fixed skill passes the validator with 0 errors

## Hint ladder

Only read downward if you are stuck.

<details>
<summary>Hint 1</summary>
Two of the six causes are the same cause here. Look at the filename and the folder depth together.
</details>

<details>
<summary>Hint 2</summary>
A reference is mentioned in the body that does not exist. Fixing the reference is not the same as fixing discovery — which one is a blocker?
</details>

<details>
<summary>Hint 3</summary>
Even after the file is discovered, the model may never choose it. What single line decides that?
</details>

Solution: [solutions.md](solutions.md).
