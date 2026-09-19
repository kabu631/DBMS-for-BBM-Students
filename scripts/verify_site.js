/**
 * verify_site.js — a build-free sanity check for the static site.
 *
 * Run:  node scripts/verify_site.js
 *
 * It loads syllabus-data.js and every js/data/*.js file in the exact order
 * index.html loads them, then reports:
 *   - units, topic counts and which extras each unit has
 *   - any <img src="..."> in the content that points at a file that is missing
 *   - unbalanced HTML tags in topic content (a quick smoke test)
 *   - any script/stylesheet referenced by index.html that does not exist
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// ---- 1. Check every asset index.html references actually exists -----------
const refs = [...indexHtml.matchAll(/(?:src|href)="((?!https?:|data:|#)[^"]+)"/g)].map(m => m[1]);
const missingRefs = refs.filter(r => !fs.existsSync(path.join(ROOT, r)));

// ---- 2. Load the data files in index.html order --------------------------
const scriptOrder = [...indexHtml.matchAll(/<script src="((?:js|css)\/[^"]+)"><\/script>/g)]
  .map(m => m[1])
  .filter(p => p !== "js/sql-playground.js" && p !== "js/app.js");

const sandbox = { console };
let combined = "";
for (const rel of scriptOrder) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.log(`  (skipping missing ${rel})`);
    continue;
  }
  combined += `\n/* ===== ${rel} ===== */\n` + fs.readFileSync(abs, "utf8");
}

let SYLLABUS_DATA, GLOSSARY;
try {
  const result = new Function(combined + "\n;return {SYLLABUS_DATA, GLOSSARY: typeof GLOSSARY!=='undefined'?GLOSSARY:[]};")();
  SYLLABUS_DATA = result.SYLLABUS_DATA;
  GLOSSARY = result.GLOSSARY;
} catch (err) {
  console.error("\n❌ Data files failed to evaluate:\n", err.message);
  process.exit(1);
}

// ---- 3. Report -----------------------------------------------------------
console.log("\n=== UNITS ===");
let totalTopics = 0;
let totalQuiz = 0;
let totalQa = 0;

for (const u of SYLLABUS_DATA.units) {
  const topics = u.topics || [];
  totalTopics += topics.length;
  const quizN = (u.quiz || []).length;
  const qaN = ((u.examCorner || {}).questions || []).length;
  totalQuiz += quizN;
  totalQa += qaN;
  console.log(
    `${u.id.padEnd(8)} ${String(topics.length).padStart(2)} topics | ` +
    `intro:${u.simpleIntro ? "Y" : "-"} examCorner:${qaN ? String(qaN).padStart(2) + "Q" : " - "} quiz:${quizN ? String(quizN).padStart(2) : " -"} | ${u.title}`
  );
  for (const t of topics) console.log(`         · ${t.title}`);
}

// ---- 4. Image reference check -------------------------------------------
console.log("\n=== IMAGES ===");
const missingImages = new Set();
let imgCount = 0;
for (const u of SYLLABUS_DATA.units) {
  for (const t of u.topics || []) {
    for (const m of (t.content || "").matchAll(/<img[^>]+src="([^"]+)"/g)) {
      imgCount++;
      if (!/^https?:/.test(m[1]) && !fs.existsSync(path.join(ROOT, m[1]))) {
        missingImages.add(`${u.id}/${t.id}: ${m[1]}`);
      }
    }
  }
}
console.log(`${imgCount} <img> references, ${missingImages.size} missing.`);
missingImages.forEach(m => console.log("  ❌ " + m));

// ---- 5. Crude tag-balance smoke test ------------------------------------
console.log("\n=== HTML BALANCE ===");
const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "path", "line", "circle", "ellipse", "rect", "polygon", "polyline", "use", "stop", "source"]);
let imbalanced = 0;
for (const u of SYLLABUS_DATA.units) {
  for (const t of u.topics || []) {
    const counts = {};
    for (const m of (t.content || "").matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)[^>]*?(\/?)>/g)) {
      const [, closing, tag, selfClose] = m;
      const name = tag.toLowerCase();
      if (VOID.has(name) || selfClose === "/") continue;
      counts[name] = (counts[name] || 0) + (closing ? -1 : 1);
    }
    const bad = Object.entries(counts).filter(([, n]) => n !== 0);
    if (bad.length) {
      imbalanced++;
      console.log(`  ⚠ ${u.id}/${t.id}: ${bad.map(([k, n]) => `${k}:${n > 0 ? "+" : ""}${n}`).join(", ")}`);
    }
  }
}
if (!imbalanced) console.log("All topic content has balanced tags.");

// ---- 6. Summary ----------------------------------------------------------
console.log("\n=== index.html ASSET REFERENCES ===");
if (missingRefs.length) {
  missingRefs.forEach(r => console.log("  ❌ missing: " + r));
} else {
  console.log("All referenced files exist.");
}

console.log("\n=== TOTALS ===");
console.log(`Units:            ${SYLLABUS_DATA.units.length}`);
console.log(`Topics:           ${totalTopics}`);
console.log(`Exam Q&A:         ${totalQa}`);
console.log(`Quiz questions:   ${totalQuiz}`);
console.log(`Glossary terms:   ${GLOSSARY.length}`);
console.log(`Sample queries:   ${(SYLLABUS_DATA.sampleQueries || []).length}`);
console.log(`Reference guides: ${(SYLLABUS_DATA.w3ReferenceGuides || []).length}`);

const failed = missingImages.size || imbalanced || missingRefs.length;
console.log(failed ? "\n⚠ Issues found (see above)." : "\n✅ All checks passed.");
