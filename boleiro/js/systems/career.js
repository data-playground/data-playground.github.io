// Manager career: reputation, sackings, job offers, applying
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function waitRound() {
  if (!G.jl || busy || G.round >= G.nr) return;
  const o = G.of.slice();
  doRound(false, true);
  mkOffers();
  G.of = [...new Set([...o, ...G.of])].slice(0, 6);
  render();
}
function waitSeason() {
  if (!G.jl || busy) return;
  NS = true;
  while (G.jl && G.round < G.nr) {
    const o = G.of.slice();
    doRound(false, true);
    mkOffers();
    G.of = [...new Set([...o, ...G.of])].slice(0, 6);
  }
  NS = false;
  autoSave();
  render();
}
function careerRound() {
  if (G.jl) return;
  const me = G.t[G.me], R = G.round, r = G.res[R - 1], x = r && r.find((y) => y.h == G.me || y.a == G.me);
  if (!x) return;
  const my = x.h == G.me ? x.g[0] : x.g[1], op = x.h == G.me ? x.g[1] : x.g[0], pts = my > op ? 3 : my == op ? 1 : 0;
  G.mp[R - 1] = pts;
  if (R == 1) {
    G.of = [];
    G.oa = {};
  }
  if (G.oa) for (const k in G.oa) {
    if (R - G.oa[k] > 3) {
      G.of = G.of.filter((x2) => x2 != +k);
      delete G.oa[k];
    }
  }

  const ep = epOf(me);
  {
    const pm = pmI();
    G.bc = cl(G.bc + (pm.im - 50) * 0.01, 0, 100);
    pm.im += (50 - pm.im) * 0.03;
  }
  G.bc = cl(G.bc + (pts - ep) * 2.2, 0, 100);
  if (R >= 8) G.bc = cl(G.bc + cl((G.goal - (me.pos || me.exp)) * 0.09 * Math.min(1, R / 30), -1, 0.5), 0, 100);
  G.mgl.forEach((g) => {
    if (g.res) return;
    if (g.kind == "derby" && g.rd == R - 1) {
      g.res = my > op ? "met" : my == op ? "draw" : "failed";
      G.bc = cl(G.bc + (g.res == "met" ? 7 : g.res == "failed" ? -7 : 0), 0, 100);
      glog(`${g.text}: ${g.res == "met" ? "won" : g.res == "draw" ? "drawn" : "lost"}.`);
    } else if (g.kind == "run" && g.to == R - 1) {
      g.got = G.mp.slice(g.from, g.to + 1).reduce((a, b) => a + (b || 0), 0);
      g.res = g.got >= g.need ? "met" : "failed";
      G.bc = cl(G.bc + (g.res == "met" ? 5 : -5), 0, 100);
      glog(`${g.text}: ${g.got} points, ${g.res == "met" ? "target met" : "target missed"}.`);
    }
  });
  if (R >= 8 && G.bc < 8) sackMe("The board has lost patience.", true);
}
function sackMe(msg, nr) {
  G.jl = true;
  G.mg.sacked++;
  G.mg.rep = cl(G.mg.rep - 8, 5, 100);
  glog(`sacked by ${G.t[G.me].name}. ${msg}`);
  G.msg = `You have been sacked by ${G.t[G.me].name}. ${msg}`;
  mkOffers();
  view = "career";
}
function careerEnd() {
  const me = G.t[G.me], mg = G.mg;
  G.t.forEach((t) => {
    t.sk = false;
  });
  if (!G.jl) {
    const pos = me.fp, met = pos <= G.goal;
    mg.rep = cl(mg.rep + cl((me.exp - pos) * 0.5 + (met ? 3 : -2) + (pos == 1 ? 5 : 0), -10, 12), 5, 100);
    mg.hist.push({ s: G.season, c: me.name, p: pos, g: G.goal, m: met, r: Math.round(mg.rep) });
    if (pos == 1) mg.titles++;
    G.bc = cl(G.bc + (met ? 10 : -(pos - G.goal) * 3), 0, 100);
    if (G.pr.rel.includes(me.id)) {
      G.bc = cl(G.bc - 12, 0, 100);
      glog("relegated.");
    } else if (G.pr.up.includes(me.id)) {
      G.bc = cl(G.bc + 8, 0, 100);
      mg.rep = cl(mg.rep + 3, 5, 100);
      glog("promoted.");
    }
    if (me.bud < 0) {
      G.bc = cl(G.bc - Math.min(15, 3 - me.bud * 0.4), 0, 100);
      glog(`finished the season in debt (${fm1(me.bud)}).`);
    }
    glog(`${met ? "met" : "missed"} the board's target (${pos}º, target top ${G.goal}).`);
    if (!met && G.bc < 25) sackMe("The board is unhappy with the season.", true);
    else G.bc = 60 + (G.bc - 60) * 0.6;
  }
  aiSack(false);
}
function mkOffers() {
  const me = G.t[G.me], lim = limOf(G.mg.rep), ok = (t) => t.id != G.me && t.rep <= lim;
  let c = G.t.filter((t) => ok(t) && t.sk);
  const last = G.mg.hist[G.mg.hist.length - 1];
  if (!G.jl && last && last.m) c = [...c, ...G.t.filter((t) => ok(t) && t.rep > me.rep && !c.includes(t) && Math.random() < 0.35)];
  if (G.jl && c.length < 3) c = [...c, ...G.t.filter((t) => ok(t) && !c.includes(t)).sort((a, b) => a.rep - b.rep).slice(0, 3 - c.length)];
  G.of = c.slice(0, 5).map((t) => t.id);
}
function takeJob(id) {
  const old = G.t[G.me], nw = G.t[id];
  if (!nw || G.of.indexOf(id) < 0) return;
  G.st = null;
  if (!G.jl && G.round > 0 && G.round < G.nr) {
    G.mg.rep = cl(G.mg.rep - 2, 5, 100);
    glog(`left ${old.name} in the middle of the season.`);
  }
  old.sp = [];
  if (nw.co) {
    nw.co.rep = Math.max(20, nw.co.rep - 3);
    nw.co.ex = nw.id;
    G.cp.push(nw.co);
    cnews(`${nw.name} dismiss ${nw.co.n} to appoint you.`);
    nw.co = null;
  }
  G.me = id;
  G.vl = null;
  hireFor(old);
  initSp(nw);
  fixXI(nw);
  G.of = [];
  G.oa = {};
  G.bc = 60;
  G.jl = false;
  G.off = {};
  G.goal = goalFor();
  genGoals();
  glog(`you take charge of ${nw.name}.`);
  G.msg = "";
  view = "squad";
  autoSave();
  render();
}
let APL = -1, APO = true;
const reqRep = (t) => t.rep <= 56 ? 0 : (t.rep - 45) / 0.55;
function appInfo(t) {
  const mg = G.mg;
  G.ap = G.ap || {};
  if (t.id == G.me) return null;
  const open = !!t.sk && (G.jl || G.round < 1), pos = t.pos || t.exp, press = !!t.co && G.round >= 8 && pos - t.exp >= 3, d = mg.rep - reqRep(t), last = mg.hist[mg.hist.length - 1];
  let p = 0, tag = "Settled";
  if (open) {
    p = 0.5 + d * 0.03;
    tag = "Vacancy";
  } else if (press) {
    p = (0.35 + d * 0.02) * (t.co.rep > mg.rep + 10 ? 0.5 : 1);
    tag = "Under pressure";
  }
  if (open || press) {
    if (p <= 0) {
      p = 0;
      tag = "Out of reach";
    } else {
      if (last && last.m) p += 0.06;
      if (G.jl) p -= 0.05;
      p = cl(p, 0.02, 0.92);
    }
  }
  return { p, tag, d, done: G.ap[t.id] === G.season, off: G.of.includes(t.id) };
}
function applyJob(id) {
  if (busy) return;
  const t = G.t[id];
  if (!t) return;
  G.ap = G.ap || {};
  G.oa = G.oa || {};
  const x = appInfo(t);
  if (!x || x.p <= 0) return note(`${t.name} are not looking for a manager.`);
  if (x.done) return note(`You have already applied to ${t.name} this season.`);
  if (x.off) return note(`${t.name} have already offered you the job.`);
  G.ap[id] = G.season;
  let ex = "";
  if (!G.jl && Math.random() < 0.12) {
    G.bc = cl(G.bc - 6, 0, 100);
    glog(`word got out that you applied to ${t.name}; the board lost some confidence.`);
    ex = " Word got out that you applied elsewhere and your board is not pleased.";
  }
  if (Math.random() < x.p) {
    G.of = [...G.of, id];
    G.oa[id] = G.round;
    glog(`applied to ${t.name}: they offered you the job.`);
    note(`${t.name} liked your application and are offering you the job. You can take it from the list of interested clubs.${ex}`);
  } else {
    glog(`applied to ${t.name}: turned down.`);
    note(`${t.name} chose another candidate.${ex}`);
  }
}
