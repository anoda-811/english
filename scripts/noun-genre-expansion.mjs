/**
 * Expands data/vocabulary/nouns.json with common nouns for thin genres.
 * Run: node scripts/noun-genre-expansion.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXPANSION_BY_GENRE } from "./noun-genre-expansion-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nounsPath = join(__dirname, "..", "data", "vocabulary", "nouns.json");

function countGenres(words) {
  const counts = {};
  for (const w of words) {
    for (const g of w.genres ?? []) {
      counts[g] = (counts[g] ?? 0) + 1;
    }
  }
  return counts;
}

const data = JSON.parse(readFileSync(nounsPath, "utf8"));
const existing = new Set(data.words.map((w) => w.en.toLowerCase()));
const beforeTotal = data.words.length;
const beforeGenres = countGenres(data.words);

const counters = {};
const newWords = [];
const skipped = [];

for (const [abbrev, entries] of Object.entries(EXPANSION_BY_GENRE)) {
  counters[abbrev] = 0;
  for (const entry of entries) {
    const [en, ja, level, genres, exampleEn, exampleJa] = entry;
    const key = en.toLowerCase();
    if (existing.has(key)) {
      skipped.push(en);
      continue;
    }
    existing.add(key);
    counters[abbrev] += 1;
    newWords.push({
      id: `ng-${abbrev}-${counters[abbrev]}`,
      en,
      ja,
      pos: "noun",
      level,
      genres,
      exampleEn,
      exampleJa,
    });
  }
}

data.words.push(...newWords);
writeFileSync(nounsPath, JSON.stringify(data, null, 2) + "\n", "utf8");

const afterGenres = countGenres(data.words);

console.log("=== Noun genre expansion ===");
console.log("Before total:", beforeTotal);
console.log("Added:", newWords.length);
console.log("Skipped (duplicate en):", skipped.length);
console.log("After total:", data.words.length);
console.log("\nPer-genre BEFORE:", beforeGenres);
console.log("\nPer-genre AFTER:", afterGenres);
console.log("\nPer-genre DELTA:");
for (const g of new Set([...Object.keys(beforeGenres), ...Object.keys(afterGenres)])) {
  const delta = (afterGenres[g] ?? 0) - (beforeGenres[g] ?? 0);
  if (delta !== 0) console.log(`  ${g}: +${delta} (${beforeGenres[g] ?? 0} → ${afterGenres[g] ?? 0})`);
}
if (skipped.length) console.log("\nSkipped words:", skipped.join(", "));
