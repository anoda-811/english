import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JA_PART2A, JA_PART2B } from "./l58-ja-part2-chunks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const en = readFileSync(join(__dirname, "l58-en.txt"), "utf8")
  .trim()
  .split(/\r?\n/);
const ja1 = readFileSync(join(__dirname, "l58-ja-part1.txt"), "utf8")
  .trim()
  .split(/\r?\n/);
const ja = [...ja1, ...JA_PART2A, ...JA_PART2B];

if (en.length !== 400 || ja.length !== 400) {
  throw new Error(`Expected 400 pairs, got en=${en.length} ja=${ja.length}`);
}
if (new Set(en).size !== 400) {
  throw new Error("English examples must be unique");
}
if (en.some((s) => /^This is /i.test(s))) {
  throw new Error('"This is" pattern found in English examples');
}

const nounsPath = join(root, "data", "vocabulary", "nouns.json");
const data = JSON.parse(readFileSync(nounsPath, "utf8"));
const targets = data.words.filter((w) => ["5", "6", "7", "8"].includes(w.level));
if (targets.length !== 400) {
  throw new Error(`Expected 400 L5-8 words, got ${targets.length}`);
}

for (let i = 0; i < targets.length; i++) {
  targets[i].exampleEn = en[i];
  targets[i].exampleJa = ja[i];
}

writeFileSync(nounsPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Patched", targets.length, "noun examples (levels 5-8).");
