const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);startGame(WSEL.slice(0,2),5);
const me=G.t[G.me];me.bud=90;
// ---- part 1: sell one, loan one
MFt={pos:"ALL",st:"any",min:0,so:"o"};marketHTML2(me);
const ix=MK.findIndex(x=>x.s&&x.s.pl.length<=24&&x.p.o<=me.pl.slice().sort((a,b)=>b.o-a.o)[2].o&&cnt(x.s,x.p.pos)>MNH[x.p.pos]+1);const x=MK[ix];
startBuy(ix,false);
const cand=me.pl.filter(p=>p.pos==x.p.pos&&p.ln==null).sort((a,b)=>a.o-b.o).slice(0,2);
cand.forEach(p=>npx(p.id));npx(cand[1].id); // second one -> loan
console.log('px',G.neg.px.length,'pm',JSON.stringify(G.neg.pm),'credits',cand.map((p,i)=>xC(p,G.neg,x.s).toFixed(2)).join(' '),'html ok',!/undefined|NaN/.test(negCard('fee')));
const b0=me.bud;nOffer(true);console.log('terms',G.neg&&G.neg.k,JSON.stringify(G.neg&&G.neg.ex));
nOffer(true);console.log(SVM||G.msg);
console.log('p0 sold:',x.s.pl.includes(cand[0]),'ln',cand[0].ln,'| p1 on loan at seller:',x.s.pl.includes(cand[1]),'ln',cand[1].ln===me.id,'bud',b0,'->',me.bud.toFixed(2));
// ---- part 2: AI exchange offers
G.ob=[];let withX=0,tot=0;const me2=G.t[G.me];me2.pl.forEach(p=>{p.ls="S"});
for(let i=0;i<40;i++){G.ob=[];genOffers();G.ob.forEach(o=>{tot++;if(o.xp)withX++})}
console.log('offers',tot,'with player',withX);
G.ob=[];for(let i=0;i<30&&!G.ob.some(o=>o.xp);i++)genOffers();
const o=G.ob.find(o=>o.xp);if(o){const html=offersCard();console.log('card ok',!/undefined|NaN/.test(html),html.includes('+ '));const b=G.t[o.from],xo=fp(o.xp).p,mine=fp(o.pid).p;const n0=me2.pl.length,bb=me2.bud,bB=b.bud;
 console.log('offer',mine.n,'fee',o.fee,'xv',o.xv,'ex',xo.n,xo.pos,xo.o);ofAccept(o.id);console.log(SVM||G.msg,'| squad',n0,'->',me2.pl.length,'| me has xo',me2.pl.includes(xo),'b has mine',b.pl.includes(mine),'| bud',bb.toFixed(2),'->',me2.bud.toFixed(2),'expected net',(o.fee-o.xv).toFixed(2),'| their bud',bB.toFixed(2),'->',b.bud.toFixed(2))}
