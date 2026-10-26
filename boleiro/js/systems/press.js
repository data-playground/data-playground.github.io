// Press and media
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const pmI = () => G.pm || (G.pm = { im: 50, pend: null, log: [], n: 0 });
const pmLab = (v) => v < 20 ? "Hostile" : v < 40 ? "Cold" : v < 60 ? "Neutral" : v < 80 ? "Warm" : "Friendly";
function pmGen(x) {
  if (!x || G.jl) return;
  const pm = pmI(), me = G.t[G.me], h = x.h == G.me, gf = h ? x.g[0] : x.g[1], ga = h ? x.g[1] : x.g[0], opp = CC(h ? x.a : x.h), res = x.w != null ? x.w == G.me ? "W" : "L" : gf > ga ? "W" : gf < ga ? "L" : "D", pos = table().indexOf(me) + 1;
  const sc = `${CC(x.h).name} ${x.g[0]}-${x.g[1]} ${CC(x.a).name}`, Q = [];
  const A = (l, say, hl, fx) => ({ l, say, hl, fx });
  if (res == "W") Q.push({ txt: pick(["A good win today. What was the key?", `${opp.rep > me.rep + 10 ? "A big result against a stronger side. " : ""}How do you explain the win?`]), as: [A("Praise the players", "The players were fantastic today.", "Manager praises his players", { sq: 2, im: 1 }), A("Take the credit", "The plan worked exactly as we prepared it.", "Manager says his plan worked", { sq: -0.5, bc: 0.8 }), A("Stay humble", "It is only three points. We still have a lot to improve.", "Manager keeps his feet on the ground", { sq: 0.5, bc: 0.3, im: 1 })] });
  else if (res == "L") Q.push({ txt: pick(["A disappointing result. What went wrong?", "You lost today. Whose fault is it?"]), as: [A("Take the blame", "That is on me. I got it wrong today.", "Manager takes the blame", { sq: 2, bc: -0.5, im: 1 }), A("Criticise the players", "The players did not show enough today.", "Manager hits out at his players", { sq: -3 }), A("Blame the referee", "We were unlucky and the decisions did not help.", "Manager blames the referee", { sq: 1, bc: -1, im: -2 })] });
  else Q.push({ txt: "A draw. A point gained or two points lost?", as: [A("A fair result", "A fair result. A point each is about right.", "Manager accepts a fair draw", { im: 0.5 }), A("We deserved more", "We deserved more than a point.", "Manager feels his side deserved more", { sq: 1, bc: -0.3 }), A("Two points dropped", "We should have won. Two points dropped.", "Manager: two points dropped", { sq: -1, bc: 0.5 })] });
  const pl = me.pl.filter((p) => p.lm >= 45 && p.lr != null).sort((a, b) => b.lr - a.lr), best = pl[0], worst = pl[pl.length - 1];
  let q2 = null;
  if (worst && worst.lr <= 5.2) q2 = { txt: `${worst.n} struggled today. Will he keep his place?`, as: [A("Back him", "He has my full backing.", `Manager backs ${worst.n}`, { p: 4, im: 0.5 }), A("Demand more", "He needs to do much better.", `Manager demands more of ${worst.n}`, { p: -2, sq: 0.5 }), A("Leave it open", "We will see. Nobody has a guaranteed place.", `${worst.n} warned about his place`, { p: -1.5, sq: -0.5, im: 1 })], pid: worst.id };
  else if (best && best.lr >= 7.8) q2 = { txt: `${best.n} was excellent today. How important is he to you?`, as: [A("A key man", "He is a key player for us.", `Manager hails ${best.n}`, { p: 4, sq: -0.5 }), A("Part of the group", "Every player contributed. He is part of a great group.", "Manager praises the whole group", { sq: 1, p: 1, im: 0.5 }), A("Keep him humble", "He did well, but he can do even better.", `Manager wants more from ${best.n}`, { p: -1.5, sq: 0.5 })], pid: best.id };
  else if (G.round >= 6 && pos > G.goal) q2 = { txt: `The board wants a top-${G.goal} finish and you are ${pos}º. Are you under pressure?`, as: [A("Confident", "I have the board's full trust.", "Manager insists he has the board's trust", { bc: G.bc < 40 ? -1 : 0.5, im: 0.5 }), A("Yes, we must deliver", "Yes, we have to deliver results. The players know it.", "Manager admits the pressure", { sq: -1, bc: 1, im: 1 }), A("Not my concern", "I only think about the next game.", "Manager: only the next game matters", { im: 1 })] };
  if (q2) Q.push(q2);
  pm.pend = { sc, res, qs: Q, a: [], rc: [], done: false, pl: [] };
}
function pmAns(qi, oi) {
  const pm = pmI(), p = pm.pend;
  if (!p || p.done || p.a[qi] != null) return;
  const q = p.qs[qi], a = q.as[oi];
  if (!a) return;
  const me = G.t[G.me], f = rn(0.75, 1.25), fx = {};
  for (const k in a.fx) fx[k] = Math.round(a.fx[k] * f * 10) / 10;
  if (fx.sq) me.pl.forEach((x) => {
    x.mo = cl(x.mo + fx.sq, 0, 100);
  });
  if (fx.bc) G.bc = cl(G.bc + fx.bc, 0, 100);
  if (fx.im) pm.im = cl(pm.im + fx.im, 0, 100);
  let pn = "";
  if (fx.p && q.pid) {
    const r = fp(q.pid);
    if (r) {
      r.p.mo = cl(r.p.mo + fx.p, 0, 100);
      pn = r.p.n;
    }
  }
  const t = [];
  if (fx.sq >= 1) t.push("squad morale up");
  else if (fx.sq <= -1) t.push("squad morale down");
  if (fx.bc >= 0.5) t.push("board pleased");
  else if (fx.bc <= -0.5) t.push("board uneasy");
  if (fx.im >= 0.5) t.push("press warm to you");
  else if (fx.im <= -0.5) t.push("press unimpressed");
  if (pn && fx.p >= 1.5) t.push(pn + " lifted");
  else if (pn && fx.p <= -1.5) t.push(pn + " unsettled");
  p.a[qi] = oi;
  p.rc[qi] = t.length ? t.join(", ") : "little reaction";
  pm.log.unshift({ s: `S${G.season}`, sc: p.sc, h: a.hl });
  pm.log.length = Math.min(pm.log.length, 12);
  if (p.a.filter((x) => x != null).length >= p.qs.length) {
    p.done = true;
    pm.n++;
  }
}
function pmSkip() {
  const pm = pmI(), p = pm.pend;
  if (!p || p.done) return;
  p.done = true;
  p.skip = true;
  pm.im = cl(pm.im - 1.5, 0, 100);
  pm.log.unshift({ s: `S${G.season}`, sc: p.sc, h: "Manager skips the press conference" });
  pm.log.length = Math.min(pm.log.length, 12);
}
