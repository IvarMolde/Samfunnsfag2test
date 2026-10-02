const mods=['a2_skole','a2_arbeid','a2_kritisk','a2_nyinorge'].map(n=>require('./'+n+'.js'));
// Hovedkategori (modul) for hver underkategori. Nye moduler legges til her.
const HOVED={'Skole og utdanning':'Utdanning, kompetanse og arbeidsliv','Arbeidsliv':'Utdanning, kompetanse og arbeidsliv','Kritisk tenkning og digital dømmekraft':'Utdanning, kompetanse og arbeidsliv','Ny i Norge':'Familie, helse og hverdagsliv'};
mods.forEach(m=>{if(!HOVED[m.tema])throw new Error('Mangler hovedkategori for '+m.tema);m.hoved=HOVED[m.tema];});
module.exports=mods;
