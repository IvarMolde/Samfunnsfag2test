import { drawBalanced, makeItem, scoreSession, PASS_PERCENT } from "./js/logic.js";

const $ = s => document.querySelector(s);
const screens = { start: $("#startScreen"), quiz: $("#quizScreen"), result: $("#resultScreen") };
const state = { bank: [], openers: { correct: [], wrong: [] }, items: [], answers: [], current: 0,
  mode: "practice", kind: "normal", count: 20, name: "", date: "" };

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
  state.items = questions.map(q => makeItem(q));
  state.answers = [];
  state.current = 0;
  state.mode = mode;
  state.kind = kind;
  state.date = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  show("quiz");
  renderQuestion();
}

function start() {
  state.name = $("#studentName").value.trim();
  beginSession(drawBalanced(state.bank, state.count), { mode: state.mode, kind: "normal" });
}

function renderQuestion() {
  const q = state.items[state.current], n = state.items.length, practice = state.mode === "practice";
  $("#counter").textContent = `${state.current + 1} av ${n}`;
  $("#progressBar").style.width = `${(state.current / n) * 100}%`;
  $("#category").textContent = q.category;
  $("#scoreLive").textContent = practice ? `${scoreSession(state.items, state.answers).correct} riktige` : "";
  $("#questionText").textContent = q.text;
  $("#feedback").hidden = true; $("#feedback").className = "feedback";
  $("#nextBtn").disabled = true;
  $("#nextBtn").innerHTML = state.current === n - 1 ? "Se resultat <span>→</span>" : "Neste <span>→</span>";
  const box = $("#options"); box.innerHTML = "";
  q.options.forEach((o, i) => {
    const b = document.createElement("button");
    b.className = "option"; b.dataset.i = i;
    b.innerHTML = `<span class="letter">${o.letter}</span><span>${esc(o.text)}</span>`;
    b.onclick = () => choose(i);
    box.appendChild(b);
  });
}

function choose(i) {
  const q = state.items[state.current], picked = q.options[i], btns = [...$("#options").children];
  if (state.answers[state.current]) return;
  state.answers[state.current] = { picked: i };
  btns.forEach(b => (b.disabled = true));
  if (state.mode === "practice") {
    btns[i].classList.add(picked.correct ? "correct" : "wrong");
    const ci = q.options.findIndex(x => x.correct);
    if (ci >= 0) btns[ci].classList.add("correct");
    const opener = picked.correct ? pick(state.openers.correct, "Riktig!") : pick(state.openers.wrong, "Ikke riktig.");
    $("#feedback").hidden = false;
    $("#feedback").className = `feedback ${picked.correct ? "correct" : "wrong"}`;
    $("#feedback").innerHTML = `<strong>${picked.correct ? "✓" : "✕"} ${esc(opener)}</strong><br>${esc(picked.correct ? q.feedbackCorrect : q.feedbackWrong)}`;
    $("#scoreLive").textContent = `${scoreSession(state.items, state.answers).correct} riktige`;
  } else {
    btns[i].classList.add("selected");
  }
  $("#nextBtn").disabled = false;
}

function next() {
  if (!state.answers[state.current]) return;
  state.current++;
  if (state.current < state.items.length) renderQuestion(); else showResult();
}

function showResult() {
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
  renderThemes(r);
  renderReview(r);
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
      <div class="bar" role="img" aria-label="${c.correct} av ${c.total} riktige"><div class="bar-fill ${c.pct >= PASS_PERCENT ? "ok" : "low"}" style="width:${pct}%"></div></div>`;
    box.appendChild(row);
  });
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
});
document.querySelectorAll(".mode").forEach(b => b.onclick = () => {
  document.querySelectorAll(".mode").forEach(x => x.classList.remove("selected"));
  b.classList.add("selected"); state.mode = b.dataset.mode;
});
$("#startBtn").onclick = start;
$("#nextBtn").onclick = next;
$("#quitBtn").onclick = () => { if (confirm("Vil du avslutte testen? Fremgangen blir ikke lagret.")) show("start"); };
$("#restartBtn").onclick = () => show("start");
$("#printBtn").onclick = printResult;
$("#reviewBtn").onclick = () => {
  $("#review").classList.toggle("open");
  $("#reviewBtn").textContent = $("#review").classList.contains("open") ? "Skjul gjennomgang" : "Se gjennom svar";
};
loadBank().catch(err => { console.error(err); alert("Kunne ikke laste spørsmålsbanken. Kontroller at questions.xml ligger i samme mappe som index.html."); });

window.__state = state; // brukes av testene
