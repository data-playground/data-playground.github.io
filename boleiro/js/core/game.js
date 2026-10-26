// Starting a game, seasons, the main round loop entry points
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function startGame(sel, me) {
  G = null;
  PID = 0;
  sel = lgList(WS).filter((x) => sel.includes(x.key)).map((x) => x.key);
  const w = buildWorld(sel);
  G = { t: w.t, lg: w.lg, me, season: 1, round: 0, nr: Math.max(...w.lg.map((l) => l.rounds)), cfg: { ms: "league" }, vl: null, pr: { up: [], rel: [], mv: [] }, res: [], goal: 10, live: null, fa: [], news: [], il: [], off: {}, cp: [], cn: [], gn: [], mgl: [], mp: [], of: [], bc: 60, jl: false, mg: { rep: MLV, hist: [], titles: 0, sacked: 0 }, ob: [], neg: null, cool: {}, sk: {} };
  G.lg.forEach((l) => l.fix = mkFix(l));
  prep();
  G.lg.forEach(calTV);
  G.t.forEach((t) => {
    t.pos = t.exp;
    t.ann = estAnn(t);
    t.bud = +(t.ann * 0.3).toFixed(1);
  });
  G.goal = goalFor();
  initSp(G.t[me]);
  G.t.forEach((t) => {
    if (t.id != me) setCo(t, mkCo(t));
  });
  listAI();
  genGoals();
  genOffers();
  autoSave();
  view = "squad";
  SEL = -1;
  render();
}
function newGame(me) {
  startGame(["cos:1"], me);
}
function simSeason() {
  NS = true;
  while (G.round < G.nr && !G.jl) doRound(false);
  NS = false;
  autoSave();
}
function dev(p, t) {
  const ag = p.pos == "GK" ? p.a - 3 : p.a, C = [[19, 4], [20, 3.2], [21, 2.6], [22, 1.8], [23, 1.1], [24, 0.5], [28, 0], [29, -0.3], [30, -0.8], [31, -1.3], [32, -1.9], [33, -2.5], [99, -3.2]];
  let g = C.find(([x]) => ag <= x)[1];
  if (g > 0) g *= cl((p.pot - p.o) / 8, 0, 1.3);
  const sh = p.mn / 3420, pt = (sh - 0.5) * (p.a <= 24 ? 2.4 : 0.8), fb = p.ap >= 8 ? cl((p.rs / p.ap - PB[p.pos]) * 1.5, -1.5, 1.5) : 0;
  if (t) {
    const e = ef(t, "tr");
    g = g > 0 ? g * (1 + (e - 8) * 0.025) : g * (1 - (e - 8) * 0.02);
    {
      const e2 = sf(t, { GK: "gk", DF: "def", MF: "mid", FW: "att" }[p.pos]);
      g = g > 0 ? g * (1 + 0.15 * e2) : g * (1 - 0.1 * e2);
      if (p.a <= 21 && g > 0) g *= 1 + 0.1 * sf(t, "yth");
    }
  }
  return { d: g + pt + fb + (p.mo - 60) * 0.02 + rn(-1, 1), g, pt, fb };
}
const av2 = (p) => !p.inj && !p.sus;
function fixXIold(t) {
  const bad = t.xi.filter((i) => !av2(t.pl[i]));
  t.xi = t.xi.filter((i) => av2(t.pl[i]));
  const pk = (b) => {
    const c = t.pl.map((p, i) => i).filter((i) => av2(t.pl[i]) && !t.xi.includes(i)).sort((x, y) => b ? (t.pl[y].pos == t.pl[b].pos) - (t.pl[x].pos == t.pl[b].pos) || t.pl[y].o - t.pl[x].o : t.pl[y].o - t.pl[x].o);
    if (c.length) t.xi.push(c[0]);
  };
  bad.forEach(pk);
  while (t.xi.length < 11) {
    const n = t.xi.length;
    pk();
    if (t.xi.length == n) break;
  }
}
function endRound() {
  finRound();
  iwPre();
  careerRound();
  if (G.round == 13 || G.round == 26) aiSack(true);
  if (G.round == S1()) aiMarket("Deadline day");
  if (G.round == WM1()) aiMarket("Winter");
  genOffers();
  const R = G.round, gd = restDays();
  G.t.forEach((t) => {
    const pos = t.pos || t.exp, ex = t.exp || pos, e20 = (ex - 1) / (G.lg[t.lg].n - 1) * 19 + 1, pf = e20 <= 4 ? 1.5 : e20 <= 10 ? 1 : e20 <= 16 ? 0.7 : 0.5, wp = 0.3 + 0.7 * Math.min(1, R / 30), dl = ex - pos, td = dl < 0 ? Math.max(-3, dl * 0.35 * pf * wp) : Math.min(3, dl * 0.3 * (e20 > 10 ? 1.3 : 1) * wp);
    t.pl.forEach((p) => {
      const ok = av2(p), ro = ROLE[p.role || "depth"];
      if (!p.pl) {
        if (p.inj > 0) p.inj--;
        if (p.sus > 0) p.sus--;
      }
      if (!p.inj) {
        p.nd = 0;
        p.ni = 0;
      }
      p.ms = (p.ms == null ? ro.x : p.ms) * 0.85 + (p.lm || 0) / 90 * 0.15;
      const gap = p.ms - ro.x;
      let d = td * (td < 0 && p.ms < 0.35 && p.role != "youth" ? 1.7 : td > 0 && p.ms < 0.35 ? 0.6 : 1);
      if (ok) d += gap < 0 ? gap * ro.k : gap * ro.k * 0.3;
      p.mo = cl(p.mo + d + (60 - p.mo) * 0.08, 0, 100);
      p.cd = p.cd + (100 - p.cd) * (1 - Math.pow(1 - (0.5 + ef(t, "tr") * 6e-3 + sf(t, "fit") * 0.05), gd / 7));
      p.pl = 0;
      p.lm = 0;
    });
  });
}
