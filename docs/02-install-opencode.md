# 02 · Install OpenCode

> **Time:** 5 minutes · **Prev:** [01 · What is a skill?](01-what-is-a-skill.md) · **Next:** [03 · Install a skill](03-install-a-skill.md)

Skip this page if `opencode --version` already prints a version.

## Pick your platform

### macOS / Linux

Any one of these works. The curl script is the shortest path:

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

```bash
# Homebrew (installs OpenCode 2)
brew install anomalyco/tap/opencode-v2

# npm (the package is @opencode/cli, not opencode-ai)
npm install -g @opencode/cli

# Bun
bun install -g --trust @opencode/cli

# pnpm
pnpm add -g --allow-build=@opencode/cli @opencode/cli
```

> [!NOTE]
> The npm package runs a postinstall step to pick the native binary for your platform. Bun and pnpm need an explicit trust/allow flag; npm does not.

### Windows

**Windows package managers are not supported.** Use one of:

1. **Desktop app** — download and run `opencode-desktop-win-x64.exe` from the [official install page](https://opencode.ai/docs/).
2. **Standalone CLI** — download `opencode-windows-x64.zip`, unzip it somewhere permanent (for example `%LOCALAPPDATA%\Programs\opencode`), and add that folder to your `PATH`.

Verify in PowerShell:

```powershell
opencode --version
```

If PowerShell cannot find the command, reopen the terminal after editing `PATH`.

### Other routes

| Route | Command / link |
| --- | --- |
| AUR (Arch) | `paru -S opencode-beta` |
| mise | `mise use -g opencode` (mise 2026.10.9+; older versions install OpenCode 1) |
| Docker | `ghcr.io/anomalyco/opencode:2.0.0` |
| Web UI | `opencode pair` — prints a one-time link |
| Desktop | Builds for macOS, Windows, Linux — [docs](https://opencode.ai/docs/) |

## Connect a model

OpenCode does not ship with credentials. In the TUI:

```text
/connect
```

Pick a provider and complete the login flow. Then start a session in a test folder and send `hello` to confirm you get a response.

## Confirm you have OpenCode 2

Skills catalogs loaded from a URL are an **OpenCode 2** feature. Check:

```bash
opencode --version
```

If you are on version 1, either upgrade, or use the local-folder install path in [03 · Install a skill](03-install-a-skill.md) — folder-based skills work on both.

## Where things live

| Thing | macOS / Linux | Windows |
| --- | --- | --- |
| Global config | `~/.config/opencode/opencode.json` | `C:\Users\<you>\.config\opencode\opencode.json` |
| Global skills | `~/.config/opencode/skills/` | `C:\Users\<you>\.config\opencode\skills\` |
| Project skills | `.opencode/skills/` | `.opencode\skills\` |

Create the global skills folder once and forget it:

```bash
mkdir -p ~/.config/opencode/skills
```

```powershell
New-Item -ItemType Directory -Force "$HOME\.config\opencode\skills"
```

---

## Check yourself

1. What is the npm package name for the CLI?
2. Why might `opencode --version` fail immediately after you edit `PATH` on Windows?

<details>
<summary>Answers</summary>

1. `@opencode/cli`.
2. The running terminal inherited the old `PATH`. Open a new terminal.
</details>

---

**Next:** [03 · Install a skill →](03-install-a-skill.md)
