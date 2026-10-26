const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
console.log('FW',!!FW,'WSEL',WSEL.join(','));
startGame(WSEL.slice(0,2),5);
console.log('started',G.t[G.me].name,'clubs',G.t.length,'leagues',G.lg.length,'rep',G.mg.rep,'nr',G.nr);
G.bc=100;G.jl=false;
const ai=G.t.filter(t=>t.id!=G.me).map(t=>appInfo(t));
console.log('tags',JSON.stringify(ai.reduce((a,x)=>{a[x.tag]=(a[x.tag]||0)+1;return a},{})));
console.log('careerHTML has section',careerHTML(G.t[G.me]).includes('Apply for jobs'));
