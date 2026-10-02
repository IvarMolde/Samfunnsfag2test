// Lager en lesbar md-fil per kategori som har kildelenke per emne. Alternativ A er alltid riktig.
const fs=require('fs'),path=require('path');
const mods=require('../kilde/load.js');
for(const m of mods){if(!m.emner.every(e=>e.kilde))continue;
 const fb=m.fb,n=fb.length;
 let md=`# ${m.tema} (${n} spørsmål)\n\nHovedkategori: ${m.hoved}\n\nKilde: samfunnskunnskap.no, med tilleggskilder der det står. Tre svaralternativer, A er alltid riktig. Nivå A2–B1. Fakta bør kontrolleres av en faglærer mot oppdaterte offentlige kilder.\n\n`;
 let i=0;
 for(const e of m.emner){md+=`\n---\n\n## ${e.emne} (${e.items.length} spørsmål)\n\nKilde: ${e.kilde}\n\n`;
  if(e.tillegg&&e.tillegg.length)md+=`Tilleggskilder: ${e.tillegg.join(', ')}\n\n`;
  e.items.forEach(it=>{md+=`### ${m.slug}-${String(i+1).padStart(2,'0')} · ${it[0]}\n\n- A) ${it[1]} ✔\n- B) ${it[2]}\n- C) ${it[3]}\n\n**Riktig:** ${fb[i][0]}\n\n**Feil:** ${fb[i][1]}\n\n`;i++;});}
 const f=path.join(__dirname,'../ut/'+m.tema.replace(/[^A-Za-zÆØÅæøå]+/g,'_')+'_sporsmal.md');
 fs.writeFileSync(f,md);console.log('md:',path.basename(f),n,'spørsmål');}
