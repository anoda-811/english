/**
 * Writes data/vocabulary/adjectives.json with ASCII-only JSON (\\u escapes for Japanese).
 * Source data: adj-details.mjs + words300.mjs word order.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DETAILS } from "./adj-details.mjs";
import { WORDS300 as words } from "./words300.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @param {unknown} value */
function toAsciiJson(value) {
  return JSON.stringify(value, null, 2).replace(
    /[\u0080-\uffff]/g,
    (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}

const levelSizes = { 1: 100, 2: 100, 3: 100 };
/** @type {object[]} */
const out = [];
let offset = 0;
for (const [level, size] of Object.entries(levelSizes)) {
  for (let i = 0; i < size; i++) {
    const en = words[offset++];
    const d = DETAILS[en];
    if (!d) throw new Error(`Missing details for "${en}" at a${level}-${i + 1}`);
    out.push({
      id: `a${level}-${i + 1}`,
      en,
      ja: d.ja,
      pos: "adjective",
      level: String(level),
      exampleEn: d.exampleEn,
      exampleJa: d.exampleJa,
    });
  }
}

if (out.length !== 300) throw new Error(`Expected 300 words, got ${out.length}`);
const ens = new Set(out.map((w) => w.en));
if (ens.size !== 300) throw new Error("Duplicate en values");

writeFileSync(
  join(__dirname, "..", "data", "vocabulary", "adjectives.json"),
  toAsciiJson({ words: out }) + "\n",
  "utf8",
);

console.log("Wrote adjectives.json:", out.length, "words");
