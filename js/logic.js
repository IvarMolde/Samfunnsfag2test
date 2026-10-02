// Ren logikk uten DOM. Brukes av app.js og av testene (node --test).
export const PASS_PERCENT = 80;

export function shuffle(arr, rng = Math.random) {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Fordeler n plasser likt mellom grupper. En gruppe kan ikke gi flere enn den har
// (sizes[i]); det som blir til overs fordeles på de andre. Rest ved ujevn deling
// går til tilfeldige grupper, maks ett ekstra per runde.
export function allocate(sizes, n, rng = Math.random) {
  const quota = sizes.map(() => 0);
  let left = Math.min(n, sizes.reduce((a, b) => a + b, 0));
  while (left > 0) {
    const open = sizes.map((sz, i) => i).filter(i => quota[i] < sizes[i]);
    const base = Math.floor(left / open.length);
    let given = 0;
    for (const i of open) {
      const g = Math.min(base, sizes[i] - quota[i]);
      quota[i] += g; given += g;
    }
    left -= given;
    if (left > 0 && given === 0 || (left > 0 && left < open.length)) {
      const room = open.filter(i => quota[i] < sizes[i]);
      for (const i of shuffle(room, rng).slice(0, left)) { quota[i]++; left--; }
    }
  }
  return quota;
}

// Velger spørsmål. Nøkkel: "all" = alt, "main:<navn>" = en hovedkategori, ellers en underkategori.
export function filterByCategory(bank, key) {
  if (!key || key === "all") return bank;
  if (key.startsWith("main:")) return bank.filter(q => q.main === key.slice(5));
  return bank.filter(q => q.category === key);
}

// Trekker like mange spørsmål fra hver kategori, og i en kategori med emner (topic)
// like mange fra hvert emne. Ingen dubletter. Hvis en gruppe er for liten, fyller de andre opp.
export function drawBalanced(bank, n, rng = Math.random) {
  const byCat = new Map();
  bank.forEach(q => { if (!byCat.has(q.category)) byCat.set(q.category, []); byCat.get(q.category).push(q); });
  const cats = [...byCat.values()];
  if (!cats.length) return [];
  const catQuota = allocate(cats.map(c => c.length), n, rng);
  const picked = cats.flatMap((items, ci) => {
    const byTopic = new Map();
    items.forEach(q => { const t = q.topic || ""; if (!byTopic.has(t)) byTopic.set(t, []); byTopic.get(t).push(q); });
    const topics = [...byTopic.values()];
    const tq = allocate(topics.map(t => t.length), catQuota[ci], rng);
    return topics.flatMap((t, ti) => shuffle(t, rng).slice(0, tq[ti]));
  });
  return shuffle(picked, rng);
}

// Lager et spørsmål til visning: svaralternativene stokkes.
export function makeItem(q, rng = Math.random) {
  const options = shuffle(q.options, rng).map((o, i) => ({ ...o, letter: String.fromCharCode(65 + i) }));
  return { ...q, options };
}

// answers[i] = { picked: valgt alternativindeks eller null, flagged?: boolean }
export function scoreSession(items, answers, groupBy = "category") {
  const byCat = new Map();
  let correct = 0, unanswered = 0;
  const wrongItems = [];
  items.forEach((q, i) => {
    const a = answers[i];
    const label = (groupBy === "topic" && q.topic) || q.category;
    const c = byCat.get(label) || { category: label, total: 0, correct: 0 };
    c.total++;
    byCat.set(label, c);
    if (!a || a.picked === null || a.picked === undefined) { unanswered++; wrongItems.push(i); return; }
    if (q.options[a.picked].correct) { correct++; c.correct++; } else wrongItems.push(i);
  });
  const total = items.length;
  const pct = total ? (correct / total) * 100 : 0;
  return {
    total, correct, unanswered,
    wrong: total - correct,
    pct,
    pctText: String(Math.round(pct * 10) / 10).replace('.', ',') + ' %',
    passed: total > 0 && pct >= PASS_PERCENT,
    byCategory: [...byCat.values()].map(c => ({ ...c, pct: c.total ? (c.correct / c.total) * 100 : 0 })),
    wrongItems,
  };
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
