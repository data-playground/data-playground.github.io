// Valuation, asking prices and the AI transfer market
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const MNN = { GK: 2, DF: 6, MF: 6, FW: 4 }, MNH = { GK: 2, DF: 5, MF: 5, FW: 3 };
const val = (p) => Math.max(0.05, Math.round(0.15 * Math.pow(1.16, p.o - 45) * (p.a <= 21 ? 1.3 : p.a <= 25 ? 1.15 : p.a <= 28 ? 1 : p.a <= 30 ? 0.85 : p.a <= 32 ? 0.6 : 0.35) * (1 + (p.a <= 23 ? Math.max(0, p.pot - p.o) * 0.04 : 0)) * 20) / 20);
const ask = (p, s) => +(val(p) * (s ? (p.role == "key" ? 1.6 : p.role == "starter" ? 1.25 : 1.05) * (p.ls == "S" ? 0.9 : 1) : 0.1)).toFixed(2);
const nd = (t, q) => {
  const s = t.pl.filter((p) => p.pos == q).sort((a, b) => b.o - a.o), k = { GK: 1, DF: 4, MF: 4, FW: 2 }[q];
  return s[k - 1] ? s[k - 1].o : 0;
};
const cnt = (t, q) => t.pl.filter((p) => p.pos == q).length, fm1 = (x) => x < 1 ? "€" + Math.round(x * 1e3) + "k" : "€" + (x >= 10 ? x.toFixed(0) : x.toFixed(1)) + "M";
function mut(t, f) {
  const xp = t.xi.map((i) => t.pl[i]);
  f();
  t.xi = xp.map((p) => p && t.pl.includes(p) ? t.pl.indexOf(p) : -1);
  fixXI(t);
}
function news(x) {
  G.news.unshift(x);
  G.news.length = Math.min(G.news.length, 12);
}
function move(p, s, b, fee, ln) {
  p.ls = null;
  if (s) mut(s, () => s.pl.splice(s.pl.indexOf(p), 1));
  else if (G.fa.includes(p)) G.fa.splice(G.fa.indexOf(p), 1);
  if (b) mut(b, () => b.pl.push(p));
  else G.fa.push(p);
  if (b) {
    b.bud = +(b.bud - fee).toFixed(2);
    b.fn.tr -= fee;
    p.mo = 65;
    p.ln = ln ? s.id : null;
    if (ln) p.l0 = { ap: p.ap || 0, mn: p.mn || 0, g: p.g || 0, as: p.as || 0 };
    if (!ln) {
      p.w = wageFor(p);
      p.cy = 3;
    }
  } else p.ln = null;
  if (s) {
    s.bud = +(s.bud + fee).toFixed(2);
    s.fn.tr += fee;
  }
  if (s) roles(s);
  if (b) roles(b);
}
function aiMarket(w) {
  listAI();
  const ai = G.t.filter((t) => t.id != G.me).sort(() => Math.random() - 0.5);
  ai.forEach((b) => {
    for (let k = 0; k < (b.bud > 6 ? 3 : 2); k++) {
      if (b.bud < 0.15 || b.pl.length > 25) break;
      const nds = { GK: nd(b, "GK"), DF: nd(b, "DF"), MF: nd(b, "MF"), FW: nd(b, "FW") };
      const pool = [...G.fa.map((p) => ({ p, s: null })), ...G.t.filter((s) => s.id != b.id && s.id != G.me && inSc(s, b)).flatMap((s) => s.pl.filter((p) => p.ln == null && cnt(s, p.pos) > MNH[p.pos]).map((p) => ({ p, s })))].filter((x) => x.p.o >= nds[x.p.pos] + 2 && ask(x.p, x.s) <= b.bud - RES(b) && wbill(b) + wageFor(x.p) <= 0.65 * b.ann && !(x.s && x.s.rep > b.rep + 6 && (x.p.role == "key" || x.p.role == "starter"))).map((x) => ({ ...x, sc: x.p.o - nds[x.p.pos] - ask(x.p, x.s) / b.bud * 3 }));
      if (!pool.length) continue;
      pool.sort((x, y) => y.sc - x.sc);
      const c = pick(pool.slice(0, 3)), f = ask(c.p, c.s);
      move(c.p, c.s, b, f, false);
      if (c.p.o >= 75 || c.s && c.p.o >= 72) news(`${w}: ${c.p.n} (${c.p.pos}, ${c.p.o}) ${c.s ? "joins " + b.name + " from " + c.s.name + " for " + fm1(f) : "signs for " + b.name + " as a free agent"}.`);
    }
    if (b.pl.length > 25) {
      const c = b.pl.filter((p) => cnt(b, p.pos) > MNN[p.pos]).sort((x, y) => x.o + 0.3 * x.pot - y.o - 0.3 * y.pot)[0];
      if (c) move(c, b, null, 0, false);
    }
    if (b.bud < 2 && b.pl.length < 25 && Math.random() < 0.5) {
      const nq = ["GK", "DF", "MF", "FW"].map((q) => [q, nd(b, q)]).sort((x, y) => x[1] - y[1])[0], pool = G.t.filter((s) => s.id != b.id && s.id != G.me && inSc(s, b) && s.bud > b.bud).flatMap((s) => s.pl.filter((p) => p.pos == nq[0] && p.ln == null && ["rotation", "depth", "prospect"].includes(p.role) && p.o >= nq[1] && wbill(b) + p.w <= 0.65 * b.ann && cnt(s, nq[0]) > MNH[nq[0]]).map((p) => ({ p, s })));
      if (pool.length) {
        const c = pick(pool), f = +(val(c.p) * 0.08).toFixed(2);
        if (f <= b.bud - RES(b) * 0.5) move(c.p, c.s, b, f, true);
      }
    }
  });
}
