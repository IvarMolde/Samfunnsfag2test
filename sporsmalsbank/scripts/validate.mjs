// Kontrollerer questions.xml. Feil stopper bygget (exit 1). Advarsler vises, men stopper ikke.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DOMParser } from "@xmldom/xmldom";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const file = process.argv[2] || path.join(root, "questions.xml");
const PER_CATEGORY = 80;
const errors = [], warnings = [];
const err = (id, m) => errors.push(`${id}: ${m}`);
const warn = (id, m) => warnings.push(`${id}: ${m}`);

const xml = fs.readFileSync(file, "utf8");
const doc = new DOMParser({ errorHandler: { warning() {}, error: m => errors.push("XML: " + m), fatalError: m => errors.push("XML: " + m) } })
  .parseFromString(xml, "application/xml");
const list = l => Array.from({ length: l.length }, (_, i) => l[i]);
const kids = (el, tag) => list(el.childNodes).filter(n => n.nodeName === tag);
const text = el => (el ? el.textContent.trim() : "");

const qs = list(doc.getElementsByTagName("question"));
const ids = new Set(), stems = new Map(), cats = new Map(), topicsByCat = new Map(), mains = new Map();
let aLongest = 0, ratioHits = 0;

for (const q of qs) {
  const id = q.getAttribute("id") || "(uten id)";
  if (!q.getAttribute("id")) err(id, "mangler id");
  if (ids.has(id)) err(id, "id er ikke unik");
  ids.add(id);
  const cat = q.getAttribute("category");
  if (!cat) err(id, "mangler category");
  if (!q.getAttribute("main")) err(id, "mangler main (hovedkategori)");
  mains.set(cat, q.getAttribute("main"));
  cats.set(cat, (cats.get(cat) || 0) + 1);
  const topic = q.getAttribute("topic") || "";
  if (!topicsByCat.has(cat)) topicsByCat.set(cat, new Map());
  topicsByCat.get(cat).set(topic, (topicsByCat.get(cat).get(topic) || 0) + 1);

  const stem = text(kids(q, "text")[0]);
  if (!stem) err(id, "tomt spørsmål");
  const key = stem.toLowerCase();
  if (stems.has(key)) err(id, `samme spørsmålstekst som ${stems.get(key)}`);
  stems.set(key, id);
  if (!/[?]$/.test(stem)) warn(id, "spørsmålet slutter ikke med ?");
  if (stem.split(/\s+/).length > 15) warn(id, "spørsmålet har over 15 ord");
  // Negativt spørsmål: «Hva er ikke …», «Hvorfor kan du ikke …», «unntatt». Leddsetninger som «hvis du ikke har» regnes ikke.
  if (/\bunntatt\b/i.test(stem) || /\b(hva|hvilke[nt]?|hvem|hvorfor)\b[^?]*\b(er|var|kan|bør|skal|må)\s+(du\s+)?(ikke|aldri)\b/i.test(stem)) warn(id, "negativ formulering i spørsmålet");

  const opts = kids(kids(q, "options")[0] || q, "option");
  if (opts.length !== 3) err(id, `har ${opts.length} svaralternativer (skal være 3)`);
  const texts = opts.map(o => text(o));
  if (texts.some(t => !t)) err(id, "tomt svaralternativ");
  if (new Set(texts.map(t => t.toLowerCase())).size !== texts.length) err(id, "to svaralternativer er like");
  const correct = opts.filter(o => o.getAttribute("correct") === "true");
  if (correct.length !== 1) err(id, `har ${correct.length} riktige svar (skal være 1)`);
  if (opts.some(o => !["true", "false"].includes(o.getAttribute("correct")))) err(id, "correct må være true eller false");
  if (texts.some(t => /[.]$/.test(t))) warn(id, "svaralternativ slutter med punktum");
  if (/\b(alle|ingen) (av|de) (de )?(over|ovenfor)\b/i.test(texts.join(" "))) err(id, "«alle/ingen av de over» er ikke tillatt");

  const fb = kids(q, "feedback")[0];
  if (!text(fb && kids(fb, "correct")[0])) err(id, "mangler tilbakemelding for riktig svar");
  if (!text(fb && kids(fb, "wrong")[0])) err(id, "mangler tilbakemelding for feil svar");

  const L = texts.map(t => t.length), mx = Math.max(...L), mn = Math.min(...L);
  const ci = opts.findIndex(o => o.getAttribute("correct") === "true");
  if (ci >= 0 && L[ci] === mx && L.filter(x => x === mx).length === 1) aLongest++;
  const shortTerms = texts.every(x => x.split(/\s+/).length <= 2); // navn og fagord kan ikke gjøres like lange
  if (!shortTerms && mn && mx / mn > 1.7) { ratioHits++; warn(id, `svarene er ulikt lange (${mx}/${mn})`); }
  const absolute = /\b(alltid|aldri|bare|kun|alle)\b/i;
  const abs = opts.map((o, i) => absolute.test(texts[i]) ? i : -1).filter(i => i >= 0);
  if (abs.length && !abs.includes(ci)) warn(id, "absolutt ord (alltid/aldri/bare/kun/alle) bare i gale svar");
}

for (const [c, n] of cats) if (n !== PER_CATEGORY) err(c, `har ${n} spørsmål (skal være ${PER_CATEGORY})`);
for (const [c, t] of topicsByCat) {
  if (t.size > 1 || !t.has("")) {
    if (t.has("")) err(c, `${t.get("")} spørsmål mangler topic mens andre i kategorien har det`);
    for (const [name, n] of t) if (name && n < 5) err(c, `emnet «${name}» har bare ${n} spørsmål (minst 5)`);
  }
}
for (const [c, m] of mains) {
  const inMain = [...mains].filter(([, x]) => x === m).map(([k]) => k);
  if (inMain.length < 1) err(c, "hovedkategori uten underkategorier");
}
if (qs.length === 0) err("fil", "ingen spørsmål funnet");
const share = qs.length ? Math.round((aLongest / qs.length) * 100) : 0;
if (share > 40) warn("bank", `riktig svar er lengst i ${share} % av spørsmålene (mål: nær 33 %)`);

console.log(`Fil: ${path.relative(root, file)}`);
console.log(`Spørsmål: ${qs.length} | temaer: ${[...cats].map(([c, n]) => `${c} (${n})`).join(", ")}`);
for (const [c, t] of topicsByCat) if (t.size > 1 || !t.has("")) console.log(`Emner i ${c}: ${[...t].map(([n, k]) => `${n} (${k})`).join(", ")}`);
for (const m of new Set(mains.values())) console.log(`Hovedkategori ${m}: ${[...mains].filter(([, x]) => x === m).map(([k]) => `${k} (${cats.get(k)})`).join(", ")}`);
console.log(`Riktig svar lengst: ${aLongest} av ${qs.length} (${share} %)`);
if (warnings.length) { console.log(`\nAdvarsler (${warnings.length}):`); warnings.slice(0, +(process.env.MAXWARN||40)).forEach(w => console.log("  - " + w)); if (warnings.length > +(process.env.MAXWARN||40)) console.log(`  … og ${warnings.length - +(process.env.MAXWARN||40)} til`); }
if (errors.length) { console.error(`\nFEIL (${errors.length}):`); errors.forEach(e => console.error("  - " + e)); process.exit(1); }
console.log("\nOK: ingen feil.");
