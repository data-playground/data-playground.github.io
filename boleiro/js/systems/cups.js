// Domestic cups, continental competitions, guest clubs
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const GI = 1e4, CC = (i) => i < 0 ? XT[-i - 1] : i >= GI ? G.gc[i - GI] : G.t[i], cnOf = (i) => {
  const t = CC(i);
  return t.gst ? t.gn : G.lg[t.lg].cn;
};
const shuf = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const CONT = {
  UEFA: { name: "Champions League", fmt: "G32", mult: 1, q: { England: 4, Spain: 4, Italy: 4, Germany: 4, France: 3, Portugal: 2, Netherlands: 2, Belgium: 1, Scotland: 1, Turkey: 1, Austria: 1, Switzerland: 1, Greece: 1, Denmark: 1, "Czech Republic": 1, Croatia: 1 } },
  CONMEBOL: { name: "Copa Libertadores", fmt: "G32", mult: 0.5, q: { Brazil: 7, Argentina: 7, Uruguay: 2, Chile: 2, Colombia: 3, Paraguay: 2, Peru: 2, Ecuador: 3, Bolivia: 2, Venezuela: 2 } },
  CONCACAF: { name: "CONCACAF Champions Cup", fmt: "K16", mult: 0.35, q: { Mexico: 5, USA: 5, Canada: 1, "Costa Rica": 2, Honduras: 1, Panama: 1, Guatemala: 1 } }
};
const QN = {};
Object.entries(CONT).forEach(([k, c]) => Object.keys(c.q).forEach((n) => QN[n] = k));
const cupP = (cp) => 1 << Math.floor(Math.log2(cp.ids.length));
const cupRName = (cp, k) => {
  if (cp.pre > 0 && k == 0) return "Preliminary round";
  const n = cupP(cp) >> k - (cp.pre > 0 ? 1 : 0);
  return n == 2 ? "Final" : n == 4 ? "Semi-final" : n == 8 ? "Quarter-final" : "Round of " + n;
};
const PHN = { R16: "Round of 16", QF: "Quarter-final", SF: "Semi-final", F: "Final" };
const evName = (cp, k) => {
  const e = cp.evs[k];
  return e.ph == "G" ? `Group stage, matchday ${e.md + 1}` : PHN[e.ph] + (e.ph == "F" ? "" : ` (leg ${e.leg})`);
};
const rName = (cp, k) => cp.kind == "cont" ? evName(cp, k) : cupRName(cp, k);
const pois = (l) => {
  const L = Math.exp(-l);
  let k = 0, p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
};
function allocW(targets, used) {
  const c = cal(), out = [];
  let last = -1;
  targets.forEach((w) => {
    let f = null;
    for (let o = 0; o < 40 && f == null; o++) {
      for (const x of o ? [w + o, w - o] : [w]) {
        if (x > last && x >= 3 && x <= 38 && !used.has(x) && !IWK.includes(x) && !c.includes(G.cs + 7 * x + 4)) {
          f = x;
          break;
        }
      }
    }
    if (f == null) {
      f = Math.min(38, last + 1);
    }
    used.add(f);
    last = f;
    out.push(G.cs + 7 * f + 4);
  });
  return out;
}
function drawCup(cp) {
  let part = cp.alive;
  cp.bye = [];
  if (cp.k == 0 && cp.pre > 0) {
    const o = cp.alive.slice().sort((a, b) => G.t[a].rep - G.t[b].rep);
    part = o.slice(0, 2 * cp.pre);
    cp.bye = o.slice(2 * cp.pre);
  }
  const q = shuf(part);
  cp.fx = [];
  for (let i = 0; i + 1 < q.length; i += 2) cp.fx.push([q[i], q[i + 1]]);
}
function ensureGuests() {
  if (G.gcS) return;
  G.gcS = 1;
  G.gc = G.gc || [];
  G.gp = G.gp || {};
  if (typeof WS == "undefined" || !WS) return;
  Object.entries(CONT).forEach(([conf, def]) => {
    if (!Object.keys(def.q).some((n) => G.lg.some((l) => l.cn == n && l.tier == 1))) return;
    Object.entries(def.q).forEach(([nat, q]) => {
      if (G.lg.some((l) => l.cn == nat && l.tier == 1) || G.gp[nat]) return;
      let src = (WS.guests || []).filter((g) => g.nation == nat).sort((a, b) => b.rep - a.rep);
      if (!src.length) {
        const nt = WS.nations.find((n) => n.name == nat), l = nt && nt.leagues.find((l2) => l2.tier == 1);
        if (l) src = l.clubs.slice().sort((a, b) => b.rep - a.rep);
      }
      G.gp[nat] = src.slice(0, q + 2).map((c) => {
        const t = mkClub(c, GI + G.gc.length, -1, nat, [nat]);
        t.gst = 1;
        t.gn = nat;
        t.cf = 0;
        t.fp = 0;
        G.gc.push(t);
        return t.id;
      });
    });
  });
}
function pickG(nat, q) {
  const ids = (G.gp[nat] || []).slice(), s = {};
  ids.forEach((i) => {
    const t = CC(i);
    s[i] = t.rep + (t.cf || 0) * 5 + rn(-6, 6);
  });
  return ids.sort((a, b) => s[b] - s[a]).slice(0, q);
}
function devGuest(t) {
  t.pl.forEach((p) => {
    p.a++;
    const a = p.a, d = a < 22 ? rn(0, 3) : a < 28 ? rn(-1, 1.5) : a < 32 ? rn(-2, 0.5) : rn(-3, 0);
    p.o = cl(Math.round(p.o + d), 25, 95);
    p.pot = Math.max(p.pot, p.o);
  });
  t.pl = t.pl.filter((p) => !(p.a > 35 && Math.random() < 0.6));
  const MN = { GK: 2, DF: 6, MF: 6, FW: 4 };
  for (const q in MN) while (t.pl.filter((p) => p.pos == q).length < MN[q]) {
    const avg = t.pl.length ? t.pl.reduce((a, p2) => a + p2.o, 0) / t.pl.length : t.rep, p = baseP(q, Math.round(cl(avg - 6 + rn(-4, 4), 28, 90)), Math.round(rn(18, 24)));
    p.pot = p.o + Math.round(rn(0, 12));
    setSp(p, pick(SPG[q]));
    p.w = wageFor(p);
    p.cy = 3;
    p.nt = natFor(t.gn, [t.gn]);
    t.pl.push(p);
  }
  t.pl.sort((a, b) => b.o - a.o);
  t.pl = t.pl.slice(0, 30);
  t.pl.forEach((p) => {
    p.cd = 100;
    p.inj = 0;
    p.sus = 0;
    p.g = p.y = p.r = p.ap = p.rs = p.mn = 0;
  });
  auto(t);
}
const prepG = (t) => {
  if (t.gst) t.pl.forEach((p) => {
    p.inj = 0;
    p.sus = 0;
    p.cd = Math.max(p.cd, 90);
  });
};
function contSeason() {
  G.qf = G.qf || {};
  G.lg.forEach((l) => {
    if (l.tier != 1 || !QN[l.cn]) return;
    G.qf[l.cn] = l.ids.slice().sort((a, b) => G.t[a].fp - G.t[b].fp).slice(0, CONT[QN[l.cn]].q[l.cn]);
  });
  const pl = new Set();
  Object.values(G.ct || {}).forEach((cp) => cp.ids.forEach((i) => pl.add(i)));
  (G.gc || []).forEach((t) => {
    if (!pl.has(t.id)) t.cf = (t.cf || 0) * 0.7 + 0.3;
    devGuest(t);
  });
}
function contSetup() {
  ensureGuests();
  const out = [];
  Object.entries(CONT).forEach(([conf, def]) => {
    let ids = [], fol = 0;
    Object.entries(def.q).forEach(([nat, q]) => {
      const l = G.lg.find((l2) => l2.cn == nat && l2.tier == 1);
      if (l) {
        fol++;
        let qs = (G.qf && G.qf[nat] || []).filter((i) => G.t[i] && G.t[i].lg == l.id);
        if (qs.length < q) qs = qs.concat(l.ids.filter((i) => !qs.includes(i)).sort((a, b) => G.t[a].exp - G.t[b].exp));
        ids.push(...qs.slice(0, q));
      } else ids.push(...pickG(nat, q));
    });
    if (!fol) return;
    const want = def.fmt == "G32" ? 32 : 16;
    if (ids.length < want) {
      const extra = [];
      Object.entries(G.gp || {}).forEach(([n, a]) => {
        if (QN[n] == conf) a.forEach((i) => {
          if (!ids.includes(i)) extra.push(i);
        });
      });
      extra.sort((a, b) => CC(b).rep - CC(a).rep);
      ids = ids.concat(extra.slice(0, want - ids.length));
    }
    out.push({ conf, ids });
  });
  return out;
}
function mkCont(conf, ids, dates) {
  const def = CONT[conf], G32 = def.fmt == "G32";
  let ng = 0, first;
  ids = ids.slice();
  if (G32) {
    ng = 1 << Math.floor(Math.log2(Math.floor(ids.length / 4)));
    if (ng < 2) return null;
    ids = ids.sort((a, b) => CC(b).rep - CC(a).rep).slice(0, ng * 4);
    first = ng * 2;
  } else {
    first = 1 << Math.floor(Math.log2(ids.length));
    if (first < 4) return null;
    ids = ids.sort((a, b) => CC(b).rep - CC(a).rep).slice(0, first);
  }
  const evs = [], nm = { 16: "R16", 8: "QF", 4: "SF", 2: "F" };
  if (G32) for (let i = 0; i < 6; i++) evs.push({ ph: "G", md: i });
  for (let s = first; s >= 2; s /= 2) {
    evs.push({ ph: nm[s], leg: 1 });
    if (s > 2) evs.push({ ph: nm[s], leg: 2 });
  }
  const nko = evs.filter((e) => e.ph != "G").length, ko = dates.slice(6).slice(-nko), cp = { kind: "cont", nid: conf, name: def.name, mult: def.mult, fmt: def.fmt, ids, alive: ids.slice(), evs, slots: (G32 ? dates.slice(0, 6) : []).concat(ko), k: 0, fx: [], grp: [], gfx: [], tab: {}, ties: [], hist: [], res: [], done: false, w: null, el: {} };
  ids.forEach((i) => {
    cp.tab[i] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 };
  });
  if (G32) {
    cp.ng = ng;
    drawGroups(cp);
  } else drawKO(cp, "seed");
  setFx(cp);
  return cp;
}
function drawGroups(cp) {
  const ng = cp.ng, ids = cp.ids;
  let best = null;
  for (let tr = 0; tr < 200; tr++) {
    const gs = Array.from({ length: ng }, () => []);
    let bad = 0;
    for (let p = 0; p < 4; p++) {
      shuf(ids.slice(p * ng, p * ng + ng)).forEach((i) => {
        let g = gs.findIndex((x) => x.length == p && !x.some((j) => cnOf(j) == cnOf(i)));
        if (g < 0) {
          g = gs.findIndex((x) => x.length == p);
          bad++;
        }
        gs[g].push(i);
      });
    }
    if (!best || bad < best.bad) best = { gs, bad };
    if (!bad) break;
  }
  cp.grp = best.gs;
  cp.gfx = fixtures(4).map((r) => cp.grp.flatMap((g) => r.map(([a, b]) => [g[a], g[b]])));
}
const grpRank = (cp, g) => g.slice().sort((a, b) => {
  const x = cp.tab[a], y = cp.tab[b];
  return y.Pts - x.Pts || y.GF - y.GA - (x.GF - x.GA) || y.GF - x.GF || Math.random() - 0.5;
});
function drawKO(cp, mode) {
  let pairs = [];
  if (mode == "grp") {
    const W = [], R = [];
    cp.grp.forEach((g, gi) => {
      const o = grpRank(cp, g);
      W.push([o[0], gi]);
      R.push([o[1], gi]);
      o.slice(2).forEach((i) => {
        cp.el[i] = -1.5;
      });
    });
    let best = null;
    for (let t = 0; t < 300; t++) {
      const p = shuf(R);
      let bad = 0;
      W.forEach(([w, gw], i) => {
        if (p[i][1] == gw || cnOf(p[i][0]) == cnOf(w)) bad++;
      });
      if (!best || bad < best.bad) best = { p, bad };
      if (!best.bad) break;
    }
    pairs = W.map(([w], i) => [best.p[i][0], w]);
    cp.alive = W.map((x) => x[0]).concat(R.map((x) => x[0]));
  } else if (mode == "seed") {
    const o = cp.ids.slice().sort((a, b) => CC(b).rep - CC(a).rep), h = o.length / 2, top = o.slice(0, h), bot = shuf(o.slice(h));
    pairs = top.map((t, i) => [bot[i], t]);
  } else {
    const q = shuf(cp.alive);
    for (let i = 0; i + 1 < q.length; i += 2) pairs.push([q[i], q[i + 1]]);
  }
  cp.ties = pairs.map(([a, b]) => ({ a, b, r1: null, r2: null, w: null }));
}
function setFx(cp) {
  const ev = cp.evs[cp.k];
  if (!ev) {
    cp.fx = [];
    return;
  }
  if (ev.ph == "G") cp.fx = cp.gfx[ev.md].map((x) => x.slice());
  else if (ev.ph == "F") cp.fx = cp.ties.map((t) => [t.a, t.b]);
  else cp.fx = cp.ties.map((t) => ev.leg == 1 ? [t.a, t.b] : [t.b, t.a]);
}
function contFix(cp, r) {
  const ev = cp.evs[cp.k];
  if (ev.ph == "G" || ev.ph != "F" && ev.leg == 1) return r;
  if (ev.ph != "F") {
    const t = cp.ties.find((t2) => t2.a == r.a && t2.b == r.h), l = t.r1, gl = (i) => l.h == i ? l.g[0] : l.g[1];
    r.off = [gl(r.h), gl(r.a)];
  }
  return koFix(r);
}
const contRes = (cp, h, a) => {
  const r = play(CC(h), CC(a));
  r.h = h;
  r.a = a;
  return contFix(cp, r);
};
function finCont(cs, out) {
  const pay = (t, x) => {
    if (t.id < GI) {
      t.bud += x;
      t.fn.tv += x;
    }
  }, mo = (t, d) => {
    if (t.id < GI) t.pl.forEach((p) => p.mo = cl(p.mo + d, 0, 100));
  };
  out.forEach((r) => {
    const cp = r.cp, ev = cp.evs[cp.k], H = CC(r.h), A = CC(r.a), u = 60 * cp.mult * inf() * 0.012;
    r.cn = cp.name + " · " + evName(cp, cp.k);
    if (r.h < GI) {
      const gt = gate(H, H.pos || H.exp);
      H.fn.tk += gt.rev;
      H.bud += gt.rev;
      H.fs += gt.full;
      H.nh++;
      H.la = gt;
    }
    let bcd = 0;
    if (ev.ph == "G") {
      const a = cp.tab[r.h], b = cp.tab[r.a];
      a.P++;
      b.P++;
      a.GF += r.g[0];
      a.GA += r.g[1];
      b.GF += r.g[1];
      b.GA += r.g[0];
      if (r.g[0] > r.g[1]) {
        a.W++;
        a.Pts += 3;
        b.L++;
        mo(H, 1);
        mo(A, -1);
        pay(H, u);
        bcd = r.h == G.me ? 0.8 : -0.8;
      } else if (r.g[0] < r.g[1]) {
        b.W++;
        b.Pts += 3;
        a.L++;
        mo(A, 1);
        mo(H, -1);
        pay(A, u);
        bcd = r.a == G.me ? 0.8 : -0.8;
      } else {
        a.D++;
        b.D++;
        a.Pts++;
        b.Pts++;
        pay(H, u / 2);
        pay(A, u / 2);
        bcd = 0;
      }
    } else {
      const tie = cp.ties.find((t) => t.a == r.h && t.b == r.a || t.a == r.a && t.b == r.h);
      if (ev.ph != "F" && ev.leg == 1) tie.r1 = { h: r.h, a: r.a, g: r.g };
      else {
        tie.r2 = { h: r.h, a: r.a, g: r.g, et: r.et, pen: r.pen, agg: r.agg };
        tie.w = r.w;
        const L = r.w == r.h ? r.a : r.h;
        pay(CC(r.w), u * { R16: 2.5, QF: 4, SF: 6.5, F: 12 }[ev.ph]);
        cp.el[L] = { R16: -0.5, QF: 0.5, SF: 1.5, F: 2.5 }[ev.ph];
        mo(CC(r.w), 1);
        mo(CC(L), -1);
        bcd = r.w == G.me ? ev.ph == "F" ? 8 : 2 : L == G.me ? -2.5 : 0;
      }
    }
    if (r.h == G.me || r.a == G.me) G.bc = cl(G.bc + bcd, 0, 100);
    (cp.res[cp.k] = cp.res[cp.k] || []).push({ h: r.h, a: r.a, g: r.g, et: r.et || null, pen: r.pen || null, w: r.w == null ? null : r.w, agg: r.agg || null });
  });
  cs.forEach((cp) => {
    const ev = cp.evs[cp.k];
    cp.k++;
    if (ev.ph == "G") {
      if (ev.md == 5 && cp.k < cp.evs.length) drawKO(cp, "grp");
    } else if (ev.ph == "F" || ev.leg == 2) {
      cp.alive = cp.ties.map((t) => t.w);
      cp.hist.push({ ph: ev.ph, ties: cp.ties });
      if (ev.ph != "F") drawKO(cp, "rand");
    }
    if (cp.k >= cp.evs.length) {
      cp.done = true;
      cp.w = cp.alive[0];
      cp.fx = [];
      cp.el[cp.w] = 3;
      const W = CC(cp.w);
      news(`${W.name} win the ${cp.name}!`);
      G.ch = G.ch || [];
      G.ch.push({ s: G.season, nid: cp.nid, n: cp.name, w: W.name });
      if (cp.w == G.me) G.bc = cl(G.bc + 6, 0, 100);
      cp.ids.forEach((i) => {
        const t = CC(i);
        if (t.gst) {
          const sc = cp.el[i] != null ? cp.el[i] : 0;
          t.cf = (t.cf || 0) * 0.6 + sc;
          t.rep = cl(Math.round(t.rep + sc * 0.5), 20, 92);
        }
      });
    } else setFx(cp);
  });
}
function koFix(r) {
  const H = CC(r.h), A = CC(r.a), o = r.off || [0, 0], tg = [r.g[0] + o[0], r.g[1] + o[1]];
  r.ko = 1;
  r.et = null;
  r.pen = null;
  r.agg = r.off ? tg.slice() : null;
  if (tg[0] != tg[1]) {
    r.w = tg[0] > tg[1] ? r.h : r.a;
    return r;
  }
  const sa = str(H).all, sb = str(A).all, ph = sa / (sa + sb), e = [pois(0.42 * Math.pow(2 * ph, 1.4)), pois(0.42 * Math.pow(2 * (1 - ph), 1.4))];
  r.et = e;
  [H, A].forEach((t) => t.xi.forEach((i) => {
    const p = t.pl[i];
    if (p) p.cd = Math.max(20, p.cd - 7);
  }));
  const log = r.log || (r.log = []);
  log.push({ m: 120, t: `Extra time: ${H.name} ${r.g[0] + e[0]} - ${r.g[1] + e[1]} ${A.name}.`, k: "", s: [r.g[0], r.g[1]] });
  if (r.agg) {
    r.agg = [tg[0] + e[0], tg[1] + e[1]];
  }
  if (tg[0] + e[0] != tg[1] + e[1]) {
    r.w = tg[0] + e[0] > tg[1] + e[1] ? r.h : r.a;
    return r;
  }
  const d = (sa - sb) / (sa + sb) * 0.1, pH = 0.76 + d, pB = 0.76 - d;
  let pa = 0, pb = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < pH) pa++;
    if (Math.random() < pB) pb++;
  }
  let n = 0;
  while (pa == pb && n++ < 30) {
    if (Math.random() < pH) pa++;
    if (Math.random() < pB) pb++;
  }
  if (pa == pb) {
    if (Math.random() < 0.5) pa++;
    else pb++;
  }
  r.pen = [pa, pb];
  r.w = pa > pb ? r.h : r.a;
  log.push({ m: 120, t: `Penalties: ${H.name} ${pa} - ${pb} ${A.name}.`, k: "", s: [r.g[0], r.g[1]] });
  return r;
}
const koRes = (h, a) => {
  const r = play(G.t[h], G.t[a]);
  r.h = h;
  r.a = a;
  return koFix(r);
};
const koTxt = (r) => {
  const w = CC(r.w).name;
  return r.pen ? `${w} win on penalties (${r.pen[0]}-${r.pen[1]}) after ${r.g[0] + r.et[0]}-${r.g[1] + r.et[1]} a.e.t.${r.agg ? ` Aggregate ${r.agg[0]}-${r.agg[1]}.` : ""}` : r.et ? `${w} win after extra time (${r.g[0] + r.et[0]}-${r.g[1] + r.et[1]}).${r.agg ? ` Aggregate ${r.agg[0]}-${r.agg[1]}.` : ""}` : r.agg ? `${w} go through, aggregate ${r.agg[0]}-${r.agg[1]}.` : r.w != null ? `${w} go through.` : "";
};
const tieTxt = (x) => `${CC(x.h).name} <b>${x.g[0] + (x.et ? x.et[0] : 0)}-${x.g[1] + (x.et ? x.et[1] : 0)}</b>${x.pen ? ` (${x.pen[0]}-${x.pen[1]} pens)` : x.et ? " a.e.t." : ""} ${CC(x.a).name}`;
function initCups() {
  G.cu = {};
  G.ct = {};
  G.cuS = G.season;
  G.ch = G.ch || [];
  const by = {};
  G.t.forEach((t) => {
    const l = G.lg[t.lg], b = by[l.nid] = by[l.nid] || { nid: l.nid, cn: l.cn, ids: [], tv: 0 };
    b.ids.push(t.id);
    b.tv = Math.max(b.tv, l.tv);
  });
  const cont = contSetup(), used = new Set();
  let cd = null;
  if (cont.length) cd = allocW([5, 8, 11, 14, 17, 20], used).concat(allocW([27, 29, 31, 33, 35, 36, 38], used));
  const list = Object.values(by).filter((x) => x.ids.length >= 4), Ks = list.map((x) => {
    const N = x.ids.length, P = 1 << Math.floor(Math.log2(N));
    return Math.floor(Math.log2(P)) + (N > P ? 1 : 0);
  }), Km = Math.max(0, ...Ks), sl = Km ? allocW(Array.from({ length: Km }, (_, i) => Math.round(5 + (Km > 1 ? i * 31 / (Km - 1) : 0))), used) : [];
  list.forEach((x, i) => {
    const K = Ks[i], N = x.ids.length, P = 1 << Math.floor(Math.log2(N)), cp = { nid: x.nid, name: x.cn + " Cup", ids: x.ids.slice(), alive: x.ids.slice(), pre: N - P, K, slots: sl.slice(Km - K), k: 0, fx: [], bye: [], res: [], done: false, w: null, prize: x.tv };
    G.cu[x.nid] = cp;
    if (G.round > 0 && cp.slots[0] < dRd(G.round)) {
      cp.done = true;
      cp.skip = true;
    } else drawCup(cp);
  });
  cont.forEach((x) => {
    if (G.round > 0 && cd[0] < dRd(G.round)) return;
    const cp = mkCont(x.conf, x.ids, cd);
    if (cp) G.ct[x.conf] = cp;
  });
}
function cups() {
  if (!G.cu || G.cuS != G.season) initCups();
  return Object.assign({}, G.cu, G.ct);
}
function nextCup() {
  let b = null;
  Object.values(cups()).forEach((cp) => {
    if (cp.done) return;
    const d = cp.slots[cp.k];
    if (b == null || d < b) b = d;
  });
  return b;
}
const cupDue = () => {
  const d = nextCup();
  return d != null && G.round < G.nr && d < dRd(G.round);
};
function nxtEvD(d) {
  let n = Infinity;
  const c = cal();
  if (G.round < c.length && c[G.round] > d) n = c[G.round];
  const q = nextCup();
  if (q != null && q > d && q < n) n = q;
  return n == Infinity ? 14 : n - d;
}
function recoverAll(gd) {
  G.t.forEach((t) => {
    const k = 1 - Math.pow(1 - (0.5 + ef(t, "tr") * 6e-3 + sf(t, "fit") * 0.05), gd / 7);
    t.pl.forEach((p) => {
      p.cd = p.cd + (100 - p.cd) * k;
    });
  });
}
function finDom(cs, out) {
  out.forEach((r) => {
    const cp = r.cp, H = G.t[r.h], A = G.t[r.a], k = cp.k, W = G.t[r.w];
    r.cn = cp.name + " · " + cupRName(cp, k);
    {
      const gt = gate(H, H.pos || H.exp);
      H.fn.tk += gt.rev;
      H.bud += gt.rev;
      H.fs += gt.full;
      H.nh++;
      H.la = gt;
    }
    const pz = cp.prize * 6e-3 * (k + 1) * inf();
    W.bud += pz;
    W.fn.tv += pz;
    [[H, r.w == r.h ? 1 : -1], [A, r.w == r.a ? 1 : -1]].forEach(([t, dd]) => t.pl.forEach((p) => p.mo = cl(p.mo + dd, 0, 100)));
    if (r.h == G.me || r.a == G.me) {
      const me = G.t[G.me], won = r.w == G.me, opp = G.t[r.h == G.me ? r.a : r.h];
      G.bc = cl(G.bc + (won ? 1.5 : opp.rep > me.rep + 5 ? -0.6 : -1.8), 0, 100);
    }
    (cp.res[k] = cp.res[k] || []).push({ h: r.h, a: r.a, g: r.g, et: r.et, pen: r.pen, w: r.w });
  });
  cs.forEach((cp) => {
    const k = cp.k, win = (cp.res[k] || []).map((x) => x.w);
    cp.alive = [...win, ...cp.bye];
    cp.bye = [];
    cp.k++;
    if (cp.k >= cp.K) {
      cp.done = true;
      cp.w = cp.alive[0];
      cp.fx = [];
      const W = G.t[cp.w];
      news(`${W.name} win the ${cp.name}!`);
      G.ch = G.ch || [];
      G.ch.push({ s: G.season, nid: cp.nid, n: cp.name, w: W.name });
      if (cp.w == G.me) G.bc = cl(G.bc + 6, 0, 100);
    } else drawCup(cp);
  });
}
function finCup(cs, out, d) {
  iwPre();
  const mine = out.find((r) => r.h == G.me || r.a == G.me);
  finDom(cs.filter((c) => c.kind != "cont"), out.filter((r) => r.cp.kind != "cont"));
  finCont(cs.filter((c) => c.kind == "cont"), out.filter((r) => r.cp.kind == "cont"));
  if (mine) {
    rvGen(mine);
    pmGen(mine);
    pcRound();
  }
  out.forEach((r) => {
    [CC(r.h), CC(r.a)].forEach((t) => t.pl.forEach((p) => {
      p.pl = 0;
    }));
  });
  G.lc = mine ? { x: mine, oth: out.filter((y) => y !== mine && y.cp === mine.cp) } : null;
  if (mine) G.ld = d;
  out.forEach((r) => {
    delete r.cp;
    if (r !== mine) {
      delete r.log;
      delete r.st;
    }
  });
  recoverAll(nxtEvD(d));
}
function doCup(live, wait) {
  iwTick(nextCup());
  const d = nextCup(), cs = Object.values(cups()).filter((cp) => !cp.done && cp.slots[cp.k] == d), inv = cs.some((cp) => cp.fx.some((t) => t.includes(G.me)));
  cs.forEach((cp) => cp.fx.forEach((t) => t.forEach((i) => {
    const x = CC(i);
    prepG(x);
    i == G.me && !wait ? fixXI(x) : auto(x);
  })));
  const out = [];
  let hp = null;
  cs.forEach((cp) => cp.fx.forEach(([h2, a2]) => {
    if (live && !wait && !G.jl && (h2 == G.me || a2 == G.me)) {
      hp = [h2, a2, cp];
      return;
    }
    const r = cp.kind == "cont" ? contRes(cp, h2, a2) : koRes(h2, a2);
    r.cp = cp;
    out.push(r);
  }));
  if (!hp) {
    finCup(cs, out, d);
    autoSave();
    if (live && !G.jl && !inv) return doRound(true);
    render();
    return;
  }
  const [h, a, cp0] = hp, shown = out.slice(), it = mgen(CC(h), CC(a), h == G.me ? 0 : 1);
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
  G.live = { h, a, oth: shown, cn: cp0.name + " · " + rName(cp0, cp0.k) };
  render();
  const sc = $("#mscore"), iv = setInterval(() => {
    if (PZ) return;
    const r = it.next();
    if (r.done) {
      clearInterval(iv);
      const x = r.value;
      x.h = h;
      x.a = a;
      if (cp0.kind == "cont") contFix(cp0, x);
      else koFix(x);
      x.cp = cp0;
      out.push(x);
      finCup(cs, out, d);
      busy = false;
      G.hold = null;
      G.mt = null;
      G.live = null;
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
    sc.textContent = `${CC(h).name} ${M.g[0]} - ${M.g[1]} ${CC(a).name} (${mn}')`;
    shown.forEach((y, k) => {
      const q = y.log.filter((e) => e.m <= mn).pop().s;
      $("#om" + k).textContent = q[0] + "-" + q[1];
    });
  }, SPD[G.speed || "n"]);
}
function nextMine() {
  const ld = G.round < G.nr ? dRd(G.round) : Infinity;
  let b = null;
  Object.values(cups()).forEach((cp) => {
    if (cp.done) return;
    const d = cp.slots[cp.k];
    if (d >= ld) return;
    const t = cp.fx.find((x) => x.includes(G.me));
    if (t && (!b || d < b.d)) b = { kind: "cup", d, h: t[0], a: t[1], lab: cp.name + " " + rName(cp, cp.k) };
  });
  if (b) return b;
  const nx = G.round < G.nr && HF()[G.round] && HF()[G.round].find((m) => m.includes(G.me));
  return nx ? { kind: "lg", d: dRd(G.round), h: nx[0], a: nx[1], lab: HL().name } : null;
}
