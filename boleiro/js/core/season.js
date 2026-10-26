// Season rollover
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const ASW = { ST: 1.4, LW: 3, RW: 3, AM: 3.5, CM: 2.2, DM: 1, LB: 1.3, RB: 1.3, CB: 0.3, GK: 0.02 };
function rollover() {
  stYear();
  ensureAcad();
  finSeason();
  contSeason();
  wpSeason();
  G.pr = calcPR();
  careerEnd();
  applyPR();
  G.lg.forEach((l) => l.fix = mkFix(l));
  const R = { ch: [], ret: [], yth: [], exp: [], ac: { in: [], left: [] } }, MN = { GK: 2, DF: 6, MF: 6, FW: 4 };
  G.t.forEach((t) => t.pl.filter((p) => p.ln != null).forEach((p) => {
    t.pl.splice(t.pl.indexOf(p), 1);
    const L = G.t[p.ln];
    if (p.yl && p.a + 1 <= AL) {
      const x = dev(p, L);
      p.o = cl(Math.round(p.o + x.d), 30, 95);
      p.pot = Math.max(p.pot, p.o);
      p.a++;
      const q = acLean(p);
      q.sk = 1;
      L.ac.push(q);
    } else L.pl.push(p);
    p.yl = 0;
    p.l0 = null;
    p.ln = null;
  }));
  G.t.forEach((t) => {
    const hu = t.id == G.me;
    let keep = [];
    t.pl.forEach((p) => {
      const old = p.o, x = dev(p, t);
      p.o = cl(Math.round(p.o + x.d), 30, 95);
      if (p.o > old) p.o = Math.min(p.o, Math.max(old, p.pot + 1));
      p.pot = Math.max(p.pot, p.o);
      p.a++;
      const ag = p.pos == "GK" ? p.a - 2 : p.a, rp = ag < 34 ? 0 : ag == 34 ? 0.25 : ag == 35 ? 0.5 : ag == 36 ? 0.8 : 1;
      if (Math.random() < rp) {
        hu && R.ret.push(p);
      } else {
        keep.push(p);
        hu && R.ch.push({ p, old, x });
      }
    });
    let wc = keep.filter((p) => p.cy > 1).reduce((a, p) => a + p.w, 0);
    keep = keep.filter((p) => {
      p.cy--;
      if (p.cy > 0) return true;
      if (hu) {
        R.exp.push(p);
        G.fa.push(p);
        return false;
      }
      if (Math.random() < 0.8 && wc + wageFor(p) <= 0.65 * t.ann) {
        wc += wageFor(p);
        p.w = wageFor(p);
        p.cy = 2 + (Math.random() * 3 | 0);
        return true;
      }
      G.fa.push(p);
      return false;
    });
    acYear(t, hu, R, keep);
    const cnt = (q) => keep.filter((p) => p.pos == q).length, need = [];
    for (const q in MN) for (let k = cnt(q); k < MN[q]; k++) need.push(q);
    while (need.length < 3) need.push(pick(["DF", "DF", "MF", "MF", "FW", "FW", "GK"]));
    need.forEach((q) => {
      const y0 = acPull(t, q);
      if (y0) {
        keep.push(y0);
        hu && R.yth.push(y0);
        return;
      }
      {
        const y1 = acMk(t, Math.round(rn(17, 19)), q);
        keep.push(acFull(y1));
        hu && R.yth.push(y1);
        return;
      }
      const o = Math.round(42 + (t.rep - 52) / 28 * 10 + rn(-6, 6) + (ef(t, "yt") - 8) * 0.8), y = { n: pick(FN)[0] + ". " + pick(LN), pos: q, o, a: Math.round(rn(16, 19)), pot: cl(o + Math.round(rn(8, 36) + (t.rep - 60) * 0.7 + (ef(t, "yt") - 8) * 1.2 + (Math.random() < 0.04 ? 15 : 0)), o, 92), g: 0, y: 0, r: 0, ap: 0, mn: 0, inj: 0, sus: 0, pl: 0, cd: 100, mo: 60, rs: 0, fm: 6.3, w: 0.02, cy: 3, id: uid(), ls: null, nt: natFor(G.lg[t.lg].cn, lgNats()) };
      setSp(y, pick(SPG[q]));
      keep.push(y);
      hu && R.yth.push(y);
    });
    while (!hu && keep.length > 24) {
      const c = keep.filter((p) => cnt(p.pos) > MN[p.pos]).sort((a, b) => a.o + 0.3 * a.pot - b.o - 0.3 * b.pot)[0];
      if (!c) break;
      if (c.a <= AL) t.ac.push(acLean(c));
      else G.fa.push(c);
      keep.splice(keep.indexOf(c), 1);
    }
    {
      t.bud = +Math.min(t.bud, Math.max(4, t.ann * 2)).toFixed(2);
    }

    t.pl = keep;
    t.P = t.W = t.D = t.L = t.GF = t.GA = 0;
    keep.forEach((p) => {
      p.as = 0;
      p.g = p.y = p.r = p.ap = p.rs = p.mn = 0;
      p.sus = 0;
      p.inj = 0;
      p.cd = 100;
      p.mo = (p.mo + 60) / 2;
      p.fm = (p.fm + 6.3) / 2;
    });
    auto(t);
  });
  G.season++;
  G.round = 0;
  G.vl = null;
  G.res = [];
  tourSeason();
  G.fa.forEach((p) => {
    p.a++;
    if (p.a > 29) p.o -= 1;
    p.pot = Math.max(p.o, p.pot - 1);
    p.inj = 0;
    p.sus = 0;
  });
  G.fa = G.fa.filter((p) => p.a < 35 && p.o >= 45).sort((a, b) => b.o - a.o).slice(0, 40);
  G.news = [];
  aiMarket("Summer");
  prep();
  G.goal = goalFor();
  G.review = R;
  genGoals();
  mkOffers();
  genOffers();
  view = G.jl ? "career" : "review";
  autoSave();
  render();
}
