const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);const me=G.t[G.me];const S=stI();
const setQ=(k,q)=>{S.r[k].q=q;S.r[k].w=stWage(q)};
G.round=1;
function one(q){STR.forEach(([k])=>setQ(k,q));const b=me.bud,sw=me.fn.sw||0;finRound();return [(me.bud-b).toFixed(4),((me.fn.sw||0)-sw).toFixed(4)]}
console.log('finRound bud/sw delta avg',JSON.stringify(one(50)),'elite',JSON.stringify(one(95)),'cheap',JSON.stringify(one(10)));
// injuries bigger sample
function inj(q){setQ("phy",q);let d=0,n=0,tot=0;for(let g=0;g<700;g++){me.pl.forEach(p=>{p.cd=40;p.inj=0});const it=mgen(me,G.t[10+g%6],-1);let r;while(!(r=it.next()).done);me.pl.forEach(p=>{if(p.inj>0){d+=p.inj;n++}})}return [(d/Math.max(1,n)).toFixed(2),n,d]}
console.log('physio lo',JSON.stringify(inj(5)),'avg',JSON.stringify(inj(50)),'hi',JSON.stringify(inj(95)));
