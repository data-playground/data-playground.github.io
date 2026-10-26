// Inbox items
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function inboxItems(me) {
  const R = [];
  assist(me);
  const L = LASTL.slice();
  {
    const S = G.st;
    if (S) STR.forEach(([k, l]) => {
      const c = S.r[k];
      if (!c) R.push({ from: "Staff", t: `The ${l.toLowerCase()} position is vacant. Hire one in Staff & coaches.`, v: "staff", w: 1 });
      else if (c.y <= 1) R.push({ from: "Staff", t: `${c.n}'s contract (${l.toLowerCase()}) ends this season. Renew it in Staff & coaches.`, v: "staff", w: 0 });
    });
  }
  {
    const pc = G.pc;
    if (pc) pc.open.filter((o) => o.a == null).forEach((o) => {
      const p = me.pl.find((x) => x.id == o.pid);
      if (p) R.push({ from: "Players", t: `${p.n} wants a word about ${PCK[o.k]}.`, v: "talk", w: 1 });
    });
  }
  {
    const tq = G.tq;
    if (tq && !tq.done && G.nm && tq.md < 6 && G.round >= tqU(tq.md)) R.push({ from: "Federation", t: `${G.nm.n}: qualifier ${tq.md + 1} of 6 for the ${tq.y} ${tq.name} is available.`, v: "nat", w: 1 });
  }
  {
    const tp = G.tp;
    if (tp && G.nm) R.push({ from: "Federation", t: `${G.nm.n} are at the ${tp.y} ${tp.name}: ${tp.out ? "your team is out, the rest will be simulated" : "next is " + tpLab()}.`, v: "nat", w: tp.out ? 0 : 1 });
  }
  {
    const pp = G.pm && G.pm.pend;
    if (pp && !pp.done) R.push({ from: "Media", t: `Press conference: ${pp.qs.length} question${pp.qs.length > 1 ? "s" : ""} after ${pp.sc}.`, v: "press", w: 1 });
  }
  G.ob.forEach((o) => {
    const ps = fp(o.pid), b = G.t[o.from];
    if (!ps || ps.t !== me || !b) return;
    R.push({ from: "Transfers", t: `${b.name} ${o.type == "loan" ? "want to loan" : "offer " + fm1(o.fee) + " for"} ${ps.p.n} (${ps.p.pos}, ${ps.p.o}).`, v: "market", w: 1 });
  });
  L.forEach((x) => {
    const w = /injur|suspend|exhaust|unhappy|frustrat|run down|expire|losing patience|age limit|badly out/.test(x), v = /contract|run down/.test(x) ? "club" : /approached/.test(x) ? "career" : /academy/.test(x) ? "youth" : "squad";
    R.push({ from: /board/i.test(x) ? "Board" : "Assistant", t: x, v, w: w ? 1 : 0 });
  });
  G.news.slice(0, 8).forEach((x) => R.push({ from: "Transfer news", t: x, v: "market", w: 0 }));
  return R;
}
