// Buying, selling, loaning and releasing players
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function offer(p) {
  let best = null;
  G.t.forEach((b) => {
    if (b.id == G.me || b.pl.length >= 26) return;
    const w0 = nd(b, p.pos);
    if (p.o < w0 + 1) return;
    const pr = +(val(p) * cl(0.95 + (p.o - w0) * 0.015, 0.9, 1.25)).toFixed(2);
    if (b.bud - RES(b) >= pr && (!best || pr > best.pr)) best = { b, pr };
  });
  return best;
}
function note(m) {
  G.msg = m;
  render();
}
function buyP(i, loan) {
  const x = MK[i], me = G.t[G.me];
  if (!x || busy || !winOpen()) return note("The transfer window is closed.");
  const p = x.p, s = x.s;
  if (me.pl.length >= 28) return note("Your squad is full (28). Release, sell or send a youngster to the academy first.");
  if (s && cnt(s, p.pos) <= MNH[p.pos]) return note(`${s.name} won't sell: they need cover in that position.`);
  if (loan && (!s || p.role == "key" || p.role == "starter")) return note("Loan refused: first-team players aren't available on loan.");
  if (s && s.rep > me.rep + 6 && (p.role == "key" || p.role == "starter")) return note(`${p.n} won't leave ${s.name} for a smaller club.`);
  const f = loan ? +(val(p) * 0.08).toFixed(2) : ask(p, s);
  if (f > me.bud) return note(`Not enough budget (${fm1(f)} needed).`);
  move(p, s, me, f, loan);
  news(`${me.name} ${loan ? "loan" : "sign"} ${p.n} (${p.pos}, ${p.o})${s ? " from " + s.name : " as a free agent"} for ${fm1(f)}.`);
  G.msg = `Done: ${p.n} ${loan ? "is on loan until the end of the season" : "signed"} for ${fm1(f)}.`;
  render();
}
function sellP(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p || busy || !winOpen()) return note("The transfer window is closed.");
  const o = offer(p);
  if (!o) return note("No club is interested right now.");
  if (me.pl.length <= 15 || cnt(me, p.pos) <= MNH[p.pos]) return note("You need squad cover in that position first.");
  move(p, me, o.b, o.pr, false);
  news(`${me.name} sell ${p.n} (${p.pos}, ${p.o}) to ${o.b.name} for ${fm1(o.pr)}.`);
  G.msg = `Sold ${p.n} to ${o.b.name} for ${fm1(o.pr)}.`;
  render();
}
function loanOut(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p || busy || !winOpen()) return note("The transfer window is closed.");
  if (me.pl.length <= 15 || cnt(me, p.pos) <= MNH[p.pos]) return note("You need squad cover in that position first.");
  const c = G.t.filter((b) => b.id != G.me && b.pl.length < 26 && nd(b, p.pos) <= p.o - 1).sort((x, y) => y.exp - x.exp)[0];
  if (!c) return note("No club wants him on loan.");
  move(p, me, c, 0, true);
  news(`${me.name} loan ${p.n} (${p.pos}, ${p.o}) to ${c.name}.`);
  G.msg = `${p.n} is on loan at ${c.name} until the end of the season.`;
  render();
}
function relP(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p || busy || !winOpen()) return note("The transfer window is closed.");
  if (me.pl.length <= 15 || cnt(me, p.pos) <= MNH[p.pos]) return note("You need squad cover in that position first.");
  move(p, me, null, 0, false);
  G.msg = `${p.n} released.`;
  render();
}
