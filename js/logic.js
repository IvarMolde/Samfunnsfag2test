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

// Trekker like mange spørsmål fra hvert tema. Resten (n mod antall temaer)
// fordeles tilfeldig, maks ett ekstra spørsmål per tema.
export function drawBalanced(bank, n, rng = Math.random) {
  const groups = {};
  bank.forEach(q => (groups[q.category] = groups[q.category] || []).push(q));
  const cats = Object.keys(groups);
  const k = cats.length;
  if (!k) return [];
  const base = Math.floor(n / k);
  const bonus = new Set(shuffle(cats, rng).slice(0, n - base * k));
  const picked = cats.flatMap(c =>
    shuffle(groups[c], rng).slice(0, base + (bonus.has(c) ? 1 : 0)));
  return shuffle(picked, rng);
}

// Lager et spørsmål til visning: svaralternativene stokkes.
export function makeItem(q, rng = Math.random) {
  const options = shuffle(q.options, rng).map((o, i) => ({ ...o, letter: String.fromCharCode(65 + i) }));
  return { ...q, options };
}

// answers[i] = { picked: valgt alternativindeks eller null, flagged?: boolean }
export function scoreSession(items, answers) {
  const byCat = new Map();
  let correct = 0, unanswered = 0;
  const wrongItems = [];
  items.forEach((q, i) => {
    const a = answers[i];
    const c = byCat.get(q.category) || { category: q.category, total: 0, correct: 0 };
    c.total++;
    byCat.set(q.category, c);
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
