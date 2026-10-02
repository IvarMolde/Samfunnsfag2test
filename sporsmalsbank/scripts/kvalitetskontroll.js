const m=require('../kilde/load.js');let n=0,aL=0,aS=0,seen={},w=[],ws=[];
for(const t of m)for(const e of t.emner)for(const it of e.items){n++;
 if(it.length!==4)console.log('LEN4',it[0]);
 if(seen[it[0].toLowerCase()])console.log('DUP',it[0]);seen[it[0].toLowerCase()]=1;
 const L=it.slice(1).map(s=>s.length),mx=Math.max(...L),mn=Math.min(...L);
 if(L[0]===mx&&L.filter(x=>x===mx).length===1)aL++; if(L[0]===mn&&L.filter(x=>x===mn).length===1)aS++;
 if(mx/mn>1.7)console.log('RATIO',(mx/mn).toFixed(1),it[0],'|',it.slice(1).join(' / '));
 if(L[0]>=Math.max(L[1],L[2])+8)console.log('AXL',L.join('/'),it[0]);
 if(new Set(it.slice(1)).size<3)console.log('DUPOPT',it[0]);
 if(it.slice(1).some(s=>/\.$/.test(s)))console.log('PUNCT',it[0]);
 const sw=it[0].split(/\s+/).length;ws.push(sw);
 for(const o of it.slice(1))w.push(o.split(/\s+/).length);
}
const avg=a=>(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1);
console.log(n,'Alongest',aL,'Ashortest',aS,'stem ord snitt',avg(ws),'maks',Math.max(...ws),'alt ord snitt',avg(w),'maks',Math.max(...w));
