const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);startGame(WSEL.slice(0,2),5);
const me=G.t[G.me];const K=Object.keys(FAC);
const snap=()=>{const ai=G.t.filter(t=>t.id!=G.me);const avg=k=>ai.reduce((a,t)=>a+t.fc[k].lv,0)/ai.length,cd=k=>ai.reduce((a,t)=>a+t.fc[k].cd,0)/ai.length,mx=ai.filter(t=>K.some(k=>t.fc[k].lv>=t.fc[k].max)).length;
 return `S${G.season} me:`+K.map(k=>`${k}${me.fc[k].lv}/${Math.round(me.fc[k].cd)}`).join(' ')+` | AI avg lvl ${(K.reduce((a,k)=>a+avg(k),0)/K.length).toFixed(2)} cd ${(K.reduce((a,k)=>a+cd(k),0)/K.length).toFixed(0)} clubs-at-cap ${mx}`};
console.log(snap());
for(let s=0;s<7;s++){G.jl=false;G.bc=80;while(G.round<G.nr&&!G.jl)doRound(false);rollover();console.log(snap())}
console.log(G.il.slice(0,6).join('\n'));
