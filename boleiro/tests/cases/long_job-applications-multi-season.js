const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await sleep(1500);
startGame(WSEL.slice(0,2),5);
G.bc=100;G.jl=false;
const st={vac:0,press:0,applies:0,offered:0,rejected:0,taken:0,seasons:0,err:0};
for(let s=0;s<6;s++){
  // mid-season check for pressured clubs
  while(G.round<G.nr&&!G.jl){doRound(false);G.bc=Math.max(G.bc,60);
    if(G.round==20){const c=G.t.filter(t=>t.id!=G.me).map(t=>({t,x:appInfo(t)})).filter(r=>r.x.tag=="Under pressure");st.press+=c.length}}
  if(G.round>=G.nr){ if(s==5)break; rollover(); st.seasons++;
    // offseason: look for vacancies
    const v=G.t.filter(t=>t.id!=G.me).map(t=>({t,x:appInfo(t)})).filter(r=>r.x.tag=="Vacancy");
    st.vac+=v.length;
    const html=appHTML();if(!html.includes("Apply for jobs")){st.err++;console.log("ERR html")};
    // apply to every open club
    v.filter(r=>r.x.p>0).forEach(r=>{const before=G.of.length;applyJob(r.t.id);st.applies++;if(G.of.includes(r.t.id))st.offered++;else st.rejected++});
    // double-apply guard
    const v0=v.find(r=>r.x.p>0);if(v0){const b=G.msg;applyJob(v0.t.id);if(!/already/.test(G.msg||"")){st.err++;console.log("ERR dbl:",v0.x.p,v0.x.done,G.msg)}}
    if(G.of.length&&s%2==0){const id=G.of[0];const old=G.me;takeJob(id);if(G.me==id)st.taken++;else{st.err++;console.log("ERR take")}}
  }
}
console.log(JSON.stringify(st),'rep',Math.round(G.mg.rep),'club',G.t[G.me].name);
console.log(G.gn.slice(0,8).join('\n'));
