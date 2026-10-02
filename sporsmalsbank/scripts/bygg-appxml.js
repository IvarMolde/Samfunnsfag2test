// Lager questions.xml i rotmappen (formatet appen leser) fra spørsmålene med tilbakemelding.
const fs=require('fs'),path=require('path');
const mods=require('../kilde/load.js');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const riktig=["Bra, du svarte riktig!","Korrekt!","Bra jobba!","Riktig, godt gjort!","Helt riktig!","Det stemmer!","Flott, det er riktig!"];
const feil=["Det var ikke helt riktig.","Dette svaret er ikke korrekt.","Nesten, men ikke korrekt.","Ikke helt. Prøv å tenke en gang til.","Dessverre, det er ikke riktig."];
let x='<?xml version="1.0" encoding="UTF-8"?>\n<questionBank title="Samfunnskunnskap – øvingsprøver" language="nb-NO" level="A2" version="2.0">\n  <metadata>\n    <description>320 spørsmål (80 per underkategori) med tilbakemelding. Hvert spørsmål har main (hovedkategori), category (underkategori) og eventuelt topic (emne). Det første svaralternativet i filen er alltid riktig; appen stokker rekkefølgen.</description>\n    <sourceNote>Basert på samfunnskunnskap.no. Ikke utprøvd på deltakere. Se docs/OVERSIKT.md.</sourceNote>\n    <openers>\n';
riktig.forEach(t=>x+=`      <opener type="correct">${esc(t)}</opener>\n`);
feil.forEach(t=>x+=`      <opener type="wrong">${esc(t)}</opener>\n`);
x+='    </openers>\n  </metadata>\n';
let n=0;
for(const m of mods){const key=m.slug;const items=m.emner.flatMap(e=>e.items);const topics=m.emner.length>1?m.emner.flatMap(e=>e.items.map(()=>e.emne)):[];
 if(m.fb.length!==items.length)throw new Error('antall '+m.tema);
 items.forEach((it,i)=>{n++;
  x+=`  <question id="${key}-${String(i+1).padStart(2,'0')}" main="${esc(m.hoved)}" category="${esc(m.tema)}"${topics.length?` topic="${esc(topics[i])}"`:''}>\n    <text>${esc(it[0])}</text>\n    <options>\n`;
  it.slice(1).forEach((s,k)=>{x+=`      <option id="${'ABC'[k]}" correct="${k===0}">${esc(s)}</option>\n`});
  x+=`    </options>\n    <feedback>\n      <correct>${esc(m.fb[i][0])}</correct>\n      <wrong>${esc(m.fb[i][1])}</wrong>\n    </feedback>\n  </question>\n`;});
}
x+='</questionBank>\n';
fs.writeFileSync(path.join(__dirname,'../../questions.xml'),x);console.log('questions.xml:',n,'spørsmål');
