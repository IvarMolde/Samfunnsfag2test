// Legger XML-banken inn i prototype/page.src.html og skriver prototype/index.html
const fs=require('fs'),path=require('path');
const xml=fs.readFileSync(path.join(__dirname,'../ut/sporsmalsbank_samfunnskunnskap_v1.1.xml'),'utf8').replace(/<\?xml[^>]*\?>\s*/,'');
const src=fs.readFileSync(path.join(__dirname,'../../prototype/page.src.html'),'utf8');
if(!src.includes('__XML__'))throw new Error('Fant ikke __XML__ i page.src.html');
fs.writeFileSync(path.join(__dirname,'../../prototype/index.html'),src.replace('__XML__',()=>xml));
console.log('prototype/index.html skrevet');
