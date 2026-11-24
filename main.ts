// Two-Sentence Horror — make.fun entry
// Writes one horror story of exactly two sentences (<= 400 chars)
// to $MAKEFUN_OUTPUT_DIR/entry.txt (default: out/entry.txt).
// Node stdlib only, no network.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORY =
  "The census form asked how many people live in my house. I wrote one, and it came back corrected to two.";

function sentenceCount(text: string): number {
  const parts = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 0);
  return parts.length;
}

// Pre-write gate: the kit's gate requires 1-400 UTF-8 characters, not
// only whitespace; the judge requires exactly two sentences.
if (STORY.length < 1 || STORY.length > 400) {
  throw new Error(`entry length ${STORY.length} outside gate 1-400`);
}
if (STORY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (sentenceCount(STORY) !== 2) {
  throw new Error(`entry has ${sentenceCount(STORY)} sentences, expected 2`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, STORY, "utf8"); // no trailing newline

// Read-back verification: the file must be byte-identical to the story,
// with no trailing newline and the same character count.
import { readFileSync } from "node:fs";
const written = readFileSync(outPath, "utf8");
if (written !== STORY) {
  throw new Error("read-back mismatch: entry.txt differs from STORY");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt has a trailing newline");
}
console.log(`entry ok: ${STORY.length} chars, 2 sentences -> ${outPath}`);
