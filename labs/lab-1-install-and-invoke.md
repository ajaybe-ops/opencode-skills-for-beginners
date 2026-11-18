# Lab 1 · Install and invoke

**Goal:** prove that discovery works before you write anything of your own.
**Time:** 10 minutes.

## Setup

```bash
mkdir -p ~/skill-lab && cd ~/skill-lab
mkdir -p .opencode/skills/hello-skill
```

```powershell
New-Item -ItemType Directory -Force "$HOME\skill-lab\.opencode\skills\hello-skill"
Set-Location "$HOME\skill-lab"
```

Copy [`../examples/hello-skill/SKILL.md`](../examples/hello-skill/SKILL.md) into that folder.

## Tasks

1. Start a new OpenCode session in `~/skill-lab`.
2. Ask, without using `@`:

   ```text
   Can you demo how skills work for me?
   ```

3. Note whether `hello-skill` loaded on its own.
4. Now force it:

   ```text
   @hello-skill show me what you do
   ```

5. Ask for its path:

   ```text
   Which directory did you load hello-skill from? Give me the absolute path.
   ```

## Success criteria

- [ ] The forced invocation loads the skill
- [ ] The reported path is `~/skill-lab/.opencode/skills/hello-skill`
- [ ] The reply stays under 60 words (the skill's own rule)
- [ ] No files were created

## Observe and record

- Did step 2 trigger it automatically? If not, why not? Compare the prompt's wording to the skill's `description`.
- Change the description to `description: Use when the user asks anything at all` and repeat step 2. What happens? Revert it.
- What happens if you delete `description` entirely and repeat step 2? Repeat step 4?

## Cleanup

Leave the folder. Lab 3 reuses this habit of starting from a known-good state.
