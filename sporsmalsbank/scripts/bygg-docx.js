const fs=require('fs');
const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,ShadingType,AlignmentType,LevelFormat,BorderStyle}=d;
const mods=require('../kilde/load.js');
let total=0,aL=0,aS=0;
for(const m of mods)for(const e of m.emner)for(const it of e.items){total++;const L=it.slice(1).map(s=>s.length);const mx=Math.max(...L),mn=Math.min(...L);if(L[0]===mx&&L.filter(x=>x===mx).length===1)aL++;if(L[0]===mn&&L.filter(x=>x===mn).length===1)aS++;}
const P=(t,o={})=>new Paragraph({spacing:{after:100},...o,children:Array.isArray(t)?t:[new TextRun(t)]});
const bullet=t=>new Paragraph({numbering:{reference:'b',level:0},spacing:{after:60},children:[new TextRun(t)]});
const bd={style:BorderStyle.SINGLE,size:4,color:'BBBBBB'};const borders={top:bd,bottom:bd,left:bd,right:bd};
const cell=(t,w,h)=>new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:h?{fill:'E8EEF4',type:ShadingType.CLEAR,color:'auto'}:undefined,margins:{top:60,bottom:60,left:100,right:100},children:[new Paragraph({children:[new TextRun({text:String(t),bold:!!h})]})]});
const ch=[];
ch.push(new Paragraph({heading:HeadingLevel.TITLE,children:[new TextRun('Spørsmålsbank – samfunnskunnskap')]}));
ch.push(P(mods.reduce((a,m)=>a+m.emner.reduce((b,e)=>b+e.items.length,0),0)+' flervalgsspørsmål. Det første svaralternativet er alltid riktig.'));
let n=0;
for(const m of mods){
 const c=m.emner.reduce((a,e)=>a+e.items.length,0);
 ch.push(new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun(m.tema+' ('+c+' spørsmål)')]}));
 for(const e of m.emner)for(const it of e.items){
   n++;
   ch.push(new Paragraph({keepNext:true,spacing:{before:180,after:60},children:[new TextRun({text:n+'. '+it[0],bold:true})]}));
   [1,2,3].forEach((i,k)=>ch.push(new Paragraph({keepNext:k<2,indent:{left:420},spacing:{after:30},children:[new TextRun(it[i])]})));
 }
}
const doc=new Document({
 styles:{default:{document:{run:{font:'Calibri',size:22}}},paragraphStyles:[
  {id:'Title',name:'Title',basedOn:'Normal',run:{size:44,bold:true,font:'Calibri'},paragraph:{spacing:{after:200}}},
  {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:34,bold:true,font:'Calibri',color:'1F3864'},paragraph:{spacing:{before:240,after:160},outlineLevel:0}},
  {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:27,bold:true,font:'Calibri',color:'2E5C8A'},paragraph:{spacing:{before:300,after:100},outlineLevel:1}}]},
 numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1304,right:1440,bottom:1304,left:1440}}},children:ch}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(__dirname+'/../ut/Spørsmålsbank_samfunnskunnskap.docx',b);console.log('ok',n)});
