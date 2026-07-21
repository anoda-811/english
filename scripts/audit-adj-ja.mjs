/** Audit ja glosses; run: node scripts/audit-adj-ja.mjs */
import { DETAILS } from "./adj-details.mjs";
import { WORDS300 } from "./words300.mjs";

const issues = [];
for (const en of WORDS300) {
  const d = DETAILS[en];
  if (!d) issues.push([en, "MISSING"]);
  else if (!d.ja || d.ja.includes("?")) issues.push([en, d.ja]);
  else if (/[A-Za-z]/.test(d.ja)) issues.push([en, "LATIN", d.ja]);
}

const jaCount = new Map();
for (const en of WORDS300) {
  const ja = DETAILS[en]?.ja;
  if (!jaCount.has(ja)) jaCount.set(ja, []);
  jaCount.get(ja).push(en);
}
const dupes = [...jaCount.entries()].filter(([, ens]) => ens.length > 1);

console.log("issues", issues.length, issues.slice(0, 20));
console.log(
  "duplicate ja",
  dupes.length,
  dupes.filter(([, e]) => e.length > 2).slice(0, 15),
);
