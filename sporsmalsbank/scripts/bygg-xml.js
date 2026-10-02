const fs=require('fs');const mods=require('../kilde/load.js');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const riktig=["Bra, du svarte riktig!","Korrekt!","Bra jobba!","Riktig, godt gjort!","Helt riktig!","Det stemmer!","Flott, det er riktig!"];
const feil=["Det var ikke helt riktig.","Dette svaret er ikke korrekt.","Nesten, men ikke korrekt.","Ikke helt. Prøv å tenke en gang til.","Dessverre, det er ikke riktig."];
let x='<?xml version="1.0" encoding="UTF-8"?>\n<sporsmalsbank sprak="nb" niva="A2" antallSvar="3" versjon="1.1">\n  <tilbakemeldingsmaler>\n';
riktig.forEach(t=>x+=`    <apning type="riktig">${esc(t)}</apning>\n`);
feil.forEach(t=>x+=`    <apning type="feil">${esc(t)}</apning>\n`);
x+='  </tilbakemeldingsmaler>\n';
let n=0;
for(const m of mods){const key=m.slug,fb=m.fb;const items=m.emner.flatMap(e=>e.items);const topics=m.emner.length>1?m.emner.flatMap(e=>e.items.map(()=>e.emne)):[];
 x+=`  <kategori hovedkategori="${esc(m.hoved)}" navn="${esc(m.tema)}" antall="${items.length}">\n`;
 items.forEach((it,i)=>{n++;
  x+=`    <sporsmal id="${key}-${String(i+1).padStart(2,'0')}"${topics.length?` emne="${esc(topics[i])}"`:''}>\n      <tekst>${esc(it[0])}</tekst>\n`;
  it.slice(1).forEach((s,k)=>{x+=`      <svar${k===0?' riktig="true"':''}>${esc(s)}</svar>\n`});
  x+=`      <tilbakemelding>\n        <riktig>${esc(fb[i][0])}</riktig>\n        <feil>${esc(fb[i][1])}</feil>\n      </tilbakemelding>\n    </sporsmal>\n`;});
 x+='  </kategori>\n';}
x+='</sporsmalsbank>\n';
fs.writeFileSync(__dirname+'/../ut/sporsmalsbank_samfunnskunnskap_v1.1.xml',x);console.log(n);
