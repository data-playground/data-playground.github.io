// AI managers: hiring and sacking
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const RV = [1, 0, 5, 4, 3, 2, 9, 8, 7, 6, 13, 12, 11, 10, 17, 16, 15, 14, 19, 18], mlab = (r) => r < 35 ? "Novice" : r < 55 ? "Experienced" : r < 75 ? "Established" : r < 90 ? "Elite" : "Legend", bcl = (b) => b >= 80 ? "Delighted" : b >= 60 ? "Satisfied" : b >= 40 ? "Concerned" : b >= 25 ? "Under pressure" : "Threatened";
const mkCo = (t) => ({ n: pick(FN)[0] + ". " + pick(LN), rep: Math.round(cl(t.rep + rn(-8, 4), 25, 90)), abil: Math.round(rn(40, 85)), f: pick(Object.keys(FM)), sty: pick(["balanced", "balanced", "attack", "counter"]) });
function cnews(x) {
  G.cn.unshift(`Season ${G.season}: ${x}`);
  G.cn.length = Math.min(G.cn.length, 14);
}
function setCo(t, c) {
  t.co = c;
  t.f = c.f;
  t.cs = null;
  t.style = c.sty;
  auto(t);
}
function hireFor(t) {
  const c = G.cp.filter((c2) => c2.ex !== t.id && !(c2.exl && c2.exl.some((e) => e[0] == t.id && G.season - e[1] < 4)) && !(c2.sy != null && G.season - c2.sy < 1) && Math.abs(c2.rep - (t.rep - 3)) <= 12).sort((a, b) => Math.abs(a.rep - t.rep) - Math.abs(b.rep - t.rep)), pk = c.length && Math.random() < 0.8 ? pick(c.slice(0, 3)) : null;
  if (pk) G.cp.splice(G.cp.indexOf(pk), 1);
  const n = pk || mkCo(t);
  setCo(t, n);
  cnews(`${t.name} appoint ${n.n}.`);
}
function sackCo(t, why, off) {
  if (!t.co) return;
  const c = t.co;
  c.rep = Math.max(20, c.rep - 4);
  c.ex = t.id;
  c.sy = G.season;
  c.exl = (c.exl || []).filter((e) => G.season - e[1] < 4).concat([[t.id, G.season]]);
  G.cp.push(c);
  G.cp = G.cp.filter((x) => x.rep >= 28).slice(-14);
  t.co = null;
  t.sk = !!off;
  cnews(`${t.name} sack ${c.n} (${why}).`);
  hireFor(t);
}
function aiSack(mid) {
  G.t.forEach((t) => {
    if (t.id == G.me || !t.co) return;
    const pos = t.pos || t.exp, miss = pos - t.exp;
    if (mid) {
      if (miss >= 6 && Math.random() < 0.35) sackCo(t, "poor results", !!G.jl);
    } else if (Math.random() < (miss >= 5 ? 0.55 : miss >= 3 ? 0.2 : 0) + (pos >= G.lg[t.lg].n - 1 ? 0.1 : 0) + (G.pr && G.pr.rel.includes(t.id) ? 0.4 : 0)) sackCo(t, "missing targets", true);
  });
}
