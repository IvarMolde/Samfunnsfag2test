// Eneste register over kategoriene. Nye kategorier legges bare til her.
// fil: a2_<fil>.js (spørsmål) og fb_<fil>.js (tilbakemeldinger). slug: prefiks i spørsmåls-ID-ene.
const FAMILIE='Familie, helse og hverdagsliv',UTDANNING='Utdanning, kompetanse og arbeidsliv';
const REGISTER=[
 {fil:'skole',slug:'skole',hoved:UTDANNING},
 {fil:'arbeid',slug:'arbeid',hoved:UTDANNING},
 {fil:'kritisk',slug:'kritisk',hoved:UTDANNING},
 {fil:'nyinorge',slug:'norge',hoved:FAMILIE},
];
const mods=REGISTER.map(r=>{
 const m=require('./a2_'+r.fil+'.js'),fb=require('./fb_'+r.fil+'.js');
 const n=m.emner.reduce((a,e)=>a+e.items.length,0);
 if(fb.length!==n)throw new Error(`${m.tema}: ${n} spørsmål, men ${fb.length} tilbakemeldinger`);
 return Object.assign(m,{slug:r.slug,hoved:r.hoved,fb});
});
if(new Set(mods.map(m=>m.slug)).size!==mods.length)throw new Error('Slug er ikke unik');
module.exports=mods;
