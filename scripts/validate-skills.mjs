#!/usr/bin/env node
/**
 * Validate every skill in this repo, plus every relative Markdown link.
 *
 *   node scripts/validate-skills.mjs
 *   node scripts/validate-skills.mjs path/to/skills
 *
 * Zero dependencies. Exits 1 on any error, 0 on warnings only.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const SKIP_DIRS = new Set(["node_modules", ".git", ".github", "labs"]);
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SUPPORT_DIRS = ["references", "scripts", "assets", "templates"];

const errors = [];
const warnings = [];
const skills = [];

const rel = (p) => relative(ROOT, p).split(sep).join("/") || ".";
const err = (file, message) => errors.push(`${rel(file)}: ${message}`);
const warn = (file, message) => warnings.push(`${rel(file)}: ${message}`);

/** Minimal frontmatter reader: top-level `key: value` pairs only. */
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(3, end);
  const fields = {};
  for (const line of block.split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_./-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields[match[1]] = value;
  }
  return { fields, body: text.slice(end + 4) };
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

async function checkSkill(file) {
  const text = await readFile(file, "utf8");
  const skillDir = dirname(file);
  const parsed = parseFrontmatter(text);

  if (!parsed) {
    err(file, "missing frontmatter (start the file with a `---` block)");
    return;
  }

  const { fields, body } = parsed;

  if (!fields.name) err(file, "frontmatter is missing `name`");
  if (!fields.description) {
    err(file, "frontmatter is missing `description` — the model will never discover this skill");
  } else {
    if (fields.description.length > 240) {
      warn(file, `description is ${fields.description.length} chars; keep it under ~200`);
    }
    if (!/^use (when|only when|this|for)\b/i.test(fields.description)) {
      warn(file, 'description should start with "Use when …" so the trigger is explicit');
    }
  }

  const dirName = file.endsWith(`${sep}SKILL.md`) ? skillDir.split(sep).pop() : null;
  if (dirName === null) {
    warn(file, "flat Markdown skill — fine, but the directory form supports references/ and scripts/");
  } else if (!ID_PATTERN.test(dirName)) {
    warn(file, `folder id "${dirName}" is not lowercase kebab-case`);
  }

  if (body.trim().length < 40) err(file, "body is empty or too short to be useful");
  if (/(^|\s)(TODO|TBD|FIXME)(\s|$)/.test(body)) warn(file, "body still contains a TODO/TBD marker");

  if (/\]\((?:[A-Za-z]:[\\/]|\/|~\/)/.test(body)) {
    err(file, "absolute path in a Markdown link — use a path relative to the skill folder");
  }

  const referenced = new Set(
    [...body.matchAll(/\b((?:references|scripts|assets|templates)\/[A-Za-z0-9._\-/]+)/g)].map(
      (m) => m[1].replace(/[.,;:)]+$/, ""),
    ),
  );
  for (const ref of referenced) {
    if (!existsSync(join(skillDir, ref))) {
      err(file, `references missing file \`${ref}\``);
    }
  }

  skills.push({ id: dirName ?? file.split(sep).pop().replace(/\.md$/, ""), file, dirName });
}

async function checkMarkdownLinks(files) {
  for (const file of files) {
    const text = await readFile(file, "utf8");
    const dir = dirname(file);
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      const clean = decodeURI(target.split("#")[0]);
      if (!clean) continue;
      if (!existsSync(resolve(dir, clean))) {
        err(file, `broken relative link \`${target}\``);
      }
    }
  }
}

async function main() {
  const rootStat = await stat(ROOT).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    console.error(`Not a directory: ${process.argv[2]}`);
    process.exit(1);
  }

  const files = await walk(ROOT);
  const skillFiles = files.filter((f) => f.endsWith(`${sep}SKILL.md`) || /skills[/\\][^/\\]+\.md$/.test(f));

  if (skillFiles.length === 0) {
    console.error("No SKILL.md files found. Point the script at a folder that contains skills.");
    process.exit(1);
  }

  for (const file of skillFiles) await checkSkill(file);
  await checkMarkdownLinks(files);

  const seen = new Map();
  for (const skill of skills) {
    const key = skill.id.toLowerCase();
    if (seen.has(key)) {
      warn(
        skill.file,
        `id "${skill.id}" is also defined at ${rel(seen.get(key))} — the later source wins`,
      );
    } else {
      seen.set(key, skill.file);
    }
  }

  const mark = (ok) => (ok ? "✓" : "✗");
  console.log("");
  console.log(`Skills found: ${skills.length}`);
  for (const { file, id } of skills) console.log(`  ✓ ${id.padEnd(26)} ${rel(file)}`);

  if (warnings.length) {
    console.log("\nWarnings");
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  if (errors.length) {
    console.log("\nErrors");
    for (const e of errors) console.log(`  ✗ ${e}`);
  }

  console.log("");
  console.log(`${mark(errors.length === 0)} ${errors.length} error(s), ${warnings.length} warning(s)`);
  console.log("");
  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
