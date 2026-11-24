import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "fix: deleted the thing that was deleting the other thing, turns out the two things were the same thing, restoring from backup now, please stop refreshing the dashboard";

function main(): void {
  // Runtime guards: sealed gate is 1-200 UTF-8 chars, single line, not only whitespace.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry length ${chars} chars outside sealed gate 1-200`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // Commit-message shape guard: a real "fix:" subject with the admission in it.
  if (!ENTRY.startsWith("fix: ")) {
    throw new Error("entry must open with a real commit subject prefix");
  }
  // Judge-brief guard: a 3 AM agent admission must name what it did AND what it is
  // doing about it (the fix), and end on a status plea only a model would write.
  if (!ENTRY.includes("restoring from backup")) {
    throw new Error("entry must state the fix it is attempting");
  }
  if (!ENTRY.includes("please stop refreshing")) {
    throw new Error("entry must close with the agent's status plea");
  }
  // Freshness guard: never ship a stock oops / "please work" line.
  const banned = ["oops", "please work", "it works on my machine", "I completed a different task"];
  for (const phrase of banned) {
    if (ENTRY.toLowerCase().includes(phrase)) {
      throw new Error(`entry contains banned stock phrase: ${phrase}`);
    }
  }
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Round-trip check: what was written must read back byte-identical.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("round-trip check failed: entry.txt differs from ENTRY");
  }
  console.log(`entry ok: ${chars} chars, 1 line`);
}

main();
