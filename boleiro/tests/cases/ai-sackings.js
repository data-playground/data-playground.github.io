const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);startGame(WSEL.slice(0,2),5);
const ev=[];const oc=cnews;
cnews=x=>{ev.push(`S${G.season} ${x}`);oc(x)};
let sk=0,re=0,tot=0;
for(let s=0;s<6;s++){G.jl=false;G.bc=80;while(G.round<G.nr&&!G.jl)doRound(false);rollover()}
const last={};ev.forEach(e=>{let m=e.match(/^S(\d+) (.+) sack (.+) \(/);if(m){last[m[2]]=[m[3],m[1]];tot++;return}m=e.match(/^S(\d+) (.+) appoint (.+)\.$/);if(m&&last[m[2]]&&last[m[2]][0]==m[3]){re++;console.log('REHIRE',e,'| sacked in S'+last[m[2]][1])}});
console.log('sacks',tot,'rehires same club',re);
// also coach pool stats
console.log('pool',G.cp.length,G.cp.map(c=>c.n+':'+c.ex).slice(0,6).join(' '));
{const sacked={};let same=0,quick=0,hires=0,fresh=0;ev.forEach(e=>{let m=e.match(/^S(\d+) (.+) sack (.+) \(/);if(m){sacked[m[3]]={s:+m[1],t:m[2]};return}m=e.match(/^S(\d+) (.+) appoint (.+)\.$/);if(m){hires++;const k=sacked[m[3]];if(k){if(k.s==+m[1])same++;else quick++}else fresh++}});console.log('hires',hires,'hired-in-the-season-they-were-sacked',same,'later seasons',quick,'brand new',fresh)}
