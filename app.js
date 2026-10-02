let openers={correct:[],wrong:[]}, bank=[], quiz=[], current=0, score=0, mode="practice", selectedCount=20, answers=[];

const $=s=>document.querySelector(s);
const screens={start:$("#startScreen"),quiz:$("#quizScreen"),result:$("#resultScreen")};

async function loadBank(){
  const text=await fetch("questions.xml").then(r=>r.text());
  const doc=new DOMParser().parseFromString(text,"application/xml");
  bank=[...doc.querySelectorAll("question")].map(q=>({
    id:q.getAttribute("id"), category:q.getAttribute("category"),
    text:q.querySelector("text").textContent,
    options:[...q.querySelectorAll("option")].map(o=>({text:o.textContent,correct:o.getAttribute("correct")==="true"})),
    feedbackCorrect:q.querySelector("feedback correct").textContent,
    feedbackWrong:q.querySelector("feedback wrong").textContent
  }));
  openers={
    correct:[...doc.querySelectorAll('opener[type="correct"]')].map(o=>o.textContent),
    wrong:[...doc.querySelectorAll('opener[type="wrong"]')].map(o=>o.textContent)
  };
}
function pick(a,fallback){return a&&a.length?a[Math.floor(Math.random()*a.length)]:fallback}
function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
// Trekker like mange spørsmål fra hvert tema. Rest (n mod antall temaer) fordeles tilfeldig, maks ett ekstra per tema.
function drawBalanced(bank,n){
  const groups={};bank.forEach(q=>(groups[q.category]=groups[q.category]||[]).push(q));
  const cats=Object.keys(groups),k=cats.length;
  const base=Math.floor(n/k),extra=n-base*k;
  const bonus=new Set(shuffle(cats).slice(0,extra));
  const picked=cats.flatMap(c=>shuffle(groups[c]).slice(0,base+(bonus.has(c)?1:0)));
  return shuffle(picked);
}
function start(){
  const name=$("#studentName").value.trim();
  quiz=drawBalanced(bank,selectedCount).map(q=>{
    const opts=shuffle(q.options).map((o,i)=>({...o,letter:String.fromCharCode(65+i)}));
    return {...q,options:opts};
  });
  current=0;score=0;answers=[];window.studentName=name;
  screens.start.classList.remove("active");screens.quiz.classList.add("active");screens.result.classList.remove("active");
  renderQuestion();
}
function renderQuestion(){
  const q=quiz[current];
  $("#counter").textContent=`${current+1} av ${quiz.length}`;
  $("#progressBar").style.width=`${((current)/quiz.length)*100}%`;
  $("#category").textContent=q.category;
  $("#scoreLive").textContent=mode==="practice"?`${score} riktige`:"";
  $("#questionText").textContent=q.text;
  $("#feedback").hidden=true;$("#feedback").className="feedback";
  $("#nextBtn").disabled=true;
  $("#nextBtn").innerHTML=current===quiz.length-1?"Se resultat <span>→</span>":"Neste <span>→</span>";
  const box=$("#options");box.innerHTML="";
  q.options.forEach((o,i)=>{
    const b=document.createElement("button");b.className="option";b.dataset.i=i;
    b.innerHTML=`<span class="letter">${o.letter}</span><span>${o.text}</span>`;
    b.onclick=()=>choose(i);box.appendChild(b);
  });
}
function choose(i){
  const q=quiz[current], picked=q.options[i];
  if(answers[current])return;
  answers[current]={picked:picked.text,correct:picked.correct,correctText:q.options.find(x=>x.correct).text};
  if(picked.correct)score++;
  [...$("#options").children].forEach((b,idx)=>b.disabled=true);
  [...$("#options").children][i].classList.add(picked.correct?"correct":"wrong");
  if(mode==="practice"){
    const correctIdx=q.options.findIndex(x=>x.correct);
    if(correctIdx>=0)[...$("#options").children][correctIdx].classList.add("correct");
    $("#feedback").hidden=false;$("#feedback").className=`feedback ${picked.correct?"correct":"wrong"}`;
    const opener=picked.correct?pick(openers.correct,"Riktig!"):pick(openers.wrong,"Ikke riktig.");
    $("#feedback").innerHTML=`<strong>${picked.correct?"✓":"✕"} ${opener}</strong><br>${picked.correct?q.feedbackCorrect:q.feedbackWrong}`;
  }
  $("#nextBtn").disabled=false;$("#scoreLive").textContent=mode==="practice"?`${score} riktige`:"";
}
function next(){
  if(!answers[current])return;
  current++;
  if(current<quiz.length)renderQuestion();else showResult();
}
function showResult(){
  screens.quiz.classList.remove("active");screens.result.classList.add("active");
  const total=quiz.length,pct=Math.round(score/total*1000)/10,passed=pct>=80;
  $("#resultTitle").textContent=passed?"Du har bestått!":"Du har ikke bestått denne gangen.";
  $("#resultSub").textContent=window.studentName?`${window.studentName} · ${total} spørsmål`:`${total} spørsmål`;
  $("#percent").textContent=`${pct}%`;$("#correctCount").textContent=score;$("#wrongCount").textContent=total-score;$("#totalCount").textContent=total;
  $("#scoreCircle").style.borderColor=passed?"#bde4d0":"#f0c9cd";
  buildReview();
}
function buildReview(){
  const box=$("#review");box.innerHTML="<h2>Gjennomgang</h2>";
  quiz.forEach((q,i)=>{
    const a=answers[i];const div=document.createElement("div");div.className=`review-item ${a.correct?"correct":"wrong"}`;
    div.innerHTML=`<strong>${i+1}. ${q.text}</strong><div class="review-answer">Ditt svar: ${a.picked}</div>${a.correct?"":`<div class="review-answer">Riktig svar: ${a.correctText}</div>`}`;
    box.appendChild(div);
  });
}
document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedCount=+b.dataset.count});
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{document.querySelectorAll(".mode").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");mode=b.dataset.mode});
$("#startBtn").onclick=start;$("#nextBtn").onclick=next;
$("#quitBtn").onclick=()=>{if(confirm("Vil du avslutte testen? Fremgangen blir ikke lagret.")){screens.quiz.classList.remove("active");screens.start.classList.add("active")}};
$("#restartBtn").onclick=()=>{screens.result.classList.remove("active");screens.start.classList.add("active")};
$("#printBtn").onclick=()=>window.print();
$("#reviewBtn").onclick=()=>{$("#review").classList.toggle("open");$("#reviewBtn").textContent=$("#review").classList.contains("open")?"Skjul gjennomgang":"Se gjennom svar"};
loadBank().catch(err=>{console.error(err);alert("Kunne ikke laste spørsmålsbanken. Kontroller at questions.xml ligger i samme mappe som index.html.")});
