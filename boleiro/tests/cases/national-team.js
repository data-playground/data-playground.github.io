const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);ensureNat();
const nats=competes(natMap()).sort((a,b)=>eloOf(b).e-eloOf(a).e);
for(const n of [nats[0],nats[10],nats[40]]){let q=0,pts=0,N=30;
 G.nm={n,f:"4-3-3",sty:"balanced",pl:{},hist:[]};
 for(let i=0;i<N;i++){G.tq=null;G.season=1;tqEnsure();tqFinalize();q+=G.tq.q?1:0;pts+=G.tq.st[n].Pts}
 console.log(n,eloOf(n).e,'qualified',q+'/'+N,'avg pts',(pts/N).toFixed(1),'xi',ntStr(ntXI(ntSel(natMap()[n]))).toFixed(1))}
