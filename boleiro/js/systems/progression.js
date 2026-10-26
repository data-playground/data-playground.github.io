// Player progression, form and rating
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const HL = () => G.lg[G.t[G.me].lg], HF = () => HL().fix, epOf = (t) => {
  const n = G.lg[t.lg].n, r = (t.exp - 1) / (n - 1) * 19 + 1;
  return cl(1.379 + (10.5 - r) * 0.0534, 0.85, 1.9);
}, inSc = (a, b) => {
  const m = G.cfg.ms;
  return m == "world" || (m == "country" ? G.lg[a.lg].nid == G.lg[b.lg].nid : a.lg == b.lg);
};
const prK = (l) => Math.max(1, Math.min(3, Math.floor(l.n / 6)));
function calcPR() {
  const mv = [], up = [], rel = [], by = {};
  G.lg.forEach((l) => (by[l.nid] = by[l.nid] || []).push(l));
  for (const k in by) {
    const ls = by[k].sort((a, b) => a.tier - b.tier);
    for (let i = 0; i + 1 < ls.length; i++) {
      const A = ls[i], B = ls[i + 1];
      if (B.tier != A.tier + 1) continue;
      const kk = Math.min(prK(A), prK(B));
      table(A.id).slice(-kk).forEach((t) => {
        rel.push(t.id);
        mv.push([t.id, B.id]);
      });
      table(B.id).slice(0, kk).forEach((t) => {
        up.push(t.id);
        mv.push([t.id, A.id]);
      });
    }
  }
  return { up, rel, mv };
}
function applyPR() {
  G.pr.mv.forEach(([id, to]) => {
    const t = G.t[id], f = G.lg[t.lg];
    f.ids = f.ids.filter((x) => x != id);
    G.lg[to].ids.push(id);
    t.lg = to;
  });
  if (G.pr.mv.length) G.lg.forEach((l) => rivals(l, G.t));
}
function goalFor() {
  const L = HL();
  return Math.min(L.n, L.ids.map((i) => G.t[i]).sort((a, b) => str(b).all - str(a).all).findIndex((x) => x.id == G.me) + 3);
}
