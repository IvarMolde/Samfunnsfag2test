// Tester trekningen på den ekte banken i questions.xml.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DOMParser } from "@xmldom/xmldom";
import { drawBalanced, filterByCategory } from "../../js/logic.js";

const seeded = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const doc = new DOMParser().parseFromString(fs.readFileSync(path.join(root, "questions.xml"), "utf8"), "application/xml");
const qs = doc.getElementsByTagName("question");
const bank = Array.from({ length: qs.length }, (_, i) => qs[i]).map(q => ({
  id: q.getAttribute("id"), main: q.getAttribute("main"), category: q.getAttribute("category"), topic: q.getAttribute("topic") || "",
}));
const count = (list, key) => list.reduce((o, q) => ((o[q[key]] = (o[q[key]] || 0) + 1), o), {});

const FAMILIE = "Familie, helse og hverdagsliv";
const EMNER = {
  "Familieliv": { "Ekteskap og familie": 24, "Å leve i to kulturer": 16, "Barneoppdragelse": 16, "Barnevernet": 12, "Barn og unges rettigheter": 12 },
  "Fritid": { "Politisk engasjement": 32, "Dugnad": 24, "Sosiale arenaer": 24 },
  "Helse": { "Helsetjenester": 16, "Helse og livsstil": 14, "Psykisk helse": 12, "Familieplanlegging, svangerskap og oppfølging av barn": 12, "Tannhelse": 10, "Å flytte til et nytt land": 8, "Identitet": 8 },
  "Personlig økonomi": { "Personlig økonomi": 44, "Bolig": 36 },
  "Retten til et fritt og selvstendig liv": { "Vold i nære relasjoner": 32, "Tvangsekteskap": 18, "Negativ sosial kontroll": 18, "Kjønnslemlestelse": 12 },
};

test("Banken har 9 kategorier med 80 spørsmål hver", () => {
  const c = count(bank, "category");
  assert.equal(Object.keys(c).length, 9);
  Object.values(c).forEach(n => assert.equal(n, 80));
});

test("Familie, helse og hverdagsliv gir 6 kategorier med 80 spørsmål hver", () => {
  const c = count(filterByCategory(bank, "main:" + FAMILIE), "category");
  assert.deepEqual(Object.keys(c).sort(), ["Ny i Norge", ...Object.keys(EMNER)].sort());
  Object.values(c).forEach(n => assert.equal(n, 80));
});

for (const [cat, emner] of Object.entries(EMNER)) {
  test(`${cat}: bare egne spørsmål, riktig hovedkategori og emner`, () => {
    const own = filterByCategory(bank, cat);
    assert.equal(own.length, 80);
    assert.ok(own.every(q => q.category === cat && q.main === FAMILIE));
    assert.deepEqual(count(own, "topic"), emner);
    for (let t = 0; t < 50; t++) {
      const q = drawBalanced(own, 20, seeded(t));
      assert.equal(q.length, 20);
      assert.ok(q.every(x => x.category === cat));
      const per = Object.keys(emner).map(e => q.filter(x => x.topic === e).length);
      assert.ok(Math.max(...per) - Math.min(...per) <= 1, `${cat}: ujevnt mellom emner ${per}`);
    }
  });
}

test("Alle temaer og prøven (38) fordeler jevnt mellom de 9 kategoriene", () => {
  for (let t = 0; t < 200; t++) {
    const q = drawBalanced(bank, 38, seeded(t));
    assert.equal(new Set(q.map(x => x.id)).size, 38);
    const per = Object.values(count(q, "category"));
    assert.equal(per.length, 9);
    assert.ok(Math.max(...per) - Math.min(...per) <= 1, String(per));
  }
});
