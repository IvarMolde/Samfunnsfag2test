import { drawBalanced, makeItem, scoreSession, formatTime, PASS_PERCENT } from "./js/logic.js";

const $ = s => document.querySelector(s);
const screens = { start: $("#startScreen"), quiz: $("#quizScreen"), overview: $("#overviewScreen"), result: $("#resultScreen") };
const state = { bank: [], openers: { correct: [], wrong: [] }, items: [], answers: [], current: 0,
  mode: "practice", kind: "normal", count: 20, name: "", date: "",
  timer: { enabled: false, minutes: 30, endsAt: 0, startedAt: 0, handle: null, warned: new Set() }, running: false, autoSubmitted: false, usedSeconds: 0 };

const pick = (a, fb) => (a && a.length ? a[Math.floor(Math.random() * a.length)] : fb);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function loadBank() {
  const text = await fetch("questions.xml").then(r => r.text());
  const doc = new DOMParser().parseFromString(text, "application/xml");
  state.bank = [...doc.querySelectorAll("question")].map(q => ({
    id: q.getAttribute("id"), category: q.getAttribute("category"),
    text: q.querySelector("text").textContent,
    options: [...q.querySelectorAll("option")].map(o => ({ text: o.textContent, correct: o.getAttribute("correct") === "true" })),
    feedbackCorrect: q.querySelector("feedback correct").textContent,
    feedbackWrong: q.querySelector("feedback wrong").textContent
  }));
  state.openers = {
    correct: [...doc.querySelectorAll('opener[type="correct"]')].map(o => o.textContent),
    wrong: [...doc.querySelectorAll('opener[type="wrong"]')].map(o => o.textContent)
  };
}

function show(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle("active", k === name));
  window.scrollTo(0, 0);
}

function beginSession(questions, { mode, kind }) {
  stopTimer();
  state.items = questions.map(q => makeItem(q));
  state.answers = state.items.map(() => ({ picked: null, flagged: false }));
  state.current = 0;
  state.mode = mode;
  state.kind = kind;
  state.autoSubmitted = false;
  state.usedSeconds = 0;
  state.running = true;
  state.date = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  const test = mode === "test";
  $("#testTools").hidden = !test;
  $("#quizTitle").textContent = test ? "Prøve" : "Samfunnskunnskap";
  if (test && state.timer.enabled) startTimer(state.timer.minutes * 60); else $("#timer").hidden = true;
  show("quiz");
  renderQuestion();
}

function start() {
  state.name = $("#studentName").value.trim();
  state.timer.enabled = state.mode === "test" && $("#useTimer").checked;
  state.timer.minutes = +$("#timerMinutes").value;
  beginSession(drawBalanced(state.bank, state.count), { mode: state.mode, kind: "normal" });
}

/* ---------- Tidtaker (kun Prøvemodus) ---------- */
function startTimer(seconds) {
  const t = state.timer;
  t.startedAt = Date.now(); t.endsAt = t.startedAt + seconds * 1000; t.warned = new Set();
  $("#timer").hidden = false;
  tick();
  t.handle = setInterval(tick, 500);
}
function stopTimer() {
  const t = state.timer;
  if (t.handle) clearInterval(t.handle);
  t.handle = null;
}
function tick() {
  const t = state.timer, left = Math.ceil((t.endsAt - Date.now()) / 1000);
  const el = $("#timer");
  el.textContent = formatTime(left);
  el.classList.toggle("low", left <= 120);
  [300, 60].forEach(w => {
    if (left <= w && left > 0 && !t.warned.has(w)) {
      t.warned.add(w);
      $("#liveRegion").textContent = w === 300 ? "Fem minutter igjen." : "Ett minutt igjen.";
    }
  });
  if (state.screenOverview) $("#overviewTimer").textContent = `Tid igjen: ${formatTime(left)}`;
  if (left <= 0) submitTest(true);
}

/* ---------- Spørsmål ---------- */
function renderQuestion() {
  const q = state.items[state.current], n = state.items.length, test = state.mode === "test";
  const a = state.answers[state.current];
  state.screenOverview = false;
  $("#counter").textContent = `Spørsmål ${state.current + 1} av ${n}`;
  const answered = state.answers.filter(x => x.picked !== null).length;
  const prog = test ? answered / n : state.current / n;
  $("#progressBar").style.width = `${prog * 100}%`;
  $("#progress").setAttribute("aria-valuenow", Math.round(prog * 100));
  $("#category").textContent = test ? "" : q.category;
  $("#scoreLive").textContent = test ? `${answered} av ${n} besvart` : `${scoreSession(state.items, state.answers).correct} riktige`;
  $("#questionText").textContent = q.text;
  $("#feedback").hidden = true; $("#feedback").className = "feedback"; $("#feedback").textContent = "";
  const last = state.current === n - 1;
  if (test) {
    $("#nextBtn").disabled = false;
    $("#nextBtn").textContent = last ? "Til oversikt" : "Neste";
    $("#prevBtn").disabled = state.current === 0;
    const f = $("#flagBtn");
    f.setAttribute("aria-pressed", String(a.flagged));
    f.textContent = a.flagged ? "✓ Merket for senere" : "Merk for senere";
    f.classList.toggle("on", a.flagged);
  } else {
    $("#nextBtn").disabled = a.picked === null;
    $("#nextBtn").textContent = last ? "Se resultat" : "Neste";
  }
  const box = $("#options"); box.innerHTML = "";
  q.options.forEach((o, i) => {
    const b = document.createElement("button");
    b.className = "option"; b.dataset.i = i;
    if (test) { b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(a.picked === i)); if (a.picked === i) b.classList.add("selected"); }
    b.innerHTML = `<span class="letter">${o.letter}</span><span>${esc(o.text)}</span>`;
    b.onclick = () => choose(i);
    box.appendChild(b);
  });
  if (test) box.setAttribute("role", "radiogroup"); else box.setAttribute("role", "group");
  if (!state.firstRender) state.firstRender = true; else $("#questionText").focus({ preventScroll: true });
}

function choose(i) {
  if (state.mode === "test") return chooseTest(i);
  const q = state.items[state.current], picked = q.options[i], btns = [...$("#options").children];
  if (state.answers[state.current].picked !== null) return;
  state.answers[state.current].picked = i;
  btns.forEach(b => (b.disabled = true));
  btns[i].classList.add(picked.correct ? "correct" : "wrong");
  const ci = q.options.findIndex(x => x.correct);
  if (ci >= 0) btns[ci].classList.add("correct");
  const opener = picked.correct ? pick(state.openers.correct, "Riktig!") : pick(state.openers.wrong, "Ikke riktig.");
  $("#feedback").hidden = false;
  $("#feedback").className = `feedback ${picked.correct ? "correct" : "wrong"}`;
  $("#feedback").innerHTML = `<strong>${picked.correct ? "✓" : "✕"} ${esc(opener)}</strong><br>${esc(picked.correct ? q.feedbackCorrect : q.feedbackWrong)}`;
  $("#scoreLive").textContent = `${scoreSession(state.items, state.answers).correct} riktige`;
  $("#nextBtn").disabled = false;
}

/* Prøvemodus: ingen farger, ingen tilbakemelding, ingen poeng. Svaret kan endres eller fjernes. */
function chooseTest(i) {
  const a = state.answers[state.current];
  a.picked = a.picked === i ? null : i;
  [...$("#options").children].forEach((b, idx) => {
    const on = a.picked === idx;
    b.classList.toggle("selected", on); b.setAttribute("aria-checked", String(on));
  });
  const n = state.items.length, answered = state.answers.filter(x => x.picked !== null).length;
  $("#progressBar").style.width = `${(answered / n) * 100}%`;
  $("#scoreLive").textContent = `${answered} av ${n} besvart`;
}

function next() {
  if (state.mode === "test") {
    if (state.current < state.items.length - 1) { state.current++; renderQuestion(); } else openOverview();
    return;
  }
  if (state.answers[state.current].picked === null) return;
  state.current++;
  if (state.current < state.items.length) renderQuestion(); else showResult();
}
function prev() { if (state.current > 0) { state.current--; renderQuestion(); } }
function toggleFlag() { const a = state.answers[state.current]; a.flagged = !a.flagged; renderQuestion(); }

/* ---------- Oversikt og innlevering (Prøvemodus) ---------- */
function openOverview() {
  state.screenOverview = true;
  show("overview");
  const n = state.items.length;
  const answered = state.answers.filter(x => x.picked !== null).length;
  const flagged = state.answers.filter(x => x.flagged).length;
  $("#overviewSummary").textContent = `Besvart ${answered} av ${n}` + (n - answered ? ` · ${n - answered} ikke besvart` : "") + (flagged ? ` · ${flagged} merket` : "");
  const grid = $("#overviewGrid"); grid.innerHTML = "";
  state.answers.forEach((a, i) => {
    const b = document.createElement("button");
    b.className = `ov-item ${a.picked !== null ? "answered" : "unanswered"}${a.flagged ? " flagged" : ""}`;
    b.textContent = i + 1;
    b.setAttribute("aria-label", `Spørsmål ${i + 1}: ${a.picked !== null ? "besvart" : "ikke besvart"}${a.flagged ? ", merket" : ""}`);
    b.onclick = () => { state.current = i; show("quiz"); renderQuestion(); };
    grid.appendChild(b);
  });
  const ot = $("#overviewTimer"); ot.hidden = !state.timer.enabled;
  if (state.timer.enabled) tick();
  $("#overviewTitle").focus({ preventScroll: true });
}

function askSubmit() {
  const n = state.items.length, un = state.answers.filter(x => x.picked === null).length;
  $("#dlgText").textContent = un
    ? `Du har ${un === 1 ? "1 spørsmål" : un + " spørsmål"} uten svar. Ubesvarte spørsmål gir ingen poeng. Du kan ikke endre svarene etter at du har levert.`
    : `Du har svart på alle ${n} spørsmål. Du kan ikke endre svarene etter at du har levert.`;
  const d = $("#submitDialog");
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}

function submitTest(auto = false) {
  if (!state.running) return;
  state.running = false;
  state.autoSubmitted = auto;
  if (state.timer.enabled) state.usedSeconds = Math.min((Date.now() - state.timer.startedAt) / 1000, state.timer.minutes * 60);
  stopTimer();
  const d = $("#submitDialog"); if (d.open) d.close();
  showResult();
}

function showResult() {
  state.running = false; stopTimer(); $("#timer").hidden = true;
  show("result");
  const r = scoreSession(state.items, state.answers);
  const retry = state.kind === "retry";
  $("#resultTitle").textContent = retry ? "Repetisjon ferdig"
    : r.passed ? "Du har bestått!" : "Du har ikke bestått denne gangen.";
  $("#resultTitle").dataset.status = retry ? "retry" : r.passed ? "pass" : "fail";
  const modeText = retry ? "Repetisjon av feil" : state.mode === "test" ? "Prøvemodus" : "Øvingsmodus";
  $("#resultSub").textContent = [state.name, state.date, modeText, `${r.total} spørsmål`].filter(Boolean).join(" · ");
  $("#percent").textContent = r.pctText.replace(" %", "%");
  $("#correctCount").textContent = r.correct;
  $("#wrongCount").textContent = r.wrong;
  $("#totalCount").textContent = r.total;
  $("#requirement").textContent = retry ? "–" : `${PASS_PERCENT} %`;
  $("#scoreCircle").dataset.status = $("#resultTitle").dataset.status;
  $("#scoreArc").style.strokeDasharray = `${Math.max(0.01, r.pct)} 100`;
  const note = $("#resultNote");
  const bits = [];
  if (state.autoSubmitted) bits.push("Tiden var ute, og prøven ble levert automatisk.");
  if (state.mode === "test" && state.timer.enabled && state.kind === "normal") bits.push(`Brukt tid: ${formatTime(state.usedSeconds)} av ${state.timer.minutes}:00.`);
  note.textContent = bits.join(" "); note.hidden = bits.length === 0;
  renderThemes(r);
  renderReview(r);
  $("#resultTitle").focus({ preventScroll: true });
  const rb = $("#retryBtn");
  rb.hidden = r.wrongItems.length === 0;
  rb.textContent = `Øv på feilene (${r.wrongItems.length})`;
  rb.onclick = () => beginSession(r.wrongItems.map(i => state.items[i]), { mode: "practice", kind: "retry" });
  $("#review").classList.remove("open");
  $("#reviewBtn").textContent = "Se gjennom svar";
}

function renderThemes(r) {
  const box = $("#themeBars");
  box.innerHTML = "<h2>Resultat per tema</h2>";
  r.byCategory.forEach(c => {
    const row = document.createElement("div");
    row.className = "theme-row";
    const pct = Math.round(c.pct);
    row.innerHTML = `<div class="theme-label"><span>${esc(c.category)}</span><strong>${c.correct} av ${c.total} (${pct} %)</strong></div>
      <div class="bar" role="img" aria-label="${c.correct} av ${c.total} riktige"><div class="bar-fill ${c.pct >= PASS_PERCENT ? "ok" : "low"}" style="width:${pct}%"></div><i class="mark" aria-hidden="true"></i></div>`;
    box.appendChild(row);
  });
  const key = document.createElement("p");
  key.className = "bar-key";
  key.textContent = `Streken viser ${PASS_PERCENT} %, kravet for å bestå.`;
  box.appendChild(key);
}

function renderReview(r) {
  const box = $("#review");
  box.innerHTML = `<h2>Gjennomgang</h2><p class="print-only">Spørsmål som ble besvart feil, med riktig svar.</p>`;
  state.items.forEach((q, i) => {
    const a = state.answers[i];
    const ok = a && a.picked != null && q.options[a.picked].correct;
    const div = document.createElement("div");
    div.className = `review-item ${ok ? "correct" : "wrong"}`;
    const mine = a && a.picked != null ? q.options[a.picked].text : "Ikke besvart";
    const right = q.options.find(x => x.correct).text;
    div.innerHTML = `<strong>${i + 1}. ${esc(q.text)}</strong>
      <div class="review-answer">Ditt svar: ${esc(mine)}</div>
      ${ok ? "" : `<div class="review-answer">Riktig svar: ${esc(right)}</div><div class="review-answer note">${esc(q.feedbackWrong)}</div>`}`;
    box.appendChild(div);
  });
}

function printResult() {
  const old = document.title;
  const parts = ["Resultat samfunnskunnskap", state.name, state.date].filter(Boolean);
  document.title = parts.join(" – ");
  const restore = () => { document.title = old; window.removeEventListener("afterprint", restore); };
  window.addEventListener("afterprint", restore);
  window.print();
}

document.querySelectorAll(".choice").forEach(b => b.onclick = () => {
  document.querySelectorAll(".choice").forEach(x => x.classList.remove("selected"));
  b.classList.add("selected"); state.count = +b.dataset.count;
  if (!timerTouched) $("#timerMinutes").value = String(defaultMinutes[state.count]);
});
document.querySelectorAll(".mode").forEach(b => b.onclick = () => {
  document.querySelectorAll(".mode").forEach(x => x.classList.remove("selected"));
  b.classList.add("selected"); state.mode = b.dataset.mode;
  $("#timerSetup").hidden = state.mode !== "test";
});
$("#useTimer").onchange = () => { $("#timerMinutesWrap").hidden = !$("#useTimer").checked; };
let timerTouched = false;
$("#timerMinutes").onchange = () => { timerTouched = true; };
const defaultMinutes = { 20: 20, 30: 30, 40: 45 };
$("#timerMinutes").value = String(defaultMinutes[20]);
$("#startBtn").onclick = start;
$("#nextBtn").onclick = next;
$("#quitBtn").onclick = () => {
  const msg = state.mode === "test" ? "Vil du avslutte prøven? Svarene dine lagres ikke, og du får ikke resultat." : "Vil du avslutte testen? Fremgangen blir ikke lagret.";
  if (confirm(msg)) { state.running = false; stopTimer(); $("#timer").hidden = true; show("start"); }
};
$("#prevBtn").onclick = prev;
$("#flagBtn").onclick = toggleFlag;
$("#overviewBtn").onclick = openOverview;
$("#backToQuizBtn").onclick = () => { show("quiz"); renderQuestion(); };
$("#submitBtn").onclick = askSubmit;
$("#dlgOk").onclick = e => { e.preventDefault(); submitTest(false); };
$("#dlgCancel").onclick = e => { e.preventDefault(); $("#submitDialog").close(); };
window.addEventListener("beforeunload", e => { if (state.running && state.mode === "test") { e.preventDefault(); e.returnValue = ""; } });
$("#restartBtn").onclick = () => show("start");
$("#printBtn").onclick = printResult;
$("#reviewBtn").onclick = () => {
  const open = $("#review").classList.toggle("open");
  $("#reviewBtn").textContent = open ? "Skjul gjennomgang" : "Se gjennom svar";
  $("#reviewBtn").setAttribute("aria-expanded", String(open));
};
loadBank().catch(err => { console.error(err); alert("Kunne ikke laste spørsmålsbanken. Kontroller at questions.xml ligger i samme mappe som index.html."); });

window.__state = state; // brukes av testene
