// Lager en lesbar md-fil per kategori som har emner (nå: Ny i Norge). Alternativ A er alltid riktig.
const fs=require('fs'),path=require('path');
const mods=require('../kilde/load.js');
const fbs={'Ny i Norge':require('../kilde/fb_nyinorge.js')};
for(const m of mods){const fb=fbs[m.tema];if(!fb)continue;
 const n=m.emner.reduce((a,e)=>a+e.items.length,0);
 let md=`# ${m.tema} (${n} spørsmål)\n\nHovedkategori: ${m.hoved}\n\nKilde: samfunnskunnskap.no. Tre svaralternativer, A er alltid riktig. Nivå A2. Fakta bør kontrolleres av en faglærer mot oppdaterte offentlige kilder (UDI, Nav, Udir).\n\n`;
 let i=0;
 for(const e of m.emner){md+=`\n---\n\n## ${e.emne} (${e.items.length} spørsmål)\n\nKilde: ${e.kilde}\n\n`;
  e.items.forEach((it,j)=>{md+=`### ${String(i+1).padStart(2,'0')} · ${it[0]}\n\n- A) ${it[1]} ✔\n- B) ${it[2]}\n- C) ${it[3]}\n\n**Riktig:** ${fb[i][0]}\n\n**Feil:** ${fb[i][1]}\n\n`;i++;});}
 const f=path.join(__dirname,'../ut/'+m.tema.replace(/[^A-Za-zÆØÅæøå]+/g,'_')+'_sporsmal.md');
 fs.writeFileSync(f,md);console.log('md:',path.basename(f),n,'spørsmål');}
