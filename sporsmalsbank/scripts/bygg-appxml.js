// Lager questions.xml i rotmappen (formatet appen leser) fra de 240 spørsmålene med tilbakemelding.
const fs=require('fs'),path=require('path');
const mods=require('../kilde/load.js');
const fb={'Skole og utdanning':require('../kilde/fb_skole.js'),'Arbeidsliv':require('../kilde/fb_arbeid.js'),'Kritisk tenkning og digital dømmekraft':require('../kilde/fb_kritisk.js')};
const slug={'Skole og utdanning':'skole','Arbeidsliv':'arbeid','Kritisk tenkning og digital dømmekraft':'kritisk'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const riktig=["Bra, du svarte riktig!","Korrekt!","Bra jobba!","Riktig, godt gjort!","Helt riktig!","Det stemmer!","Flott, det er riktig!"];
const feil=["Det var ikke helt riktig.","Dette svaret er ikke korrekt.","Nesten, men ikke korrekt.","Ikke helt. Prøv å tenke en gang til.","Dessverre, det er ikke riktig."];
let x='<?xml version="1.0" encoding="UTF-8"?>\n<questionBank title="Samfunnskunnskap – øvingsprøver" language="nb-NO" level="A2" version="2.0">\n  <metadata>\n    <description>240 spørsmål (80 per tema) med tilbakemelding. Det første svaralternativet i filen er alltid riktig; appen stokker rekkefølgen.</description>\n    <sourceNote>Basert på samfunnskunnskap.no. Ikke utprøvd på deltakere. Se docs/OVERSIKT.md.</sourceNote>\n    <openers>\n';
riktig.forEach(t=>x+=`      <opener type="correct">${esc(t)}</opener>\n`);
feil.forEach(t=>x+=`      <opener type="wrong">${esc(t)}</opener>\n`);
x+='    </openers>\n  </metadata>\n';
let n=0;
for(const m of mods){const key=slug[m.tema];const items=m.emner.flatMap(e=>e.items);
 if(fb[m.tema].length!==items.length)throw new Error('antall '+m.tema);
 items.forEach((it,i)=>{n++;
  x+=`  <question id="${key}-${String(i+1).padStart(2,'0')}" category="${esc(m.tema)}">\n    <text>${esc(it[0])}</text>\n    <options>\n`;
  it.slice(1).forEach((s,k)=>{x+=`      <option id="${'ABC'[k]}" correct="${k===0}">${esc(s)}</option>\n`});
  x+=`    </options>\n    <feedback>\n      <correct>${esc(fb[m.tema][i][0])}</correct>\n      <wrong>${esc(fb[m.tema][i][1])}</wrong>\n    </feedback>\n  </question>\n`;});
}
x+='</questionBank>\n';
fs.writeFileSync(path.join(__dirname,'../../questions.xml'),x);console.log('questions.xml:',n,'spørsmål');
