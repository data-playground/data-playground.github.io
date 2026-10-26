const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);const me=G.t[G.me];
let n=0,bad=0,V={},sh=[0,0],ot=[0,0],pos=0,bl={};
for(let i=0;i<38;i++){G.jl=false;G.bc=Math.max(G.bc,50);doRound(false);
 const r=G.res[G.res.length-1],x=r&&r.find(y=>y.h==G.me||y.a==G.me);if(!x){bad++;continue}
 if(!x.rv){bad++;console.log('no rv round',i);continue}
 n++;const rv=x.rv,h=x.h==G.me,gf=h?x.g[0]:x.g[1],ga=h?x.g[1]:x.g[0],res=gf>ga?"W":gf<ga?"L":"D";
 V[res+":"+rv.v]=(V[res+":"+rv.v]||0)+1;sh[0]+=rv.sh[0];sh[1]+=rv.sh[1];ot[0]+=rv.ot[0];ot[1]+=rv.ot[1];pos+=rv.pos;
 rv.B.forEach(b=>{const k=b.t.split(" ").slice(0,3).join(" ");bl[b.k]=(bl[b.k]||0)+1});
 const html=rvHTML(x);if(/undefined|NaN|\[object/.test(html)||/Infinity/.test(html)){bad++;console.log('BAD',html.slice(0,200))}
 if(rv.sh[0]<rv.ot[0]||rv.sh[1]<rv.ot[1]||gf>rv.ot[0]||ga>rv.ot[1]){bad++;console.log('stats inconsistent',JSON.stringify(rv.sh),JSON.stringify(rv.ot),gf,ga)}
 // non-mine results must not keep st/log
 if(r.some(y=>y!==x&&(y.st||y.log)))bad++}
console.log('reviews',n,'bad',bad,'avg shots me/opp',(sh[0]/n).toFixed(1),(sh[1]/n).toFixed(1),'on target',(ot[0]/n).toFixed(1),(ot[1]/n).toFixed(1),'poss',(pos/n).toFixed(0));
console.log(JSON.stringify(V));console.log('bullets',JSON.stringify(bl));
