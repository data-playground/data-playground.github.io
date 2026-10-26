// Match engine: tactics, chances, goals, cards, injuries, subs
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const PB = { GK: 6.14, DF: 6.18, MF: 6.36, FW: 6.5 };
const ROLE = { key: { x: 0.85, k: 4, n: "key player", s: "Key" }, starter: { x: 0.7, k: 3.5, n: "first-team regular", s: "Regular" }, rotation: { x: 0.3, k: 2.5, n: "rotation option", s: "Rotation" }, prospect: { x: 0.2, k: 3, n: "prospect", s: "Prospect" }, youth: { x: 0.05, k: 0.8, n: "developing youngster", s: "Youth" }, depth: { x: 0.05, k: 0.8, n: "squad depth player", s: "Depth" } };
const TEM = { balanced: 1, attack: 1.18, counter: 0.9 }, sc_ = (x) => x.o - Math.max(0, 85 - x.cd) * 0.1, mood = (m) => m >= 75 ? "Great" : m >= 60 ? "Good" : m >= 45 ? "OK" : m >= 30 ? "Poor" : "Unhappy";
const STY = { balanced: { t: 1, q: 1, d: 1, o: 1 }, attack: { t: 1.2, q: 1, d: 0.88, o: 1.12 }, counter: { t: 0.88, q: 1.08, d: 1.04, o: 0.94 } };
const FMX = { "4-2-3-1": { a: 1.02, m: 1.03, d: 0.99 }, "4-1-4-1": { a: 0.95, m: 1.04, d: 1.04 }, "3-4-3": { a: 1.08, m: 1, d: 0.9 }, "5-4-1": { a: 0.9, m: 1, d: 1.12 }, "4-4-2": { a: 1, m: 1, d: 1 }, "4-3-3": { a: 1.05, m: 0.97, d: 0.97 }, "5-3-2": { a: 0.96, m: 0.98, d: 1.1 }, "3-5-2": { a: 1, m: 1.04, d: 0.94 } };
function strOld(t, fx) {
  const X0 = FMX[t.f] || FMX["4-4-2"], cf = 1 + ((t.co ? t.co.abil : 60) - 60) * 4e-4, X = { a: X0.a * cf, m: X0.m * cf, d: X0.d * cf };
  const L = t.xi.map((i) => t.pl[i]), av = (p) => {
    const a = L.filter((x) => x.pos == p);
    return a.length ? a.reduce((s, x) => s + x.o + cl((x.fm - PB[x.pos]) * 1.5, -2, 2) + (x.mo - 60) * 0.02 + (fx ? fx(x) : 0), 0) / a.length : 35;
  };
  return { a: (av("FW") * 0.65 + av("MF") * 0.35) * X.a, m: av("MF") * X.m, d: (av("DF") * 0.6 + av("GK") * 0.4) * X.d, k: av("GK"), all: L.reduce((s, x) => s + x.o, 0) / Math.max(L.length, 1) };
}
function valid(t) {
  return t.xi.length == 11 && t.xi.every((i) => i >= 0 && t.pl[i]) && t.pl[t.xi[0]].sp == "GK";
}
function play(H, A) {
  const it = mgen(H, A, -1);
  let r;
  while (!(r = it.next()).done) ;
  return r.value;
}
function* mgen(H, A, hu) {
  const T = [H, A], S = [str(H), str(A)], g = [0, 0], log = [], yc = {}, off = {}, pg = {}, ns = [0, 0], used = [{}, {}], tm = {}, rc = [0, 0], M = { T, S, g, log, ns, off, hs: hu, min: 0 }, ein = new Map();
  let cm = 0;
  const add = (m, t, k) => log.push({ m, t, k, s: g.slice() });
  add(0, `Kick-off: ${H.name} vs ${A.name}.`);
  const dr = (x, s) => 22 / 90 * (x.pos == "GK" ? 0.6 : 1) * (x.a < 23 ? 0.95 : x.a <= 27 ? 1 : 1 + (x.a - 27) * 0.07) * TEM[T[s].style] * (1 - 0.1 * sf(T[s], "fit")), fx = (x) => {
    const e = ein.get(x);
    return e ? -Math.max(0, 78 - (x.cd - (cm - e.a) * dr(x, e.s))) * 0.14 : 0;
  };
  const x0 = T.map((t) => t.xi.slice()), f0 = T.map((t) => t.f), cs0 = T.map((t) => t.cs);
  T.forEach((t, s) => t.xi.forEach((i, k) => {
    used[s][i] = 1;
    ein.set(t.pl[i], { a: 0, s });
    tm[t.name + i] = { s, i, a: 0, b: 90, sl: k };
  }));
  const fm_ = (s) => {
    S[s] = str(T[s], fx, new Set(T[s].xi.filter((i) => off[T[s].name + i])));
    const f = Math.pow(0.92, rc[s]) * tf[s];
    ["a", "m", "d"].forEach((x) => S[s][x] *= f);
  };
  const bn = (s) => T[s].pl.map((p, i) => i).filter((i) => !used[s][i] && !T[s].pl[i].inj && !T[s].pl[i].sus);
  const sub = (s, o, n, m, w) => {
    const t = T[s];
    const k = t.xi.indexOf(o);
    t.xi[k] = n;
    used[s][n] = 1;
    ein.set(t.pl[n], { a: m, s });
    ns[s]++;
    tm[t.name + o].b = m;
    tm[t.name + n] = { s, i: n, a: m, b: 90, sl: k };
    fm_(s);
    add(m, `Substitution (${t.name}): ${t.pl[n].n} replaces ${t.pl[o].n}${w}.`, "s");
  };
  M.bn = bn;
  M.sub = sub;
  const ast = {}, sv = {}, nz = {}, tf = [1, 1], sh = [0, 0], ot = [0, 0];
  let pp = 0;
  const rate = (s, i) => {
    const p = T[s].pl[i], k = T[s].name + i, gd = g[s] - g[1 - s], cs = g[1 - s] == 0;
    if (nz[k] == null) nz[k] = rn(-0.5, 0.5);
    return cl(6.2 + cl(gd * 0.2, -0.8, 0.8) + (pg[k] || 0) * 0.9 + (ast[k] || 0) * 0.4 + (sv[k] || 0) * 0.05 + (off[k] && !p.inj ? -1.5 : 0) + (p.pos == "GK" || p.pos == "DF" ? cs ? 0.5 : -0.15 * g[1 - s] : 0) + (p.pos == "MF" && cs ? 0.15 : 0) + nz[k], 3.5, 10);
  };
  M.tm = tm;
  M.yc = yc;
  M.pg = pg;
  M.ast = ast;
  M.sv = sv;
  M.rate = rate;
  const gkFix = (q, n, o, m) => {
    const t = T[q], kg = t.xi[0], ko = t.xi.indexOf(o);
    if (n != null) {
      t.xi[0] = n;
      t.xi[ko] = kg;
      used[q][n] = 1;
      ein.set(t.pl[n], { a: m, s: q });
      ns[q]++;
      tm[t.name + o].b = m;
      tm[t.name + n] = { s: q, i: n, a: m, b: 90, sl: 0 };
      add(m, `${t.name} bring on goalkeeper ${t.pl[n].n} for ${t.pl[o].n}.`, "s");
    } else {
      t.xi[0] = o;
      t.xi[ko] = kg;
      tm[t.name + o].sl = null;
      add(m, `${t.pl[o].n} goes in goal for ${t.name}.`, "s");
    }
    fm_(q);
  };
  const autoGK = (q, m) => {
    const t = T[q], bg = bn(q).filter((j) => t.pl[j].pos == "GK"), on = t.xi.filter((i, k) => k > 0 && !off[t.name + i]).sort((x, y) => t.pl[x].o - t.pl[y].o);
    if (on.length) gkFix(q, bg.length && ns[q] < 5 ? bg[0] : null, on[0], m);
  };
  M.gkFix = gkFix;
  M.tf = tf;
  M.fm = fm_;
  M.ttd = {};
  M.swap = (s, a, b) => {
    const t = T[s];
    [t.xi[a], t.xi[b]] = [t.xi[b], t.xi[a]];
    Object.values(tm).forEach((q) => {
      if (q.s == s) q.sl = null;
    });
    fm_(s);
  };
  M.move = (s, k, x, y) => {
    const t = T[s];
    if (!moveSlotOf(t, k, x, y)) return;
    Object.values(tm).forEach((q) => {
      if (q.s == s) q.sl = null;
    });
    fm_(s);
  };
  M.reform = (s, f) => {
    const t = T[s], kg = t.xi[0], keep = t.xi.filter((i, k) => k > 0 && !off[t.name + i]), gh = t.xi.filter((i, k) => k > 0 && off[t.name + i]), S2 = SL[f], xi = Array(11).fill(-1), free = [...keep];
    xi[0] = kg;
    for (let n = 0; n < keep.length; n++) {
      let b = null;
      for (let k = 1; k < 11; k++) {
        if (xi[k] >= 0) continue;
        for (const i of free) {
          const sc = sc_(t.pl[i]) - pen(t.pl[i], S2[k][0]);
          if (!b || sc > b.sc) b = { k, i, sc };
        }
      }
      if (!b) break;
      xi[b.k] = b.i;
      free.splice(free.indexOf(b.i), 1);
    }
    let g2 = 0;
    for (let k = 1; k < 11; k++) if (xi[k] < 0) xi[k] = gh[g2++];
    t.f = f;
    t.cs = null;
    t.xi = xi;
    Object.values(tm).forEach((q) => {
      if (q.s == s) q.sl = null;
    });
    fm_(s);
    add(M.min, `${t.name} change shape to ${f}.`, "s");
  };
  M.cnd = (s, i) => {
    const x = T[s].pl[i], e = ein.get(x);
    return Math.round(e ? x.cd - (cm - e.a) * dr(x, s) : x.cd);
  };
  for (let m = 1; m <= 90; m++) {
    M.min = cm = m;
    yield M;
    if (m == 1 && (hu == 0 || hu == 1)) {
      M.req = "tt";
      yield M;
      M.req = null;
    }
    if (m % 5 == 0) {
      fm_(0);
      fm_(1);
    }
    if (m == 46) {
      add(45, `Half-time: ${H.name} ${g[0]}-${g[1]} ${A.name}.`);
      if (hu == 0 || hu == 1) {
        tf[hu] = 1;
        fm_(hu);
        M.req = "ht";
        yield M;
        M.req = null;
      }
    }
    for (let s2 = 0; s2 < 2; s2++) {
      const t = T[s2], xs = t.xi.filter((i) => !off[t.name + i]);
      if (xs.length && Math.random() < 12e-4 * (1 + Math.max(0, 80 - xs.reduce((a, i) => a + t.pl[i].cd, 0) / xs.length) / 60) * (1 - (ef(t, "md") - 8) * 0.012)) {
        const i = pick(xs), p2 = t.pl[i];
        p2.inj = Math.max(1, Math.round((Math.random() < 0.7 ? 1 + (Math.random() * 3 | 0) : Math.random() < 0.8 ? 4 + (Math.random() * 5 | 0) : 9 + (Math.random() * 12 | 0)) * (1 - (ef(t, "md") - 8) * 0.025) * (1 - 0.15 * sf(t, "phy"))));
        add(m, `${p2.n} (${t.name}) goes down injured.`, "c");
        const b = bn(s2), k0 = t.xi.indexOf(i), sp0 = slOf(t)[k0][0], pool = (p2.pos == "GK" ? b.filter((j2) => t.pl[j2].pos == "GK") : b.filter((j2) => t.pl[j2].pos != "GK")).sort((x, y) => t.pl[y].o - pen(t.pl[y], sp0) - (t.pl[x].o - pen(t.pl[x], sp0)));
        if (ns[s2] < 5 && pool.length) sub(s2, i, pool[0], m, " (injury)");
        else {
          off[t.name + i] = 1;
          tm[t.name + i].b = m;
          rc[s2] += 0.6;
          fm_(s2);
        }
      }
      if (s2 != hu && ns[s2] < 5 && m >= 55 && m < 89 && Math.random() < 0.09) {
        const gd = g[s2] - g[1 - s2], on = t.xi.filter((i, k) => k > 0 && !off[t.name + i]), b = bn(s2).filter((j2) => t.pl[j2].pos != "GK");
        if (on.length && b.length) {
          const ch = gd < 0 && m > 60, gu = gd > 0 && m > 70, fr = ch ? on.filter((i) => t.pl[i].pos != "FW") : gu ? on.filter((i) => t.pl[i].pos != "DF") : on, o2 = pick((fr.length ? fr : on).sort((x, y) => M.cnd(s2, x) - M.cnd(s2, y)).slice(0, 3)), sp1 = slOf(t)[t.xi.indexOf(o2)][0], fit = (j2) => t.pl[j2].o - pen(t.pl[j2], sp1) + (ch && t.pl[j2].pos == "FW" ? 2 : 0) + (gu && t.pl[j2].pos == "DF" ? 2 : 0), pool = [...b].sort((x, y) => fit(y) - fit(x)), n = Math.random() < 0.6 ? pool[0] : pick(pool.slice(0, 3));
          sub(s2, o2, n, m, "");
        }
      }
    }
    if (Math.random() < 0.045) {
      const s2 = Math.random() < 0.5 ? 0 : 1, i = pick(T[s2].xi), p2 = T[s2].pl[i], k = T[s2].name + i;
      if (!off[k] && !(yc[k] && Math.random() < 0.8)) {
        yc[k] = (yc[k] || 0) + 1;
        if (yc[k] > 1 || Math.random() < 0.01) {
          off[k] = 1;
          add(m, yc[k] > 1 ? `Second yellow, then red: ${p2.n} (${T[s2].name}) is sent off!` : `RED CARD! ${p2.n} (${T[s2].name}) is sent off.`, "c");
          p2.r++;
          p2.sus = yc[k] > 1 ? 1 : 2;
          tm[k].b = m;
          rc[s2]++;
          fm_(s2);
        } else {
          add(m, `Yellow card: ${p2.n} (${T[s2].name}).`);
          p2.y++;
          if (p2.y % 5 == 0) p2.sus = 1;
        }
      }
    }
    for (let q = 0; q < 2; q++) {
      const tq = T[q];
      if (off[tq.name + tq.xi[0]]) {
        if (q == hu) {
          M.gk = q;
          M.req = "gk";
          yield M;
          while (M.gk != null) yield M;
          M.req = null;
        } else autoGK(q, m);
      }
    }
    pp += S[0].m * 1.05 / (S[0].m * 1.05 + S[1].m);
    const pm = S[0].m * 1.05 / (S[0].m * 1.05 + S[1].m), s = Math.random() < pm ? 0 : 1, o = 1 - s, sy = T[s].style, oy = T[o].style;
    if (Math.random() > 0.52 * STY[sy].t * STY[oy].o) continue;
    const att = S[s].a + (s == 0 ? 8 : 0), df = S[o].d * STY[oy].d;
    if (Math.random() > cl(0.52 + (att - df) / 380, 0.2, 0.85)) continue;
    sh[s]++;
    const w = T[s].xi.map((i, k) => off[T[s].name + i] ? 0 : SW[slOf(T[s])[k][0]]), tot = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * tot, j = 0;
    while (r > w[j]) {
      r -= w[j];
      j++;
    }
    const p = T[s].pl[T[s].xi[j]], gk = T[o].pl[T[o].xi[0]] || { n: "the keeper" };
    let gp = cl(0.1 + (att - S[o].k) / 820, 0.03, 0.3);
    gp *= STY[sy].q * (sy == "counter" && oy == "attack" ? 1.12 : 1);
    if (Math.random() < gp) {
      g[s]++;
      ot[s]++;
      p.g++;
      let asn = null;
      {
        const ws = T[s].xi.map((i, k) => k == j || off[T[s].name + i] ? 0 : ASW[slOf(T[s])[k][0]] || 1), ts = ws.reduce((a, b) => a + b, 0);
        if (ts > 0 && Math.random() < 0.72) {
          let r2 = Math.random() * ts, j2 = 0;
          while (r2 > ws[j2]) {
            r2 -= ws[j2];
            j2++;
          }
          const q = T[s].pl[T[s].xi[j2]];
          if (q) {
            q.as = (q.as || 0) + 1;
            const ak = T[s].name + T[s].xi[j2];
            ast[ak] = (ast[ak] || 0) + 1;
            asn = q.n;
          }
        }
      }
      pg[T[s].name + T[s].xi[j]] = (pg[T[s].name + T[s].xi[j]] || 0) + 1;
      add(m, pick([`GOAL! ${p.n} fires it home for ${T[s].name}!`, `${p.n} finds the net for ${T[s].name}.`, `${T[s].name} score! ${p.n} with a clinical finish.`]) + (asn ? ` Assist: ${asn}.` : ""), "g");
    } else {
      const mi = [`${p.n} shoots, ${gk.n} saves.`, `${p.n} drags it wide.`, `${p.n} blazes over the bar.`, `A block denies ${p.n}.`], ix = Math.random() * 4 | 0;
      add(m, mi[ix]);
      if (ix == 0) {
        ot[s]++;
        const gk_ = T[o].name + T[o].xi[0];
        sv[gk_] = (sv[gk_] || 0) + 1;
      }
    }
  }
  add(90, `Full time: ${H.name} ${g[0]}-${g[1]} ${A.name}.`);
  [0, 1].forEach((s) => {
    const gd = g[s] - g[1 - s], cs = g[1 - s] == 0;
    Object.values(tm).filter((q) => q.s == s).forEach((q) => {
      const i = q.i, p = T[s].pl[i], k = T[s].name + i, mm = q.b - q.a;
      p.pl = 1;
      p.mn += mm;
      p.lm = mm;
      p.lx = mm;
      p.cd = Math.max(20, p.cd - mm * dr(p, s));
      {
        const sp = q.sl != null && slOf(T[s])[q.sl][0];
        if (sp && p.sp != sp && mm >= 45) {
          p.fam = p.fam || {};
          p.fam[sp] = Math.min(90, (p.fam[sp] || 0) + 3);
        }
      }
      if (mm < 10) return;
      let r = rate(s, i);
      p.mo = cl(p.mo + (gd > 0 ? 1 : gd < 0 ? -1 : 0) + (r >= 7.5 ? 1.5 : r <= 5.2 ? -1.5 : 0), 0, 100);
      p.ap++;
      p.rs += r;
      p.lr = r;
      {
        const al = Math.max(0.2, 1 / (p.ap + 1));
        p.fm = p.fm * (1 - al) + r * al;
      }
    });
  });
  const rt = [];
  if (hu == 0 || hu == 1) Object.entries(tm).forEach(([k, q]) => {
    if (q.s != hu) return;
    const p = T[hu].pl[q.i], mm = q.b - q.a;
    rt.push({ n: p.n, sp: p.sp, r: mm >= 10 ? +rate(hu, q.i).toFixed(1) : null, g: pg[k] || 0, a: ast[k] || 0, y: yc[k] || 0, rd: off[k] ? 1 : 0, a0: q.a, b: q.b });
  });
  T.forEach((t, s) => {
    t.xi = x0[s];
    t.f = f0[s];
    t.cs = cs0[s];
  });
  return { g, log, rt, st: { sh, ot, pp: Math.round(pp / 90 * 100) } };
}
function apply(h, a, g) {
  const H = G.t[h], A = G.t[a];
  {
    const gt = gate(H, H.pos || H.exp);
    H.fn.tk += gt.rev;
    H.bud += gt.rev;
    H.fs += gt.full;
    H.nh++;
    H.la = gt;
  }
  [[H, g[0] - g[1]], [A, g[1] - g[0]]].forEach(([t, d]) => t.pl.forEach((p) => p.mo = cl(p.mo + (d > 0 ? 1 : d < 0 ? -1 : 0), 0, 100)));
  H.GF += g[0];
  H.GA += g[1];
  A.GF += g[1];
  A.GA += g[0];
  if (g[0] > g[1]) {
    H.P += 3;
    H.W++;
    A.L++;
  } else if (g[0] < g[1]) {
    A.P += 3;
    A.W++;
    H.L++;
  } else {
    H.P++;
    A.P++;
    H.D++;
    A.D++;
  }
}
function table(l) {
  l = l == null ? G.t[G.me].lg : l;
  return G.lg[l].ids.map((i) => G.t[i]).sort((a, b) => b.P - a.P || b.GF - b.GA - (a.GF - a.GA) || b.GF - a.GF);
}
