// Register over undertema. Et nytt undertema legges til med én linje her, pluss to filer: a2_<fil>.js og fb_<fil>.js.
// slug = id-prefiks i questions.xml (for eksempel "norge-01"). hoved = hovedtema.
const UTDANNING = 'Utdanning, kompetanse og arbeidsliv';
const FAMILIE = 'Familie, helse og hverdagsliv';
const REGISTER = [
  { fil: 'skole',     slug: 'skole',   hoved: UTDANNING },
  { fil: 'arbeid',    slug: 'arbeid',  hoved: UTDANNING },
  { fil: 'kritisk',   slug: 'kritisk', hoved: UTDANNING },
  { fil: 'nyinorge',  slug: 'norge',   hoved: FAMILIE },
];
const mods = REGISTER.map(r => {
  const m = require('./a2_' + r.fil + '.js');
  m.fb = require('./fb_' + r.fil + '.js');
  m.slug = r.slug;
  m.hoved = r.hoved;
  return m;
});
module.exports = mods;
