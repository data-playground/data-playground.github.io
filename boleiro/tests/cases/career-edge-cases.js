const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);
G.bc=100;G.jl=false;
// 1. old-save simulation: no ap/oa fields, roundtrip through load()
delete G.ap;delete G.oa;
load(JSON.stringify({v:1,G}));
console.log('old save loaded, ap/oa absent:',G.ap===undefined,G.oa===undefined,'view',view);
console.log('career tab renders:',careerHTML(G.t[G.me]).includes('Apply for jobs'));
// 2. mid-season: force a pressured club and apply as employed manager
for(let i=0;i<12;i++){doRound(false);G.bc=Math.max(G.bc,60)}
const me=G.t[G.me];
const tgt=G.t.filter(t=>t.id!=G.me&&t.co).sort((a,b)=>a.rep-b.rep)[0];
tgt.pos=tgt.exp+5;
const x=appInfo(tgt);console.log('pressured club tag',x.tag,'p',x.p.toFixed(2));
G.mg.rep=95;let got=false;for(let k=0;k<30&&!got;k++){G.ap={};G.of=G.of.filter(i=>i!=tgt.id);applyJob(tgt.id);got=G.of.includes(tgt.id)}
console.log('offer obtained mid-season:',got,'G.oa',JSON.stringify(G.oa));
// 3. offer lapses after 3 rounds
G.t.forEach(t=>t.id!=G.me&&(t.pos=t.exp));
for(let i=0;i<4&&!G.jl;i++){doRound(false);G.bc=Math.max(G.bc,60)}
console.log('offer lapsed after 4 rounds:',!G.of.includes(tgt.id));
// 4. take a mid-season job: rep penalty + log
G.mg.rep=95;G.of=[tgt.id];G.oa[tgt.id]=G.round;const r0=G.mg.rep;takeJob(tgt.id);
console.log('took job:',G.me==tgt.id,'rep',r0,'->',G.mg.rep,'| log:',G.gn[1]);
// 5. sacked flow
sackMe("test",true);
console.log('sacked: jl',G.jl,'offers',G.of.length,'appHTML ok',appHTML().includes('Apply for jobs'));
const vac=G.t.filter(t=>t.id!=G.me).map(t=>({t,x:appInfo(t)})).filter(r=>r.x.p>0);
console.log('applicable clubs while sacked:',vac.length);
if(vac[0]){for(let k=0;k<20&&!G.of.includes(vac[0].t.id);k++){G.ap={};applyJob(vac[0].t.id)}console.log('offer while sacked:',G.of.includes(vac[0].t.id))}
