// Old-save migration and shared lookups
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const YM = { 1: 1.1, 2: 1.03, 3: 1, 4: 0.97, 5: 0.95 };
function uid() {
  return ++PID;
}
function fp(id) {
  for (const t of G.t) {
    const p2 = t.pl.find((x) => x.id == id);
    if (p2) return { p: p2, t };
  }
  for (const t of G.t) {
    const p2 = (t.ac || []).find((x) => x.id == id);
    if (p2) return { p: p2, t, y: 1 };
  }
  const p = G.fa.find((x) => x.id == id);
  return p ? { p, t: null } : null;
}
function mig() {
  const all = [...G.t.flatMap((t) => t.pl), ...G.fa, ...(G.gc || []).flatMap((t) => t.pl), ...G.wp || []];
  let m = 0;
  all.forEach((p) => {
    if (p.id > m) m = p.id;
  });
  all.forEach((p) => {
    if (!p.id) p.id = ++m;
    if (p.ls === void 0) p.ls = null;
  });
  PID = m;
  all.forEach((p) => {
    if (!p.sp) setSp(p, pick(SPG[p.pos]));
  });
  G.t.forEach((t) => {
    if (!SL[t.f]) t.f = "4-4-2";
    auto(t);
  });
  if (!G.lg) {
    G.lg = [{ id: 0, key: "cos:1", name: "Costaverde Serie A", cn: "Costaverde", nid: "cos", tier: 1, ids: G.t.map((t) => t.id), n: G.t.length, rounds: 38, tv: 60, fix: G.fix }];
    G.t.forEach((t) => t.lg = 0);
    G.nr = 38;
    delete G.fix;
  }
  G.cfg = G.cfg || { ms: "league" };
  G.pr = G.pr || { up: [], rel: [], mv: [] };
  if (G.vl === void 0) G.vl = null;
  G.ob = G.ob || [];
  G.neg = G.neg || null;
  G.cool = G.cool || {};
  G.sk = G.sk || {};
  G.ch = G.ch || [];
  {
    const al = lgNats();
    G.t.forEach((t) => t.pl.forEach((p) => {
      if (p.nt === void 0) p.nt = natFor(G.lg[t.lg].cn, al);
    }));
    G.fa.forEach((p) => {
      if (p.nt === void 0) p.nt = al.length ? pick(al) : void 0;
    });
  }
}
function listAI() {
  G.t.forEach((t) => {
    if (t.id == G.me) return;
    t.pl.forEach((p) => {
      p.ls = null;
      if (p.ln != null) return;
      const r = p.role;
      if ((r == "depth" || r == "rotation") && Math.random() < 0.4) p.ls = "S";
      else if ((r == "prospect" || r == "youth") && Math.random() < 0.45) p.ls = "L";
      else if (r == "rotation" && p.a <= 24 && Math.random() < 0.3) p.ls = "L";
    });
  });
}
