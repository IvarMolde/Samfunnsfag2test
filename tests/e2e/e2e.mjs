// Ende-til-ende-test i ekte nettleser. Starter en lokal server, kjører hele flyten og kontrollerer kravene.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".xml": "application/xml", ".woff2": "font/woff2", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]).replace(/^\/$/, "/index.html"));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const exe = process.env.CHROMIUM_PATH || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
let failed = 0;
async function scenario(name, fn, viewport = { width: 1000, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [], external = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("dialog", d => d.accept());
  page.on("request", r => { if (!r.url().startsWith(base) && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) external.push(r.url()); });
  try {
    await page.goto(base); await page.waitForFunction(() => window.__state && window.__state.bank.length > 0);
    await fn(page, ctx);
    assert.deepEqual(errors, [], "JavaScript-feil: " + errors.join("; "));
    assert.deepEqual(external, [], "Kall til eksterne adresser: " + external.join(", "));
    console.log("ok   ", name);
  } catch (e) { failed++; console.error("FEIL ", name, "\n     ", e.message); }
  await ctx.close();
}
const correctIdx = p => p.evaluate(() => { const s = window.__state; return s.items[s.current].options.findIndex(o => o.correct); });
const clickOpt = async (p, i) => (await p.$$("#options .option"))[i].click();
const setup = async (p, count, mode) => { await p.click(`.choice[data-count="${count}"]`); await p.click(`.mode[data-mode="${mode}"]`); };

await scenario("Les her forklarer prøven og at resultatet ikke er offisielt", async p => {
  await p.click("#aboutBtn");
  assert.equal(await p.isVisible("#aboutDialog"), true);
  const text = await p.textContent("#aboutDialog");
  assert.match(text, /alltid 38 spørsmål/);
  assert.match(text, /ikke et offisielt resultat/);
  assert.match(text, /ikke den offisielle prøven/);
  await p.click("#aboutTitle");
  assert.equal(await p.isVisible("#aboutDialog"), true, "klikk i teksten lukker ikke boksen");
  await p.click("#aboutClose");
  assert.equal(await p.isVisible("#aboutDialog"), false);
  await p.click("#aboutBtn");
  await p.keyboard.press("Escape");
  assert.equal(await p.isVisible("#aboutDialog"), false);
  await p.click("#aboutBtn");
  await p.click("#aboutDialog", { position: { x: 8, y: 8 } });
  assert.equal(await p.isVisible("#aboutDialog"), false, "klikk utenfor boksen lukker den");
});

await scenario("Banken har 1040 spørsmål, 80 per undertema, og Ny i Norge har fire emner", async p => {
  const c = await p.evaluate(() => { const o = {}; window.__state.bank.forEach(q => (o[q.category] = (o[q.category] || 0) + 1)); return o; });
  assert.equal(Object.keys(c).length, 13);
  Object.values(c).forEach(n => assert.equal(n, 80));
  const t = await p.evaluate(() => [...new Set(window.__state.bank.filter(q => q.category === "Ny i Norge").map(q => q.topic))]);
  assert.equal(t.length, 4);
  const m = await p.evaluate(() => [...new Set(window.__state.bank.filter(q => q.category === "Ny i Norge").map(q => q.main))]);
  assert.deepEqual(m, ["Familie, helse og hverdagsliv"]);
});

await scenario("Ny i Norge kan velges under Familie, helse og hverdagsliv og gir bare spørsmål derfra, jevnt fra emnene", async p => {
  await p.click("#scopeOne");
  assert.equal(await p.locator("#themePicker .theme-card img").count(), 3);
  await p.click('#themePicker [data-theme="familie"]');
  assert.equal(await p.getAttribute('#themePicker [data-theme="familie"]', "aria-expanded"), "true");
  const btn = await p.$("#themePicker .pick:has-text('Ny i Norge')");
  assert.equal(await btn.isDisabled(), false, "Ny i Norge skal ikke lenger stå som «kommer»");
  assert.doesNotMatch(await btn.textContent(), /kommer/);
  await btn.click();
  await p.click('.choice[data-count="20"]'); await p.click('.mode[data-mode="practice"]');
  await p.click("#startBtn");
  const r = await p.evaluate(() => window.__state.items.map(q => [q.category, q.topic]));
  assert.equal(r.length, 20);
  assert.ok(r.every(x => x[0] === "Ny i Norge"));
  const per = {}; r.forEach(x => (per[x[1]] = (per[x[1]] || 0) + 1));
  assert.deepEqual(Object.values(per).sort(), [5, 5, 5, 5], JSON.stringify(per));
});

await scenario("Alle fem nye undertemaer kan velges, og Helse gir bare Helse-spørsmål fra alle sju emnene", async p => {
  await p.click("#scopeOne");
  await p.click('#themePicker [data-theme="familie"]');
  for (const name of ["Familieliv", "Fritid", "Helse", "Personlig økonomi", "Retten til et fritt og selvstendig liv"]) {
    const btn = await p.$(`#themePicker .pick:has-text('${name}')`);
    assert.equal(await btn.isDisabled(), false, `${name} skal kunne velges`);
    assert.doesNotMatch(await btn.textContent(), /kommer/);
  }
  await p.click("#themePicker .pick:has-text('Helse')");
  await p.click('.choice[data-count="20"]'); await p.click('.mode[data-mode="practice"]');
  await p.click("#startBtn");
  const r = await p.evaluate(() => window.__state.items.map(q => [q.category, q.topic]));
  assert.equal(r.length, 20);
  assert.ok(r.every(x => x[0] === "Helse"), JSON.stringify(r));
  assert.equal(new Set(r.map(x => x[1])).size, 7);
  assert.equal(await p.textContent("#headerScope"), "Helse");
});

await scenario("Norge før og nå: alle fire undertemaer kan velges, og Historie gir bare Historie fra alle fem emnene", async p => {
  await p.click("#scopeOne");
  await p.click('#themePicker [data-theme="norge"]');
  for (const name of ["Dette er Norge", "Historie", "Menneskerettigheter og demokrati", "Bærekraft"]) {
    const btn = await p.$(`#themePicker .pick:has-text('${name}')`);
    assert.equal(await btn.isDisabled(), false, `${name} skal kunne velges`);
    assert.doesNotMatch(await btn.textContent(), /kommer/);
  }
  await p.click("#themePicker .pick:has-text('Historie')");
  await p.click('.choice[data-count="20"]'); await p.click('.mode[data-mode="practice"]');
  await p.click("#startBtn");
  const r = await p.evaluate(() => window.__state.items.map(q => [q.category, q.topic, q.main]));
  assert.equal(r.length, 20);
  assert.ok(r.every(x => x[0] === "Historie" && x[2] === "Norge før og nå"), JSON.stringify(r));
  assert.equal(new Set(r.map(x => x[1])).size, 5);
  assert.equal(await p.textContent("#headerScope"), "Historie");
});

await scenario("Flere undertemaer: Helse og Historie gir 20 spørsmål, like mange fra hvert", async p => {
  await p.click("#scopeOne");
  await p.click('#themePicker [data-theme="familie"]');
  await p.click("#themePicker .pick:has-text('Helse')");
  await p.click('#themePicker [data-theme="norge"]');
  await p.click("#themePicker .pick:has-text('Historie')");
  await p.click('.choice[data-count="20"]'); await p.click('.mode[data-mode="practice"]');
  await p.click("#startBtn");
  const r = await p.evaluate(() => window.__state.items.map(q => q.category));
  assert.equal(r.length, 20);
  const per = r.reduce((o, c) => ((o[c] = (o[c] || 0) + 1), o), {});
  assert.deepEqual(per, { Helse: 10, Historie: 10 }, JSON.stringify(per));
  assert.equal(await p.textContent("#headerScope"), "2 undertemaer");
  const cat = (await p.textContent("#category")).trim();
  assert.ok(["Helse", "Historie"].includes(cat), cat);
  assert.equal((await p.textContent("#sessionScope")).trim(), "");
  assert.equal(await p.locator(".theme-banner").count(), 0);
});

await scenario("Prøvemodus og Alle temaer trekker fra alle 13 undertemaene", async p => {
  for (const mode of ["test", "practice"]) {
    await p.goto(base); await p.waitForFunction(() => window.__state && window.__state.bank.length > 0);
    if (mode === "practice") await p.click('.choice[data-count="40"]');
    await p.click(`.mode[data-mode="${mode}"]`);
    await p.click("#startBtn");
    const per = await p.evaluate(() => { const o = {}; window.__state.items.forEach(q => (o[q.category] = (o[q.category] || 0) + 1)); return o; });
    assert.equal(Object.keys(per).length, 13, `${mode}: ${JSON.stringify(per)}`);
    assert.ok(Math.max(...Object.values(per)) - Math.min(...Object.values(per)) <= 1, JSON.stringify(per));
  }
});

await scenario("Ny i Norge, 40 spørsmål: emnet med 9 spørsmål gir høyst 9, og resultatet vises per emne", async p => {
  await p.click("#scopeOne");
  await p.click('#themePicker [data-theme="familie"]');
  await p.click("#themePicker .pick:has-text('Ny i Norge')");
  await p.click('.choice[data-count="40"]'); await p.click('.mode[data-mode="practice"]');
  await p.click("#startBtn");
  const per = await p.evaluate(() => { const o = {}; window.__state.items.forEach(q => (o[q.topic] = (o[q.topic] || 0) + 1)); return o; });
  assert.equal(Object.values(per).reduce((a, b) => a + b, 0), 40);
  assert.ok(per["Ny i Norge – hovedside"] <= 9);
  for (let i = 0; i < 40; i++) { await clickOpt(p, await correctIdx(p)); await p.click("#nextBtn"); }
  const rows = await p.$$eval(".theme-row", e => e.map(x => x.textContent));
  assert.equal(rows.length, 4, "resultat per emne");
  assert.ok(rows.some(x => /Introduksjonsprogrammet/.test(x)));
});

for (const n of [20, 30, 40]) {
  await scenario(`Øvingsmodus ${n}: like mange fra hvert tema og tilbakemelding etter svar`, async p => {
    await setup(p, n, "practice"); await p.click("#startBtn");
    const per = await p.evaluate(() => { const o = {}; window.__state.items.forEach(q => (o[q.category] = (o[q.category] || 0) + 1)); return Object.values(o); });
    assert.equal(per.reduce((a, b) => a + b, 0), n);
    assert.ok(Math.max(...per) - Math.min(...per) <= 1, "ujevn: " + per);
    assert.equal(await p.isVisible("#feedback"), false);
    await clickOpt(p, await correctIdx(p));
    assert.equal(await p.isVisible("#feedback"), true);
    assert.match(await p.textContent("#feedback"), /✓/);
    assert.equal(await p.isVisible("#timer"), false);
    assert.equal(await p.isVisible("#testTools"), false, "Prøvemodus-knapper skal ikke vises i Øvingsmodus");
  });
}

await scenario("Øvingsmodus: feil svar gir hint og viser riktig svar", async p => {
  await setup(p, 20, "practice"); await p.click("#startBtn");
  const ci = await correctIdx(p);
  await clickOpt(p, [0, 1, 2].find(x => x !== ci));
  assert.match(await p.textContent("#feedback"), /✕/);
  assert.equal((await p.$$("#options .option.correct")).length, 1);
  assert.equal((await p.$$("#options .option.wrong")).length, 1);
});

await scenario("Prøvemodus: ingen tilbakemelding, farger eller poeng før innlevering", async p => {
  await setup(p, 20, "test"); await p.click("#startBtn");
  assert.equal(await p.evaluate(() => window.__state.items.length), 38);
  for (let i = 0; i < 38; i++) {
    const ci = await correctIdx(p);
    if (i < 36) await clickOpt(p, i % 2 === 0 ? ci : [0, 1, 2].find(x => x !== ci));
    const cls = (await p.$$eval("#options .option", a => a.map(x => x.className))).join(" ");
    assert.ok(!/correct|wrong/.test(cls), `farge på spørsmål ${i + 1}`);
    assert.equal(await p.isVisible("#feedback"), false, `tilbakemelding på spørsmål ${i + 1}`);
    assert.ok(!/riktig|feil/i.test(await p.textContent("#scoreLive")), "poeng vist");
    await p.click("#nextBtn");
  }
  assert.ok(await p.isVisible("#overviewScreen"));
  assert.ok(!(await p.isVisible("#resultScreen")));
  assert.match(await p.textContent("#overviewSummary"), /Besvart 36 av 38 · 2 ikke besvart/);
  await p.click("#submitBtn");
  assert.match(await p.textContent("#dlgText"), /2 spørsmål uten svar/);
  await p.click("#dlgCancel");
  assert.equal(await p.isVisible("#resultScreen"), false);
  await p.click("#submitBtn"); await p.click("#dlgOk");
  assert.ok(await p.isVisible("#resultScreen"));
  assert.equal(await p.textContent("#correctCount"), "18");
  assert.equal(await p.textContent("#percent"), "47,4%");
  assert.match(await p.textContent("#resultTitle"), /ikke bestått/);
  assert.equal((await p.$$(".theme-row")).length, 13);
  assert.equal(await p.isVisible("#printBtn"), true);
  await p.click("#printBtn");
  assert.equal(await p.evaluate(() => document.getElementById("printDialog").open), true);
  await p.fill("#printName", "Kari Nordmann");
  await p.evaluate(() => { window.print = () => {}; });
  await p.click("#printDlgOk");
  assert.equal(await p.textContent("#diplomaName"), "Kari Nordmann");
  assert.match(await p.textContent("#diplomaDate"), /^Gjennomført \d+\. \w+ 2\d{3}$/);
  assert.match(await p.getAttribute(".diploma-logo", "alt"), /MOVED/);
  assert.match(await p.textContent(".diploma-platform"), /prøveplattformen til Molde voksenopplæringssenter/);
  assert.match(await p.textContent(".print-footnote"), /ikke et offisielt resultat/);
  await p.emulateMedia({ media: "print" });
  assert.equal(await p.$eval(".print-banner", e => getComputedStyle(e).display), "block");
  assert.equal(await p.$eval(".result-actions", e => getComputedStyle(e).display), "none");
  await p.emulateMedia({ media: "screen" });
});

await scenario("Prøvemodus: gå tilbake, endre svar, fjerne svar og merke spørsmål", async p => {
  await setup(p, 20, "test"); await p.click("#startBtn");
  await clickOpt(p, 0); await p.click("#flagBtn");
  assert.equal(await p.getAttribute("#flagBtn", "aria-pressed"), "true");
  assert.equal(await p.$eval("#options .option:nth-child(1)", o => o.tabIndex), 0);
  assert.equal(await p.$eval("#options .option:nth-child(2)", o => o.tabIndex), -1);
  await p.focus("#options .option");
  await p.keyboard.press("ArrowDown");
  assert.equal(await p.$eval("#options .option:nth-child(2)", o => o.getAttribute("aria-checked")), "true");
  assert.equal(await p.$eval("#options .option:nth-child(1)", o => o.tabIndex), -1);
  assert.equal(await p.$eval("#options .option:nth-child(2)", o => o.tabIndex), 0);
  await p.click("#nextBtn"); await p.click("#prevBtn");
  assert.ok((await p.$eval("#options .option:nth-child(2)", o => o.classList.contains("selected"))), "valg er husket");
  await clickOpt(p, 0); // klikk igjen fjerner svaret
  assert.equal((await p.$$("#options .option.selected")).length, 0);
  await clickOpt(p, 1);
  await p.click("#overviewBtn");
  assert.equal((await p.$$(".ov-item.flagged")).length, 1);
  assert.equal((await p.$$(".ov-item.answered")).length, 1);
  await p.click("#backToQuizBtn");
  assert.ok(await p.isVisible("#quizScreen"));
});

await scenario("Prøvemodus skjuler antall og sier at det alltid er 38 spørsmål", async p => {
  await p.click('.choice[data-count="40"]');
  await p.click('.mode[data-mode="test"]');
  assert.equal(await p.isVisible("#countSetup"), false, "antall kan ikke velges");
  assert.equal(await p.isVisible("#testExplain"), true);
  const explain = await p.textContent("#testExplain");
  assert.match(explain, /kan ikke velge antall/);
  assert.match(explain, /alltid 38 spørsmål/);
  await p.click("#startBtn");
  assert.equal(await p.evaluate(() => window.__state.items.length), 38);
  assert.equal(await p.textContent("#counter"), "Spørsmål 1 av 38");
});

await scenario("Prøvemodus med tidtaker: automatisk innlevering når tiden er ute", async p => {
  assert.equal(await p.isVisible("#timerSetup"), false, "tidtaker-valg skjult i Øvingsmodus");
  await setup(p, 20, "test");
  assert.equal(await p.isVisible("#countSetup"), false, "antall er fast i prøvemodus");
  assert.equal(await p.isVisible("#timerMinutesWrap"), false, "minutter skjult før tidtaker er valgt");
  await p.check("#useTimer");
  assert.equal(await p.isVisible("#timerMinutesWrap"), true);
  assert.equal(await p.inputValue("#timerMinutes"), "20");
  await p.click("#startBtn");
  assert.match(await p.textContent("#timer"), /^\d\d:\d\d$/);
  await clickOpt(p, await correctIdx(p));
  await p.evaluate(() => { window.__state.timer.endsAt = Date.now() + 1000; });
  await p.waitForSelector("#resultScreen.active", { timeout: 5000 });
  assert.match(await p.textContent("#resultNote"), /levert automatisk/);
  assert.equal(await p.textContent("#correctCount"), "1");
});

await scenario("Prøvemodus uten tidtaker viser ingen tid", async p => {
  await setup(p, 20, "test"); await p.click("#startBtn");
  assert.equal(await p.isVisible("#timer"), false);
});

await scenario("Resultat: navn, dato, per tema, Øv på feilene og utskrift", async p => {
  assert.equal(await p.locator("#studentName").count(), 0);
  await setup(p, 30, "practice"); await p.click("#startBtn");
  for (let i = 0; i < 30; i++) {
    const ci = await correctIdx(p);
    await clickOpt(p, i % 3 === 0 ? [0, 1, 2].find(x => x !== ci) : ci);
    await p.click("#nextBtn");
  }
  assert.match(await p.textContent("#resultSub"), /^\d+\. \w+ 2\d{3} · Øvingsmodus · 30 spørsmål$/);
  assert.equal(await p.textContent("#wrongCount"), "10");
  assert.equal(await p.textContent("#percent"), "66,7%");
  assert.match(await p.textContent("#retryBtn"), /\(10\)/);
  assert.equal(await p.isVisible("#printBtn"), false, "diplom bare i prøvemodus");
  await p.click("#retryBtn");
  assert.equal(await p.textContent("#counter"), "Spørsmål 1 av 10");
  assert.equal(await p.evaluate(() => window.__state.kind), "retry");
  for (let i = 0; i < 10; i++) { await clickOpt(p, await correctIdx(p)); await p.click("#nextBtn"); }
  assert.match(await p.textContent("#resultTitle"), /Repetisjon ferdig/);
  assert.equal(await p.textContent("#percent"), "100%");
  assert.equal(await p.isVisible("#printBtn"), false, "ingen diplom etter øving på feil");
});

await scenario("Ingenting om eleven lagres i nettleseren", async (p, ctx) => {
  await setup(p, 20, "practice"); await p.click("#startBtn");
  for (let i = 0; i < 20; i++) { await clickOpt(p, 0); await p.click("#nextBtn"); }
  const st = await p.evaluate(() => ({ l: localStorage.length, s: sessionStorage.length, c: document.cookie }));
  assert.deepEqual(st, { l: 0, s: 0, c: "" });
  assert.equal((await ctx.cookies()).length, 0);
});

await scenario("Lenker i bunnteksten er understreket, og startknappen får forklaring når tema mangler", async p => {
  const deco = await p.$eval(".site-footer a", e => getComputedStyle(e).textDecorationLine);
  assert.match(deco, /underline/);
  await p.click("#scopeOne");
  assert.equal(await p.getAttribute("#startBtn", "aria-describedby"), "scopeHint");
  assert.equal(await p.isVisible("#scopeHint"), true);
  await p.click("#scopeAll");
  assert.equal(await p.getAttribute("#startBtn", "aria-describedby"), null);
});

await scenario("200 % tekststørrelse uten horisontal rulling", async p => {
  await p.addStyleTag({ content: "html{font-size:200%!important}" });
  const noScroll = () => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  assert.ok(await noScroll(), "startside");
  await setup(p, 20, "practice"); await p.click("#startBtn");
  assert.ok(await noScroll(), "spørsmål");
}, { width: 1280, height: 900 });

await scenario("Ingen horisontal rulling på mobil (360 px) på alle skjermer", async p => {
  const noScroll = () => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  assert.ok(await noScroll(), "startside");
  await setup(p, 20, "test"); await p.check("#useTimer"); assert.ok(await noScroll(), "startside med tidtaker");
  await p.click("#startBtn"); assert.ok(await noScroll(), "spørsmål");
  await p.click("#overviewBtn"); assert.ok(await noScroll(), "oversikt");
  await p.click("#submitBtn"); await p.click("#dlgOk"); assert.ok(await noScroll(), "resultat");
}, { width: 360, height: 740 });


// Universell utforming: axe-core (WCAG 2.1 A og AA) på alle skjermer, i lys og mørk modus
for (const scheme of ["light", "dark"]) {
  await scenario(`Tilgjengelighet (axe, WCAG 2.1 AA) i ${scheme === "light" ? "lys" : "mørk"} modus`, async (p, ctx) => {
    await p.emulateMedia({ colorScheme: scheme });
    const check = async label => {
      await p.addScriptTag({ path: path.join(root, "node_modules/axe-core/axe.min.js") }).catch(() => {});
      const res = await p.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }));
      const v = res.violations.map(x => `${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 2).map(n => n.target.join(" ")).join(", ")}`);
      assert.deepEqual(v, [], `${label}: ${v.join(" | ")}`);
    };
    await check("startside");
    await setup(p, 20, "test"); await p.check("#useTimer"); await check("startside med tidtaker");
    await p.click("#startBtn"); await clickOpt(p, 0); await p.click("#flagBtn"); await check("Prøvemodus-spørsmål");
    await p.click("#overviewBtn"); await check("oversikt");
    await p.click("#submitBtn"); await check("innleveringsdialog");
    await p.click("#dlgOk"); await check("resultat"); await p.click("#reviewBtn"); await check("resultat med gjennomgang");
    await p.click("#restartBtn"); await p.click('.mode[data-mode="practice"]'); await setup(p, 20, "practice"); await p.click("#startBtn");
    await clickOpt(p, 0); await check("Øvingsmodus med tilbakemelding");
  });
}

await browser.close(); server.close();
if (failed) { console.error(`\n${failed} scenario(er) feilet.`); process.exit(1); }
console.log("\nAlle scenarioer bestått.");
