const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);startGame(WSEL.slice(0,2),5);
const me=G.t[G.me];G.jl=false;G.bc=80;let fired=0,tot=0,ex=[];
while(G.round<G.nr&&!G.jl){const m=congest(me);tot++;if(m){fired++;if(ex.length<3)ex.push('R'+G.round+': '+m)}const a=assist(me);if(/undefined|NaN/.test(a))console.log('BAD');doRound(false)}
console.log('fired',fired,'of',tot,'rounds');ex.forEach(x=>console.log(x));
