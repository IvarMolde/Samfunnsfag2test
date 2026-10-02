import test from "node:test";
import assert from "node:assert/strict";
import { drawBalanced, makeItem, scoreSession, shuffle, formatTime, PASS_PERCENT } from "../../js/logic.js";

// Enkel, repeterbar tilfeldighetsgenerator (mulberry32)
const seeded = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const cats = ["A", "B", "C"];
const bank = cats.flatMap(c => Array.from({ length: 80 }, (_, i) => ({
  id: `${c}-${i}`, category: c, text: `Spørsmål ${c}${i}`,
  options: [{ text: "riktig", correct: true }, { text: "feil 1", correct: false }, { text: "feil 2", correct: false }],
})));

test("PASS_PERCENT er 80", () => assert.equal(PASS_PERCENT, 80));

test("drawBalanced: riktig antall, ingen dubletter og like mange fra hvert tema", () => {
  for (const n of [20, 30, 40]) {
    for (let t = 0; t < 300; t++) {
      const q = drawBalanced(bank, n, seeded(t));
      assert.equal(q.length, n);
      assert.equal(new Set(q.map(x => x.id)).size, n);
      const per = cats.map(c => q.filter(x => x.category === c).length);
      assert.ok(Math.max(...per) - Math.min(...per) <= 1, `ujevn fordeling ${per} for n=${n}`);
      assert.equal(per.reduce((a, b) => a + b, 0), n);
    }
  }
});

test("drawBalanced: 30 gir nøyaktig 10 per tema", () => {
  const q = drawBalanced(bank, 30, seeded(1));
  cats.forEach(c => assert.equal(q.filter(x => x.category === c).length, 10));
});

test("drawBalanced: resten fordeles jevnt over mange trekk", () => {
  const extra = { A: 0, B: 0, C: 0 };
  const T = 3000;
  for (let t = 0; t < T; t++) {
    const q = drawBalanced(bank, 20, seeded(t));
    cats.forEach(c => { if (q.filter(x => x.category === c).length === 7) extra[c]++; });
  }
  // Hvert tema skal få ekstraspørsmålet i ca. 2/3 av trekkene
  cats.forEach(c => assert.ok(Math.abs(extra[c] / T - 2 / 3) < 0.05, `${c}: ${extra[c] / T}`));
});

test("drawBalanced: samme frø gir samme trekk", () => {
  const a = drawBalanced(bank, 30, seeded(7)).map(x => x.id).join();
  const b = drawBalanced(bank, 30, seeded(7)).map(x => x.id).join();
  assert.equal(a, b);
});

test("drawBalanced: tom bank gir tom liste", () => assert.deepEqual(drawBalanced([], 20), []));

test("shuffle endrer ikke innholdet og gir jevn fordeling av første element", () => {
  const arr = [1, 2, 3];
  const first = { 1: 0, 2: 0, 3: 0 };
  for (let t = 0; t < 6000; t++) first[shuffle(arr, seeded(t))[0]]++;
  Object.values(first).forEach(v => assert.ok(Math.abs(v / 6000 - 1 / 3) < 0.03));
  assert.deepEqual([...arr], [1, 2, 3]);
});

test("makeItem: beholder ett riktig svar og gir bokstaver A–C", () => {
  for (let t = 0; t < 100; t++) {
    const it = makeItem(bank[0], seeded(t));
    assert.equal(it.options.filter(o => o.correct).length, 1);
    assert.deepEqual(it.options.map(o => o.letter), ["A", "B", "C"]);
  }
});

test("makeItem: riktig svar havner jevnt på alle tre plasser", () => {
  const pos = [0, 0, 0];
  for (let t = 0; t < 6000; t++) pos[makeItem(bank[0], seeded(t)).options.findIndex(o => o.correct)]++;
  pos.forEach(v => assert.ok(Math.abs(v / 6000 - 1 / 3) < 0.03, String(pos)));
});

const itemsFor = n => Array.from({ length: n }, (_, i) => makeItem({ ...bank[i % 80], category: cats[i % 3] }, () => 0.99));
const correctIdx = it => it.options.findIndex(o => o.correct);

test("scoreSession: grense på 80 % (16 av 20 består, 15 av 20 stryker)", () => {
  const items = itemsFor(20);
  const mk = k => items.map((it, i) => ({ picked: i < k ? correctIdx(it) : (correctIdx(it) + 1) % 3 }));
  assert.equal(scoreSession(items, mk(16)).passed, true);
  assert.equal(scoreSession(items, mk(15)).passed, false);
  assert.equal(scoreSession(items, mk(20)).pct, 100);
});

test("scoreSession: 24 av 30 og 32 av 40 består, ett færre stryker", () => {
  for (const [n, k] of [[30, 24], [40, 32]]) {
    const items = itemsFor(n);
    const mk = c => items.map((it, i) => ({ picked: i < c ? correctIdx(it) : (correctIdx(it) + 1) % 3 }));
    assert.equal(scoreSession(items, mk(k)).passed, true);
    assert.equal(scoreSession(items, mk(k - 1)).passed, false);
  }
});

test("scoreSession: ubesvarte teller som feil og er med i wrongItems", () => {
  const items = itemsFor(10);
  const answers = items.map((it, i) => (i < 5 ? { picked: correctIdx(it) } : { picked: null }));
  const r = scoreSession(items, answers);
  assert.equal(r.correct, 5); assert.equal(r.unanswered, 5); assert.equal(r.wrong, 5);
  assert.deepEqual(r.wrongItems, [5, 6, 7, 8, 9]);
  assert.equal(r.passed, false);
});

test("scoreSession: resultat per tema", () => {
  const items = itemsFor(30);
  const answers = items.map(it => ({ picked: it.category === "A" ? correctIdx(it) : (correctIdx(it) + 1) % 3 }));
  const r = scoreSession(items, answers);
  const a = r.byCategory.find(c => c.category === "A");
  assert.equal(a.total, 10); assert.equal(a.correct, 10); assert.equal(a.pct, 100);
  assert.equal(r.byCategory.find(c => c.category === "B").correct, 0);
});

test("scoreSession: tom prøve består ikke", () => assert.equal(scoreSession([], []).passed, false));

test("formatTime", () => {
  assert.equal(formatTime(0), "00:00"); assert.equal(formatTime(65), "01:05");
  assert.equal(formatTime(1200), "20:00"); assert.equal(formatTime(-5), "00:00");
});
