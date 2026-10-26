// Managing a national team in a tournament
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

var XT = [], TPB = null;
const nmOf = (i) => typeof i == "string" ? i : CC(i).name;
function ntClone(p) {
  const q = Object.assign({}, p), dsp = { GK: "GK", DF: "CB", MF: "CM", FW: "ST" };
  if (!q.sp) q.sp = dsp[q.pos] || "CM";
  if (q.pc == null || q.ae == null || !q.fam) setSp(q, q.sp);
  else q.fam = Object.assign({}, q.fam);
  Object.assign(q, { g: 0, y: 0, r: 0, ap: 0, mn: 0, pl: 0, sus: 0, inj: 0, rs: 0, lm: 0, lx: 0, as: 0 });
  q.fm = p.fm || PB[p.pos] || 6.3;
  q.mo = p.mo == null ? 60 : p.mo;
  q.cd = cl(Math.max(p.cd || 100, 85), 20, 100);
  q.oid = p.id;
  return q;
}
function ntSelU(L, S) {
  const N = G.nm, st = N.pl || {}, inj = S && S.inj || {}, pool = L.filter((p) => !(inj[p.id] > 0) && st[p.id] != "out"), pk = ntSel(pool);
  pool.filter((p) => st[p.id] == "in" && !pk.includes(p) && !(p.inj > 0 && !p.nd)).forEach((p) => pk.push(p));
  while (pk.length > 23) {
    const d = pk.filter((p) => st[p.id] != "in").sort((a, b) => a.o - b.o)[0];
    if (!d) break;
    pk.splice(pk.indexOf(d), 1);
  }
  return pk;
}
function ntTeam(n, user, S) {
  const L = natMap()[n] || [], N = G.nm, tp = S || {}, sq = (user ? ntSelU(L, S) : ntSel(L)).map(ntClone);
  if (user) sq.forEach((q) => {
    const id = q.oid;
    if (tp.sus && tp.sus[id] > 0) q.sus = 1;
    if (tp.fit && tp.fit[id] != null) q.cd = Math.min(100, tp.fit[id] + 12);
  });
  const t = { id: user ? -1 : -2, name: n, pl: sq, f: user && SL[N.f] ? N.f : "4-3-3", style: user && STY[N.sty] ? N.sty : "balanced", xi: [], cs: null, co: null, rep: 60, lg: -1, fc: {} };
  Object.keys(FAC).forEach((k) => t.fc[k] = { lv: 8, cd: 100 });
  auto(t);
  if (user) {
    const st = N.pl || {}, S2 = slOf(t);
    sq.filter((q) => st[q.oid] == "in" && av2(q) && !t.xi.includes(sq.indexOf(q))).forEach((q) => {
      const qi = sq.indexOf(q);
      let bk = -1, bg = -1e9;
      t.xi.forEach((i, k) => {
        const o = sq[i];
        if (!o || st[o.oid] == "in") return;
        if (k == 0 != (q.pos == "GK")) return;
        const g = sc_(q) - pen(q, S2[k][0]) - (sc_(o) - pen(o, S2[k][0]));
        if (g > bg) {
          bg = g;
          bk = k;
        }
      });
      if (bk >= 0) t.xi[bk] = qi;
    });
    fixXI(t);
  }
  return t;
}
function tpInit(k, f) {
  const n = G.nm.n, d = TD[k];
  f = f.slice();
  if (!f.includes(n)) {
    const w = f.slice().sort((a, b) => eloOf(a).e - eloOf(b).e)[0];
    f[f.indexOf(w)] = n;
  }
  const ord = f.slice().sort((a, b) => eloOf(b).e - eloOf(a).e), gn = f.length / 4, pots = [0, 1, 2, 3].map((i) => shuf(ord.slice(i * gn, (i + 1) * gn))), groups = [];
  for (let g = 0; g < gn; g++) groups.push([0, 1, 2, 3].map((i) => pots[i][g]));
  const st = {}, played = {};
  f.forEach((x) => {
    st[x] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 };
    played[x] = 0;
  });
  G.tp = { k, name: d.name, y: 2026 + G.season - 1, groups, st, played, day: 0, ko: [], cur: null, rk: null, mine: [], tg: {}, sus: {}, inj: {}, fit: {}, out: 0, sd: ord.indexOf(n) / Math.max(1, f.length - 1) };
}
const TPD = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
function tpRound(tp) {
  const c = tp.cur.length;
  return c == 1 ? "Final" : c == 2 ? "Semi-finals" : c == 4 ? "Quarter-finals" : "Round of " + c * 2;
}
function tpLab() {
  const tp = G.tp;
  return tp.day < 3 ? `Group stage, matchday ${tp.day + 1}` : tpRound(tp);
}
function tpPairs() {
  const tp = G.tp;
  if (tp.day < 3) {
    const o = [];
    tp.groups.forEach((gr, gi) => TPD[tp.day].forEach(([i, j]) => o.push({ a: gr[i], b: gr[j], gi })));
    return o;
  }
  return tp.cur.map(([a, b]) => ({ a, b }));
}
function tpMine(pairs) {
  const tp = G.tp, n = G.nm && G.nm.n;
  if (tp.out || !n) return null;
  return (pairs || tpPairs()).find((p) => p.a == n || p.b == n) || null;
}
function tpSimOthers(pairs, mine) {
  const tp = G.tp, NM = natMap(), M = idMap(), W = { rs: [] }, xs = {}, out = new Map();
  TG = tp.tg;
  pairs.forEach((p) => {
    if (p === mine) return;
    [p.a, p.b].forEach((n) => {
      if (!xs[n]) xs[n] = ntXI(ntSel(NM[n] || []));
    });
    if (tp.day < 3) {
      const [ga, gb] = iwMatchSim(W, M, p.a, p.b, xs);
      out.set(p, { a: p.a, b: p.b, ga, gb });
    } else out.set(p, tmKO(p.a, p.b, xs, M, W));
  });
  TG = null;
  return out;
}
function tpFake(r) {
  const L = [{ m: 0, s: [0, 0] }];
  let x = 0, y = 0;
  const ev = [];
  for (let i = 0; i < r.ga; i++) ev.push([Math.ceil(Math.random() * 90), 0]);
  for (let i = 0; i < r.gb; i++) ev.push([Math.ceil(Math.random() * 90), 1]);
  ev.sort((p, q) => p[0] - q[0]).forEach(([m, s2]) => {
    s2 ? y++ : x++;
    L.push({ m, s: [x, y] });
  });
  return { h: r.a, a: r.b, g: [r.ga, r.gb], log: L };
}
function tpElo(a, b, ga, gb) {
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
}
function tpWb(H, A, S) {
  const tp = S || G.tp, M = idMap();
  Object.keys(tp.inj).forEach((id) => {
    tp.inj[id]--;
    if (tp.inj[id] <= 0) delete tp.inj[id];
  });
  [H, A].forEach((t, s) => t.pl.forEach((q) => {
    const e = M[q.oid], o = e && e[0];
    if (q.pl) {
      if (o) o.ic = (o.ic || 0) + 1;
      if (q.g) {
        if (o) o.ig = (o.ig || 0) + q.g;
        const z = tp.tg[q.oid] = tp.tg[q.oid] || { n: q.n, nt: q.nt, g: 0 };
        z.g += q.g;
      }
      if (o && e[1] == 0) {
        o.cd = Math.max(30, o.cd - rn(4, 9));
        if (q.inj > 0 && !(o.inj > 0)) {
          o.inj = q.inj;
          o.nd = 0;
          o.ni = 1;
        }
      }
    }
    if (s == 0) {
      const id = q.oid;
      if (!q.pl && tp.sus[id] > 0) {
        tp.sus[id]--;
        if (tp.sus[id] <= 0) delete tp.sus[id];
      }
      if (q.pl) {
        tp.fit[id] = q.cd;
        if (q.sus > 0) tp.sus[id] = q.sus;
        if (q.inj > 0) tp.inj[id] = q.inj;
      }
    }
  }));
}
function tpEnd(mine, x, H, A, others, pairs) {
  const tp = G.tp, N = G.nm, KO = tp.day >= 3;
  x.h = -1;
  x.a = -2;
  let ga0 = x.g[0], gb0 = x.g[1], w = null, pen2 = 0;
  if (KO) {
    koFix(x);
    w = x.w == -1 ? N.n : A.name;
    ga0 += x.et ? x.et[0] : 0;
    gb0 += x.et ? x.et[1] : 0;
    if (x.pen) pen2 = 1;
  }
  const ua = mine.a == N.n, r = { a: mine.a, b: mine.b, ga: ua ? ga0 : gb0, gb: ua ? gb0 : ga0, pen: pen2, w, gi: mine.gi };
  tpWb(H, A, tp);
  tpElo(r.a, r.b, r.ga, r.gb);
  tp.mine.push({ lab: tpLab(), opp: A.name, gf: ga0, ga: gb0, pen: x.pen || null, et: x.et ? 1 : 0, w: KO ? w == N.n : null });
  const res = pairs.map((p) => p === mine ? r : others.get(p));
  XT = [];
  TPB = null;
  tpApply(res);
}
function tpApply(res) {
  const tp = G.tp, N = G.nm;
  if (tp.day < 3) {
    res.forEach((r) => {
      const A = tp.st[r.a], B = tp.st[r.b];
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
      tp.played[r.a]++;
      tp.played[r.b]++;
    });
    tp.day++;
    if (tp.day == 3) {
      const rank = (gr) => gr.slice().sort((a, b) => tp.st[b].Pts - tp.st[a].Pts || tp.st[b].GF - tp.st[b].GA - (tp.st[a].GF - tp.st[a].GA) || tp.st[b].GF - tp.st[a].GF || Math.random() - 0.5);
      tp.rk = tp.groups.map(rank);
      const rk = tp.rk;
      tp.cur = [];
      for (let g = 0; g < rk.length; g += 2) {
        tp.cur.push([rk[g][0], rk[g + 1][1]]);
        tp.cur.push([rk[g + 1][0], rk[g][1]]);
      }
      if (N && !rk.some((r) => r[0] == N.n || r[1] == N.n)) tp.out = 1;
    }
    return;
  }
  const nm = tpRound(tp);
  res.forEach((r) => {
    tp.played[r.a]++;
    tp.played[r.b]++;
  });
  tp.ko.push({ name: nm, ties: res.map((r) => ({ a: r.a, b: r.b, ga: r.ga, gb: r.gb, pen: r.pen ? 1 : 0, w: r.w })) });
  if (N && res.some((r) => (r.a == N.n || r.b == N.n) && r.w != N.n)) tp.out = 1;
  if (res.length == 1) {
    tpFinish();
    return;
  }
  const nx = [];
  for (let i = 0; i + 1 < res.length; i += 2) nx.push([res[i].w, res[i + 1].w]);
  tp.cur = nx;
  tp.day++;
}
function tpFinish() {
  const tp = G.tp, N = G.nm, fn_ = tp.ko[tp.ko.length - 1].ties[0], teams = Object.keys(tp.st), T = { k: tp.k, name: tp.name, y: tp.y, groups: tp.rk.map((r) => r.map((n) => ({ n, ...tp.st[n] }))), ko: tp.ko, ch: fn_.w, ru: fn_.w == fn_.a ? fn_.b : fn_.a };
  T.stage = {};
  teams.forEach((n) => {
    if (n == T.ch) {
      T.stage[n] = "Champions";
      return;
    }
    if (n == T.ru) {
      T.stage[n] = "Runners-up";
      return;
    }
    let ex = null;
    T.ko.forEach((r) => r.ties.forEach((t) => {
      if ((t.a == n || t.b == n) && t.w != n) ex = r.name;
    }));
    T.stage[n] = ex ? "Out in the " + ex.toLowerCase().replace("finals", "final") : "Out in the group stage";
  });
  const bo = Object.values(tp.tg).sort((a, b) => b.g - a.g)[0];
  T.boot = bo ? [bo.n, bo.nt, bo.g] : null;
  G.itn = (G.itn || []).concat([T]).slice(-8);
  G.itw = (G.itw || []).concat([{ y: T.y, name: T.name, ch: T.ch, ru: T.ru, boot: T.boot }]);
  const win = T.ch, fi = T.ru, mine = [];
  G.t.forEach((t) => t.pl.forEach((p) => {
    if (!p.nt || !(p.nt in T.stage)) return;
    const s2 = T.stage[p.nt];
    p.cd = cl((p.cd || 100) + 30, 30, 100);
    p.mo = cl(p.mo + (p.nt == win ? 9 : p.nt == fi ? 4 : s2.includes("group") ? -2 : 1), 0, 100);
  }));
  G.t[G.me].pl.forEach((p) => {
    if (p.nt in T.stage && p.nt != N.n) mine.push(`${p.n} (${ncode(p.nt)}) ${T.stage[p.nt].toLowerCase()}`);
  });
  const rc = ntRep(T.stage[N.n], tp.sd);
  N.hist = (N.hist || []).concat([{ y: T.y, name: T.name, stage: T.stage[N.n], rc }]);
  G.ilog = [`Summer ${T.y}: ${N.n} at the ${T.name}: ${T.stage[N.n].toLowerCase()} (manager reputation ${rc > 0 ? "+" : ""}${rc}).${mine.length ? " " + mine.slice(0, 8).join(" · ") : ""}`].concat(G.ilog || []).slice(0, 8);
  G.tp = null;
  TG = null;
  XT = [];
}
function tpStep() {
  const tp = G.tp;
  if (!tp) return;
  const pairs = tpPairs(), mine = tpMine(pairs);
  if (mine) {
    const N = G.nm, opp = mine.a == N.n ? mine.b : mine.a, H = ntTeam(N.n, true, G.tp), A = ntTeam(opp, false);
    XT = [H, A];
    const o = tpSimOthers(pairs, mine), x = play(H, A);
    tpEnd(mine, x, H, A, o, pairs);
  } else {
    const o = tpSimOthers(pairs, null);
    tpApply(pairs.map((p) => o.get(p)));
  }
}
function tpSimAll() {
  let n = 0;
  while (G.tp && !busy && n++ < 30) tpStep();
}
function tpPlay(live) {
  const tp = G.tp, N = G.nm;
  if (!tp || busy) return;
  if (!live) {
    tpStep();
    autoSave();
    return;
  }
  const pairs = tpPairs(), mine = tpMine(pairs);
  if (!mine) {
    tpStep();
    autoSave();
    return;
  }
  const opp = mine.a == N.n ? mine.b : mine.a, H = ntTeam(N.n, true, G.tp), A = ntTeam(opp, false);
  XT = [H, A];
  const others = tpSimOthers(pairs, mine), shown = [...others.values()].map(tpFake), it = mgen(H, A, 0);
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
  G.live = { h: -1, a: -2, oth: shown, nm: 1, cn: tp.name + " · " + tpLab() };
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
      tpEnd(mine, r.value, H, A, others, pairs);
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
function nmAct(k, i) {
  const N = G.nm;
  if (k == "take") {
    const v = $("#nmn"), n = v && v.value || G.nmp;
    if (!n || G.nm) return;
    G.nm = { n, f: "4-3-3", sty: "balanced", pl: {}, hist: [] };
    tqEnsure();
    tqCatch();
  } else if (k == "resign") {
    if (!G.tp) {
      G.nm = null;
      G.tq = null;
    }
  } else if (k == "pl" && N) {
    const c = N.pl[i];
    if (!c) N.pl[i] = "in";
    else if (c == "in") N.pl[i] = "out";
    else delete N.pl[i];
  } else if (k == "tq") tqPlay(true);
  else if (k == "tqs") tqPlay(false);
  else if (k == "live") tpPlay(true);
  else if (k == "sim") {
    tpPlay(false);
  } else if (k == "all") {
    tpSimAll();
    autoSave();
  }
}
