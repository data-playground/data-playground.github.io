// International windows and call-ups
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function ntSel(L) {
  const el = L.filter((p) => !(p.inj > 0 && !p.nd)), sc = (p) => p.o + (p.fm && p.ap >= 6 ? (p.fm - 6.3) * 1.2 : 0) + (p.a >= 36 ? -2 : 0), pk = [];
  for (const q in NQ) el.filter((p) => p.pos == q).sort((a, b) => sc(b) - sc(a)).slice(0, NQ[q]).forEach((p) => pk.push(p));
  if (pk.length < 23) el.filter((p) => !pk.includes(p)).sort((a, b) => sc(b) - sc(a)).slice(0, 23 - pk.length).forEach((p) => pk.push(p));
  return pk;
}
function ntXI(sq) {
  const xi = [];
  [["GK", 1], ["DF", 4], ["MF", 3], ["FW", 3]].forEach(([q, k]) => sq.filter((p) => p.pos == q).sort((a, b) => b.o - a.o).slice(0, k).forEach((p) => xi.push(p)));
  if (xi.length < 11) sq.filter((p) => !xi.includes(p)).sort((a, b) => b.o - a.o).slice(0, 11 - xi.length).forEach((p) => xi.push(p));
  return xi;
}
const ntStr = (xi) => xi.length ? xi.reduce((s, p) => s + p.o, 0) / xi.length : 30;
const competes = (M) => Object.keys(M).filter((n) => M[n].length >= 8);
function iwGet() {
  ensureNat();
  cal();
  if (!G.iw || G.iw.y != G.season) G.iw = { y: G.season, w: IWK.map((k, i) => ({ i, t: G.cs + 7 * k - 2, an: 0, ap: 0, pl: 0, sq: {}, rs: [] })) };
  return G.iw;
}
const idMap = () => {
  const m = {};
  G.t.forEach((t) => t.pl.forEach((p) => m[p.id] = [p, 0]));
  (G.gc || []).forEach((t) => t.pl.forEach((p) => m[p.id] = [p, 1]));
  G.fa.forEach((p) => m[p.id] = [p, 1]);
  (G.wp || []).forEach((p) => m[p.id] = [p, 1]);
  return m;
};
function iwAnn(W) {
  const M = natMap();
  W.sq = {};
  competes(M).forEach((n) => {
    W.sq[n] = ntSel(M[n]).map((p) => p.id);
  });
  W.an = 1;
}
function iwPre() {
  if (G.round >= G.nr || !G.lg) return;
  const I = iwGet(), d = dRd(G.round);
  I.w.forEach((W) => {
    if (!W.an && !W.pl && d <= W.t + 5 && W.t - d <= 9) iwAnn(W);
  });
}
function eloOf(n) {
  const N = G.nn;
  if (!N[n]) {
    const M = natMap();
    N[n] = { e: Math.round(1500 + (ntStr(ntXI(ntSel(M[n] || []))) - 65) * 25), w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  }
  return N[n];
}
function iwTick(d) {
  if (!G.lg || typeof G.cs != "number") return;
  const I = iwGet();
  I.w.forEach((W) => {
    if (W.pl || d < W.t) return;
    if (!W.an) iwAnn(W);
    const M = idMap();
    if (d <= W.t + 5) {
      Object.entries(W.sq).forEach(([n, ids]) => ids.forEach((id) => {
        const e = M[id];
        if (!e || e[1] || e[0].inj > 0) return;
        e[0].inj = 1;
        e[0].nd = 1;
        e[0].cn = IWN[W.i];
      }));
    }
    iwPlay(W, M);
    W.pl = 1;
  });
}
let TG = null;
function ntScore(X, g) {
  for (let i = 0; i < g; i++) {
    const w = X.map((p2) => p2.pos == "FW" ? 5 : p2.pos == "MF" ? 2 : p2.pos == "DF" ? 0.6 : 0.05), tot = w.reduce((s, x) => s + x, 0);
    let r = Math.random() * tot, k = 0;
    while (r > w[k] && k < X.length - 1) {
      r -= w[k];
      k++;
    }
    const p = X[k];
    p.ig = (p.ig || 0) + 1;
    p.gl = (p.gl || 0) + 1;
    if (TG) {
      const e = TG[p.id] = TG[p.id] || { n: p.n, nt: p.nt, g: 0 };
      e.g++;
    }
  }
}
function iwMatchSim(W, M, a, b, xs) {
  const A = xs[a], B = xs[b], Sa = ntStr(A), Sb = ntStr(B), la = 1.3 * Math.exp(0.05 * (Sa - Sb)) + 0.12, lb = 1.3 * Math.exp(0.05 * (Sb - Sa)), ga = Math.min(9, pois(la)), gb = Math.min(9, pois(lb));
  ntScore(A, ga);
  ntScore(B, gb);
  const ea = eloOf(a), eb = eloOf(b), exp = 1 / (1 + Math.pow(10, (eb.e - ea.e) / 400)), res = ga > gb ? 1 : ga == gb ? 0.5 : 0, K = 28 * (1 + Math.min(3, Math.abs(ga - gb)) * 0.3);
  ea.e += Math.round(K * (res - exp));
  eb.e -= Math.round(K * (res - exp));
  ea.gf += ga;
  ea.ga += gb;
  eb.gf += gb;
  eb.ga += ga;
  if (res == 1) {
    ea.w++;
    eb.l++;
  } else if (res == 0) {
    eb.w++;
    ea.l++;
  } else {
    ea.d++;
    eb.d++;
  }
  [[A, ga, gb], [B, gb, ga]].forEach(([X, f, g]) => X.forEach((p) => {
    p.ic = (p.ic || 0) + 1;
    if (M[p.id] && !M[p.id][1]) {
      p.cd = Math.max(30, p.cd - rn(4, 9));
      p.mo = cl(p.mo + (f > g ? 2 : f < g ? -1 : 0.5), 0, 100);
      if (Math.random() < 0.012) {
        p.inj = Math.round(rn(2, 9));
        p.nd = 0;
        p.ni = 1;
      }
    }
  }));
  W.rs.push([a, b, ga, gb]);
  return [ga, gb];
}
function iwPlay(W, M) {
  const nats = Object.keys(W.sq);
  if (nats.length < 2) return;
  const xs = {};
  nats.forEach((n) => {
    const sq = W.sq[n].map((id) => M[id] && M[id][0]).filter(Boolean);
    xs[n] = ntXI(sq.length ? sq : []);
  });
  const mine = new Set(G.t[G.me].pl.map((p) => p.id)), log = [];
  nats.forEach((n) => {
    const xi = new Set(xs[n].map((p) => p.id));
    W.sq[n].forEach((id) => {
      const e = M[id];
      if (e && !xi.has(id)) {
        e[0].ic = (e[0].ic || 0) + (Math.random() < 0.5 ? 1 : 0);
        if (!e[1]) e[0].cd = Math.max(30, e[0].cd - rn(1, 4));
      }
    });
  });
  const pairUp = (lst) => {
    const o = [];
    for (let i = 0; i + 1 < lst.length; i += 2) o.push([lst[i], lst[i + 1]]);
    return o;
  };
  const byE = (l) => l.map((n) => [n, eloOf(n).e + rn(-140, 140)]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  let pairs = [];
  const left = [];
  Object.keys(CONFS).forEach((c) => {
    const l = byE(nats.filter((n) => confOf(n) == c));
    if (l.length % 2) left.push(l.pop());
    pairs = pairs.concat(pairUp(l));
  });
  pairs = pairs.concat(pairUp(shuf(left)));
  pairs = pairs.concat(pairUp(byE(nats)));
  pairs.forEach(([a, b]) => {
    const before = [...xs[a], ...xs[b]].filter((p) => mine.has(p.id));
    before.forEach((p) => p.gl = 0);
    const r = iwMatchSim(W, M, a, b, xs);
    before.forEach((p) => {
      log.push(`${p.n}: ${a == p.nt ? a : b} ${a == p.nt ? r[0] : r[1]}-${a == p.nt ? r[1] : r[0]} ${a == p.nt ? b : a}${p.gl ? `, scored ${p.gl}` : ""}`);
    });
  });
  if (log.length) G.ilog = [`${IWN[W.i]} window: ${log.slice(0, 12).join(" · ")}`].concat(G.ilog).slice(0, 8);
  G.irs = W.rs.slice(-40).map((x) => x.slice()).concat(G.irs).slice(0, 80);
}
const ntAway = (me) => me.pl.filter((p) => p.nd);
function ntNotes(me) {
  const L = [];
  ntAway(me).forEach((p) => L.push(`${p.n} is away on international duty (${ncode(p.nt)}).`));
  if (G.iw && G.iw.y == G.season) G.iw.w.forEach((W) => {
    if (W.an && !W.ap) {
      const ids = new Set([].concat(...Object.values(W.sq)));
      const c = me.pl.filter((p) => ids.has(p.id) && !p.inj);
      if (c.length) L.push(`International window (${IWN[W.i]}): ${c.map((p) => `${p.n} (${ncode(p.nt)})`).join(", ")} called up and will miss your next match.`);
    }
  });
  me.pl.filter((p) => p.ni).forEach((p) => {
    if (p.inj) L.push(`${p.n} picked up an injury on international duty (${p.inj} match${p.inj > 1 ? "es" : ""}).`);
  });
  return L;
}
