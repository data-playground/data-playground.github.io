// Youth academy and loans
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const AL = 23, ACG = { 15: 4.2, 16: 4.2, 17: 4, 18: 3.6, 19: 3, 20: 1.5, 21: 0.8, 22: 0.4, 23: 0.2 };
const acRange = (p) => {
  const e = Math.round((p.pe || 0) * Math.max(0, (23 - p.a) / 8)), m = Math.round(2 + Math.max(0, 22 - p.a) * 0.5);
  return [Math.min(95, Math.round(p.pot + e - m)), Math.min(95, Math.round(p.pot + e + m))];
};
function acMk(t, age, pos) {
  const yt = ef(t, "yt"), o = cl(Math.round(28 + (t.rep - 52) / 28 * 8 + (yt - 8) * 0.8 + (age - 15) * 3.4 + rn(-5, 5)), 22, 80), pot = cl(o + Math.round(rn(8, 36) * Math.max(0.5, 1 - (age - 15) * 0.08) + (t.rep - 60) * 0.5 + (yt - 8) * 1.2 + (Math.random() < 0.04 ? 14 : 0)), o, 92);
  const y = { n: pick(FN)[0] + ". " + pick(LN), pos, o, a: age, pot, id: uid(), nt: natFor(G.lg[t.lg].cn, lgNats()), pe: Math.round(rn(-3, 3)) };
  setSp(y, pick(SPG[pos]));
  return y;
}
const acLean = (p) => ({ n: p.n, pos: p.pos, sp: p.sp, o: p.o, a: p.a, pot: p.pot, id: p.id, nt: p.nt, pe: p.pe != null ? p.pe : Math.round(rn(-3, 3)), pc: p.pc, ae: p.ae, fam: p.fam });
const acFull = (p) => {
  Object.assign(p, { g: 0, y: 0, r: 0, ap: 0, mn: 0, inj: 0, sus: 0, pl: 0, cd: 100, mo: 65, rs: 0, fm: 6.3, ls: null, cy: 3 });
  p.w = Math.max(0.02, +(wageFor(p) * 0.6).toFixed(3));
  return p;
};
const acPos = () => pick(["GK", "DF", "DF", "DF", "DF", "MF", "MF", "MF", "MF", "FW", "FW", "FW"]);
function ensureAcad() {
  if (!G || !G.t) return;
  G.t.forEach((t) => {
    if (t.ac) return;
    t.ac = [];
    const n = cl(Math.round(12 + (ef(t, "yt") - 8) * 0.8 + rn(-2, 2)), 8, 22);
    for (let i = 0; i < n; i++) t.ac.push(acMk(t, 15 + i % 9, acPos()));
    if (t.pl.length > 24) {
      const rk = t.pl.slice().sort((a, b) => b.o - a.o);
      const cand = rk.slice(20).filter((p) => p.a <= AL && p.ls != "S").sort((a, b) => a.o - b.o);
      let mv = 0;
      for (const p of cand) {
        if (t.pl.length <= 24 || mv >= 8 || cnt(t, p.pos) <= MNH[p.pos]) break;
        mut(t, () => t.pl.splice(t.pl.indexOf(p), 1));
        t.ac.push(acLean(p));
        mv++;
      }
      if (mv && t.id == G.me) G.msg = `${mv} surplus youngster${mv > 1 ? "s were" : " was"} moved from your senior squad to the academy to make room. See the Youth tab.`;
    }
  });
}
function acYear(t, hu, R, keep) {
  const yt = ef(t, "yt");
  if (!t.ac) t.ac = [];
  t.ac.forEach((p) => {
    if (p.sk) {
      p.sk = 0;
      return;
    }
    p.o = cl(Math.round(p.o + (ACG[p.a] || 0.2) * cl((p.pot - p.o) / 10, 0.25, 1.4) * (1 + (yt - 8) * 0.04) + rn(-1, 1)), 22, 90);
    p.pot = Math.max(p.pot, p.o);
    p.a++;
    p.ls = null;
  });
  const MNx = { GK: 2, DF: 6, MF: 6, FW: 4 }, th = (q) => {
    const ps = keep.filter((x) => x.pos == q).map((x) => x.o).sort((a, b) => b - a);
    return ps[Math.min(ps.length, MNx[q]) - 1] || 0;
  };
  t.ac.slice().sort((a, b) => b.o - a.o).forEach((p) => {
    const T = th(p.pos);
    if (!hu && keep.length < 25 && (p.a >= 18 && p.o >= T - 5 || p.a >= AL && p.o >= T - 12 || p.a >= 19 && p.pot >= T + 6 && p.o >= T - 10)) {
      t.ac.splice(t.ac.indexOf(p), 1);
      keep.push(acFull(p));
      return;
    }
    if (p.a > AL || !hu && (p.a >= 18 && p.pot < T - 6 || p.a >= 20 && p.o < T - 14)) {
      t.ac.splice(t.ac.indexOf(p), 1);
      if (p.o >= 42) {
        acFull(p);
        G.fa.push(p);
      }
      hu && R.ac.left.push(p);
    }
  });
  const n = cl(Math.round(5 + (yt - 8) * 0.25 + rn(-1.5, 1.5)), 3, 7);
  for (let i = 0; i < n; i++) {
    const y = acMk(t, Math.random() < 0.6 ? 15 : 16, acPos());
    t.ac.push(y);
    hu && R.ac.in.push(y);
  }
}
function acPull(t, q) {
  const c = t.ac.filter((p) => p.pos == q && p.a >= 16).sort((a, b) => b.o + 0.3 * b.pot - (a.o + 0.3 * a.pot))[0];
  if (!c) return null;
  t.ac.splice(t.ac.indexOf(c), 1);
  return acFull(c);
}
function promoteY(i) {
  const me = G.t[G.me], p = me.ac[i];
  if (!p || busy) return;
  if (me.pl.length >= 28) return note("Your squad is full (28). Release, sell or send someone down first.");
  me.ac.splice(i, 1);
  acFull(p);
  G.ob = G.ob.filter((o) => o.pid != p.id);
  mut(me, () => me.pl.push(p));
  roles(me);
  G.msg = `${p.n} (${p.pos}, ${p.o}) was promoted to the senior squad on a 3-year deal.`;
  render();
}
function relY(i) {
  const me = G.t[G.me], p = me.ac[i];
  if (!p || busy) return;
  me.ac.splice(i, 1);
  G.ob = G.ob.filter((o) => o.pid != p.id);
  if (p.o >= 45) {
    acFull(p);
    G.fa.push(p);
  }
  G.msg = `${p.n} left the academy.`;
  render();
}
function sendDown(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p || busy) return;
  if (p.a > AL) return note(`${p.n} is too old for the academy (limit ${AL}).`);
  if (me.pl.length <= 16 || cnt(me, p.pos) <= MNH[p.pos]) return note("You need squad cover in that position first.");
  G.ob = G.ob.filter((o) => o.pid != p.id);
  mut(me, () => me.pl.splice(me.pl.indexOf(p), 1));
  me.ac.push(acLean(p));
  roles(me);
  G.msg = `${p.n} was sent down to the academy.`;
  render();
}
function ySend(p, me, b, fee, loan) {
  const i = me.ac.indexOf(p);
  if (i >= 0) me.ac.splice(i, 1);
  acFull(p);
  move(p, null, b, fee, false);
  if (fee) {
    me.bud = +(me.bud + fee).toFixed(2);
    me.fn.tr += fee;
  }
  if (loan) {
    p.ln = me.id;
    p.yl = 1;
    p.l0 = { ap: 0, mn: 0, g: 0, as: 0 };
    p.w = Math.max(0.02, p.w);
    p.cy = Math.max(p.cy, 2);
  }
}
function sellY(i) {
  const me = G.t[G.me], p = me.ac[i];
  if (!p || busy || !winOpen()) return note("The transfer window is closed.");
  const o = offer(p);
  if (!o) return note("No club is interested right now.");
  ySend(p, me, o.b, o.pr, false);
  G.ob = G.ob.filter((x) => x.pid != p.id);
  news(`${me.name} sell ${p.n} (${p.pos}, ${p.o}) to ${o.b.name} for ${fm1(o.pr)}.`);
  G.msg = `Sold ${p.n} from the academy to ${o.b.name} for ${fm1(o.pr)}.`;
  render();
}
function loanY(i) {
  const me = G.t[G.me], p = me.ac[i];
  if (!p || busy || !winOpen()) return note("The transfer window is closed.");
  const c = G.t.filter((b) => b.id != G.me && b.pl.length < 26 && nd(b, p.pos) <= p.o + 2).sort((x, y) => y.exp - x.exp)[0];
  if (!c) return note("No club has a place for him in the first team yet.");
  ySend(p, me, c, 0, true);
  G.ob = G.ob.filter((x) => x.pid != p.id);
  news(`${me.name} loan ${p.n} (${p.pos}, ${p.o}) to ${c.name}.`);
  G.msg = `${p.n} is on loan at ${c.name} until the end of the season. He returns to your academy afterwards.`;
  render();
}
function listY(i, t) {
  const p = G.t[G.me].ac[i];
  if (!p) return;
  p.ls = p.ls == t ? null : t;
  genOffers();
  note(p.ls ? `${p.n} is now listed for ${p.ls == "S" ? "sale" : "loan"}. Clubs may make offers while the window is open.` : `${p.n} is no longer listed.`);
}
function recallLoan(id) {
  const me = G.t[G.me], ps = fp(id);
  if (!ps || !ps.t || ps.p.ln != me.id) return note("He is not on loan from your club.");
  const p = ps.p, s = ps.t;
  if (!(p.yl && p.a <= AL) && me.pl.length >= 28) return note("Your squad is full (28). Make room before recalling him.");
  mut(s, () => s.pl.splice(s.pl.indexOf(p), 1));
  roles(s);
  p.ln = null;
  p.ls = null;
  if (p.yl && p.a <= AL) {
    p.yl = 0;
    me.ac.push(acLean(p));
    G.msg = `${p.n} was recalled and is back in your academy.`;
  } else {
    p.yl = 0;
    mut(me, () => me.pl.push(p));
    roles(me);
    G.msg = `${p.n} was recalled to your senior squad.`;
  }
  render();
}
function acNotes(me) {
  ensureAcad();
  const L = [];
  (me.ac || []).filter((p) => p.a >= AL).forEach((p) => L.push(`${p.n} (${p.a}) has reached the academy age limit: promote, sell or loan him before the season ends or he leaves.`));
  const n = (me.ac || []).filter((p) => p.a >= 20 && p.a < AL).length;
  if (n) L.push(`${n} academy player${n > 1 ? "s are" : " is"} 20 or older: they grow more slowly here than they would in the first team.`);
  loanRows().forEach(({ p, s }) => {
    const b = p.l0 || { mn: 0 };
    if (G.round >= 6 && (p.mn || 0) - b.mn < 90) L.push(`${p.n} has barely played on loan at ${s.name}. Consider recalling him.`);
  });
  return L;
}
