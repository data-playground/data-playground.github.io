// World Cup and continental championships (simulated)
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const TD = { wc: { name: "World Cup", n: 32 }, eu: { name: "European Championship", n: 16, c: "UEFA" }, sa: { name: "South American Championship", n: 16, c: "CONMEBOL", inv: "CONCACAF" }, na: { name: "CONCACAF Gold Cup", n: 16, c: "CONCACAF" }, af: { name: "African Cup of Nations", n: 16, c: "CAF" }, as: { name: "Asian Cup", n: 8, c: "AFC", inv: "CAF" } };
const WCS = { UEFA: 13, CAF: 5, AFC: 4, CONMEBOL: 5, CONCACAF: 3 };
const tmNoisy = (l) => l.map((n) => [n, eloOf(n).e + rn(-110, 110)]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
function tmField(k, nats) {
  const d = TD[k];
  let f = [];
  if (k == "wc") {
    Object.entries(WCS).forEach(([c, q]) => f = f.concat(tmNoisy(nats.filter((n) => confOf(n) == c)).slice(0, q)));
    f = f.concat(tmNoisy(nats.filter((n) => !f.includes(n))).slice(0, 32 - f.length));
  } else {
    f = tmNoisy(nats.filter((n) => confOf(n) == d.c)).slice(0, d.n);
    if (f.length < d.n) {
      const o = nats.filter((n) => !f.includes(n)), inv = d.inv ? o.filter((n) => confOf(n) == d.inv) : [];
      f = f.concat(shuf(inv).slice(0, d.n - f.length));
      if (f.length < d.n) f = f.concat(tmNoisy(o.filter((n) => !f.includes(n))).slice(0, d.n - f.length));
    }
  }
  return f;
}
function tmKO(a, b, xs, M, W) {
  const [ga0, gb0] = iwMatchSim(W, M, a, b, xs);
  let ga = ga0, gb = gb0, pen = 0;
  if (ga == gb) {
    const A = xs[a], B = xs[b], Sa = ntStr(A), Sb = ntStr(B), ea = pois(0.45 * Math.exp(0.05 * (Sa - Sb))), eb = pois(0.45 * Math.exp(0.05 * (Sb - Sa)));
    ntScore(A, ea);
    ntScore(B, eb);
    ga += ea;
    gb += eb;
    if (ga == gb) {
      pen = 1;
      ga == gb && (Math.random() < 0.5 + (Sa - Sb) * 0.01 ? ga += 0 : 0);
    }
  }
  let w = ga > gb ? a : gb > ga ? b : null;
  if (!w) w = Math.random() < 0.5 + (ntStr(xs[a]) - ntStr(xs[b])) * 0.01 ? a : b;
  return { a, b, ga, gb, pen, w };
}
function tmRun(k, teams, NM) {
  const M = idMap(), d = TD[k], xs = {}, W = { rs: [] };
  teams.forEach((n) => {
    xs[n] = ntXI(ntSel(NM[n]));
  });
  TG = {};
  const ord = teams.slice().sort((a, b) => eloOf(b).e - eloOf(a).e), gn = teams.length / 4, pots = [0, 1, 2, 3].map((i) => shuf(ord.slice(i * gn, (i + 1) * gn))), groups = [];
  for (let g = 0; g < gn; g++) groups.push([0, 1, 2, 3].map((i) => pots[i][g]));
  const st = {}, stage = {};
  teams.forEach((n) => {
    st[n] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 };
    stage[n] = 0;
  });
  const played = {};
  teams.forEach((n) => played[n] = 0);
  groups.forEach((gr) => [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]].forEach(([i, j]) => {
    const a = gr[i], b = gr[j], [ga, gb] = iwMatchSim(W, M, a, b, xs);
    played[a]++;
    played[b]++;
    const A = st[a], B = st[b];
    A.P++;
    B.P++;
    A.GF += ga;
    A.GA += gb;
    B.GF += gb;
    B.GA += ga;
    if (ga > gb) {
      A.W++;
      A.Pts += 3;
      B.L++;
    } else if (ga < gb) {
      B.W++;
      B.Pts += 3;
      A.L++;
    } else {
      A.D++;
      B.D++;
      A.Pts++;
      B.Pts++;
    }
  }));
  const rank = (gr) => gr.slice().sort((a, b) => st[b].Pts - st[a].Pts || st[b].GF - st[b].GA - (st[a].GF - st[a].GA) || st[b].GF - st[a].GF || Math.random() - 0.5);
  const rk = groups.map(rank), T = { k, name: d.name, groups: rk.map((r) => r.map((n) => ({ n, ...st[n] }))), ko: [] };
  let cur = [];
  for (let g = 0; g < gn; g += 2) {
    cur.push([rk[g][0], rk[g + 1][1]]);
    cur.push([rk[g + 1][0], rk[g][1]]);
  }
  let rnd = 1;
  teams.forEach((n) => {
  });
  rk.forEach((r) => {
    stage[r[0]] = 1;
    stage[r[1]] = 1;
  });
  while (cur.length) {
    const nm = cur.length == 1 ? "Final" : cur.length == 2 ? "Semi-finals" : cur.length == 4 ? "Quarter-finals" : "Round of " + cur.length * 2, ties = cur.map(([a, b]) => {
      const t = tmKO(a, b, xs, M, W);
      played[a]++;
      played[b]++;
      return t;
    });
    T.ko.push({ name: nm, ties });
    ties.forEach((t) => {
      stage[t.w] = Math.max(stage[t.w], rnd + 1);
    });
    const nx = [];
    for (let i = 0; i + 1 < ties.length; i += 2) nx.push([ties[i].w, ties[i + 1].w]);
    cur = ties.length == 1 ? [] : nx;
    rnd++;
  }
  const fin = T.ko[T.ko.length - 1].ties[0];
  T.ch = fin.w;
  T.ru = fin.w == fin.a ? fin.b : fin.a;
  T.stage = {};
  teams.forEach((n) => {
    const top = T.ko.length + 1;
    T.stage[n] = n == T.ch ? "Champions" : n == T.ru ? "Runners-up" : stage[n] == 0 ? "Group stage" : (() => {
      const r = T.ko.length - (stage[n] - 1);
      const names = ["Final", "Semi-finals", "Quarter-finals", "Round of 16", "Round of 32"];
      return "Lost " + names[Math.max(0, r)].toLowerCase();
    })();
  });
  teams.forEach((n) => {
    if (n == T.ch || n == T.ru) return;
    let ex = null;
    T.ko.forEach((r) => r.ties.forEach((t) => {
      if ((t.a == n || t.b == n) && t.w != n) ex = r.name;
    }));
    T.stage[n] = ex ? "Out in the " + ex.toLowerCase().replace("finals", "final").replace("round of", "round of") : "Out in the group stage";
  });
  const bo = Object.values(TG).sort((a, b) => b.g - a.g)[0];
  T.boot = bo ? [bo.n, bo.nt, bo.g] : null;
  teams.forEach((n) => {
    const xi = new Set(xs[n].map((p) => p.id));
    ntSel(NM[n]).forEach((p) => {
      if (!xi.has(p.id)) p.ic = (p.ic || 0) + pois(played[n] * 0.35);
    });
  });
  const win = T.ch, fi = T.ru;
  G.t.forEach((t) => t.pl.forEach((p) => {
    if (!p.nt || !(p.nt in T.stage)) return;
    const s = T.stage[p.nt];
    p.cd = cl((p.cd || 100) + 30, 30, 100);
    p.mo = cl(p.mo + (p.nt == win ? 9 : p.nt == fi ? 4 : s.includes("group") ? -2 : 1), 0, 100);
  }));
  TG = null;
  return T;
}
function tourSeason() {
  if (!G.lg || typeof WS == "undefined" || !WS && !G.wp) return;
  ensureNat();
  if (G.tp) tpSimAll();
  if (G.tq && !G.tq.done) tqFinalize();
  const ys = G.season - 1, yr = 2026 + ys, ks = ys % 4 == 0 ? ["wc"] : ys % 4 == 2 ? ["eu", "sa", "na", "af", "as"] : [];
  if (!ks.length) return;
  const M = natMap(), nats = competes(M);
  G.itn = G.itn || [];
  G.itw = G.itw || [];
  const me = G.t[G.me], mine = [];
  ks.forEach((k) => {
    let f = tmField(k, nats);
    if (f.length < TD[k].n) return;
    if (G.nm && !G.tp && nats.includes(G.nm.n) && (k == "wc" || TD[k].c == confOf(G.nm.n))) {
      if (tqVerdict(k, ys)) {
        tpInit(k, f);
        return;
      }
      f = tqExclude(f, nats);
    }
    const T = tmRun(k, f, M);
    T.y = yr;
    G.itn.push(T);
    G.itw.push({ y: yr, name: T.name, ch: T.ch, ru: T.ru, boot: T.boot });
    me.pl.forEach((p) => {
      if (p.nt in T.stage) mine.push(`${p.n} (${ncode(p.nt)}) ${T.stage[p.nt].toLowerCase()} at the ${yr} ${T.name}`);
    });
  });
  G.itn = G.itn.slice(-8);
  if (mine.length) G.ilog = [`Summer ${yr}: ${mine.slice(0, 10).join(" · ")}`].concat(G.ilog || []).slice(0, 8);
}
