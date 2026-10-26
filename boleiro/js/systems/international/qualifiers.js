// Qualifying groups and manager reputation from national results
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function ntRep(label, sd) {
  const sc = label == "Champions" ? 6 : label == "Runners-up" ? 4 : /semi/.test(label) ? 3 : /quarter/.test(label) ? 2 : /round of/.test(label) ? 1 : label == "Did not qualify" ? -1 : 0, e = 3 - 3 * sd;
  let ch = label == "Did not qualify" ? -(1 + (sd < 0.34 ? 1.5 : 0)) : cl((sc - e) * 1.1, -3, 9);
  if (label == "Champions") ch = Math.max(ch, 4);
  ch = +ch.toFixed(1);
  const mg = G.mg;
  mg.rep = cl(mg.rep + ch, 5, 100);
  if (label == "Champions") mg.nt = (mg.nt || 0) + 1;
  return ch;
}
const TQF = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]], [[1, 0], [3, 2]], [[2, 0], [3, 1]], [[3, 0], [2, 1]]];
const tqU = (k) => Math.round([0, 0.14, 0.28, 0.42, 0.62, 0.8][k] * (G.nr || 38));
function tqEnsure() {
  const N = G.nm;
  if (!N || G.season % 2 == 0 || !G.lg) return;
  ensureNat();
  const nx = G.season + 1, ck = NMC[confOf(N.n)], k = nx % 4 == 0 ? "wc" : ck || "wc";
  if (G.tq && G.tq.nx == nx) return;
  const nats = competes(natMap());
  if (!nats.includes(N.n)) return;
  const p0 = nats.filter((n) => confOf(n) == confOf(N.n)), pool = (p0.length >= 8 ? p0 : nats).slice().sort((a, b) => eloOf(b).e - eloOf(a).e), r = pool.indexOf(N.n), sz = Math.ceil(pool.length / 4), pot = (i) => Math.floor(i / sz), my = pot(r);
  const grp = [N.n];
  [0, 1, 2, 3].filter((j) => j != my).forEach((j) => {
    const c = pool.filter((x, i) => pot(i) == j && x != N.n && !grp.includes(x));
    if (c.length) grp.push(pick(c));
  });
  while (grp.length < 4) {
    const c = pool.filter((x) => !grp.includes(x));
    if (!c.length) return;
    grp.push(pick(c));
  }
  const st = {};
  grp.forEach((n) => st[n] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 });
  G.tq = { k, nx, y: 2026 + nx, name: TD[k].name, grp, st, md: 0, mine: [], sus: {}, inj: {}, fit: {}, tg: {}, done: 0, q: null, pos: null, sd: r / Math.max(1, pool.length - 1) };
}
const tqRank = (t) => t.grp.slice().sort((a, b) => t.st[b].Pts - t.st[a].Pts || t.st[b].GF - t.st[b].GA - (t.st[a].GF - t.st[a].GA) || t.st[b].GF - t.st[a].GF);
function tqOthers(t, mine) {
  const NM = natMap(), M = idMap(), W = { rs: [] }, xs = {}, out = [];
  TG = null;
  TQF[t.md].forEach((p) => {
    if (p === mine) return;
    const a = t.grp[p[0]], b = t.grp[p[1]];
    [a, b].forEach((n) => {
      if (!xs[n]) xs[n] = ntXI(ntSel(NM[n] || []));
    });
    const [ga, gb] = iwMatchSim(W, M, a, b, xs);
    out.push({ p, ga, gb });
  });
  return out;
}
function tqTeams(t, mine) {
  const N = G.nm, home = mine[0] == 0, opp = t.grp[home ? mine[1] : mine[0]], U = ntTeam(N.n, true, t), O = ntTeam(opp, false), H = home ? U : O, A = home ? O : U;
  H.id = -1;
  A.id = -2;
  XT = [H, A];
  return { H, A, home };
}
function tqApply(t, res) {
  res.forEach((r) => {
    const A = t.st[t.grp[r.p[0]]], B = t.st[t.grp[r.p[1]]];
    A.P++;
    B.P++;
    A.GF += r.ga;
    A.GA += r.gb;
    B.GF += r.gb;
    B.GA += r.ga;
    if (r.ga > r.gb) {
      A.W++;
      A.Pts += 3;
      B.L++;
    } else if (r.ga < r.gb) {
      B.W++;
      B.Pts += 3;
      A.L++;
    } else {
      A.D++;
      B.D++;
      A.Pts++;
      B.Pts++;
    }
  });
  t.md++;
  if (t.md >= 6) tqFinish(t);
}
function tqEnd(t, mine, x, H, A, oth) {
  const N = G.nm, home = mine[0] == 0, a = t.grp[mine[0]], b = t.grp[mine[1]];
  tpWb(H, A, t);
  tpElo(a, b, x.g[0], x.g[1]);
  t.mine.push({ md: t.md, opp: home ? b : a, home, gf: home ? x.g[0] : x.g[1], ga: home ? x.g[1] : x.g[0] });
  XT = [];
  tqApply(t, [{ p: mine, ga: x.g[0], gb: x.g[1] }].concat(oth));
}
function tqStep() {
  const t = G.tq;
  if (!t || t.done || t.md >= 6) return;
  const mine = TQF[t.md].find((p) => p.includes(0)), T = tqTeams(t, mine), oth = tqOthers(t, mine), x = play(T.H, T.A);
  tqEnd(t, mine, x, T.H, T.A, oth);
}
function tqFinish(t) {
  const N = G.nm, r = tqRank(t);
  t.pos = r.indexOf(N.n) + 1;
  t.q = t.pos <= 2;
  t.done = 1;
  G.ilog = [`Qualifying for the ${t.y} ${t.name}: ${N.n} finished ${t.pos}${["st", "nd", "rd", "th"][Math.min(3, t.pos - 1)]} in the group, ${t.q ? "qualified" : "not qualified"}.`].concat(G.ilog || []).slice(0, 8);
}
function tqFinalize() {
  const t = G.tq;
  let n = 0;
  while (t && !t.done && t.md < 6 && n++ < 8) tqStep();
}
function tqCatch() {
  tqEnsure();
  const t = G.tq;
  let n = 0;
  while (t && !t.done && t.md < 5 && G.round >= tqU(t.md + 1) && n++ < 8) tqStep();
}
function tqVerdict(k, ys) {
  const t = G.tq, N = G.nm;
  G.tq = null;
  if (!t || t.nx != ys || !t.done) return true;
  if (!t.q) {
    const rc = ntRep("Did not qualify", t.sd);
    N.hist = (N.hist || []).concat([{ y: 2026 + ys, name: TD[k].name, stage: "Did not qualify", rc }]);
    G.ilog = [`${N.n} did not qualify for the ${2026 + ys} ${TD[k].name} (manager reputation ${rc}).`].concat(G.ilog || []).slice(0, 8);
  }
  return !!t.q;
}
function tqExclude(f, nats) {
  const n = G.nm.n;
  if (!f.includes(n)) return f;
  const o = nats.filter((x) => !f.includes(x) && x != n).sort((a, b) => eloOf(b).e - eloOf(a).e);
  return f.map((x) => x == n ? o[0] || x : x);
}
function tqPlay(live) {
  const t = G.tq;
  if (!t || t.done || busy || t.md >= 6 || G.round < tqU(t.md)) return;
  const mine = TQF[t.md].find((p) => p.includes(0)), T = tqTeams(t, mine), H = T.H, A = T.A, oth = tqOthers(t, mine);
  if (!live) {
    const x = play(H, A);
    tqEnd(t, mine, x, H, A, oth);
    autoSave();
    return;
  }
  const shown = oth.map((o) => tpFake({ a: t.grp[o.p[0]], b: t.grp[o.p[1]], ga: o.ga, gb: o.gb })), it = mgen(H, A, T.home ? 0 : 1);
  busy = true;
  PZ = false;
  LP = 0;
  PS = { k: null, b: null };
  ADS = {};
  ADN = {};
  ADV = [];
  view = "match";
  G.mt = null;
  G.lc = null;
  G.live = { h: -1, a: -2, oth: shown, nm: 1, cn: `${t.name} qualifying · matchday ${t.md + 1}` };
  render();
  const sc = $("#mscore"), iv = setInterval(() => {
    if (PZ) return;
    const r = it.next();
    if (r.done) {
      clearInterval(iv);
      busy = false;
      G.hold = null;
      G.mt = null;
      G.live = null;
      tqEnd(t, mine, r.value, H, A, oth);
      view = "nat";
      autoSave();
      render();
      return;
    }
    G.mt = r.value;
    const M = G.mt, mn = M.min - 1;
    flush();
    lform(M);
    advUp(M);
    if (M.req && !PZ) {
      PZ = true;
      showPz();
    }
    sc.textContent = `${H.name} ${M.g[0]} - ${M.g[1]} ${A.name} (${mn}')`;
    shown.forEach((y, k) => {
      const q = y.log.filter((e) => e.m <= mn).pop().s;
      $("#om" + k).textContent = q[0] + "-" + q[1];
    });
  }, SPD[G.speed || "n"]);
}
