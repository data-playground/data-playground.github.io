const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);
let seen={},bad=0,orient=0,n=0;
for(let i=0;i<150&&G.season<3;i++){G.bc=100;G.jl=false;doRound(false);
 for(const c of Object.values(cups())){for(const v of [c.nid]){G.cv=v;try{const h=cupHTML(G.t[G.me]);if(/undefined|NaN|\[object/.test(h)){bad++;console.log('BAD',v,i)}
  if(h.includes('Two legs'))seen.legs=1;if(h.includes('Winners'))seen.win=1;if(h.includes('Byes'))seen.bye=1;if(h.includes('Knocked out'))seen.out=1;if(h.includes('Still in'))seen.in=1}catch(e){bad++;console.log('EXC',v,i,e.message)}}
  for(const t of (c.ties||[]).concat((c.hist||[]).flatMap(x=>x.ties))){if(t.r1&&t.r2){n++;const a=t.r1.h==t.a?t.r1.g[0]:t.r1.g[1],b=t.r2.a==t.a?t.r2.g[0]:t.r2.g[1];}}}}
console.log('seen',JSON.stringify(seen),'bad',bad,'ties',n,'season',G.season);
// old save: no G.ch
delete G.ch;G.cv=undefined;console.log('old save ok',cupHTML(G.t[G.me]).length>500);
