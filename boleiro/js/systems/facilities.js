// Club infrastructure (levels, decay, upgrades)
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const FAC = { tr: ["Training facilities", "Better player development and faster recovery between matches."], yt: ["Youth academy", "Better prospects arrive in the yearly intake."], md: ["Medical centre", "Fewer injuries and shorter recoveries."], pt: ["Stadium and pitch quality", "A better matchday atmosphere: higher attendance demand."], sc: ["Scouting network", "More accurate potential estimates in the transfer market."] };
const facCap = (t) => cl(Math.round(3 + (t.rep - 50) * 0.4) + 1, 2, 19), fcost = (L) => +(0.15 * Math.pow(1.25, L)).toFixed(2), rcost = (L) => +(fcost(L) * 0.3).toFixed(2), ef = (t, k) => {
  const f = t.fc[k];
  return f.lv * (0.55 + 0.45 * f.cd / 100);
};
function mkFc(t) {
  const b = cl(Math.round(3 + (t.rep - 50) * 0.4 + rn(-1, 1)), 2, 16), o = {};
  Object.keys(FAC).forEach((k) => {
    const lv = cl(b + Math.round(rn(-1.5, 1.5)), 1, 18);
    o[k] = { lv, max: lv + 3, cd: Math.round(rn(70, 100)), up: 0, h: [] };
  });
  return o;
}
function ilog(x) {
  G.il.unshift(`Season ${G.season}: ${x}`);
  G.il.length = Math.min(G.il.length, 20);
}
function facUp(k) {
  const me = G.t[G.me], f = me.fc[k], c = fcost(f.lv);
  if (f.up) return note("An upgrade is already under way.");
  if (f.lv >= 20) return note("Already at the highest level.");
  if (me.bud < c) return note(`You need ${fm1(c)} in cash.`);
  me.bud -= c;
  me.fn.inf += c;
  f.up = 1;
  ilog(`${FAC[k][0]}: upgrade to level ${f.lv + 1} ordered for ${fm1(c)}.`);
  note(`${FAC[k][0]}: upgrade to level ${f.lv + 1} ordered (${fm1(c)}). It opens next season.`);
}
function facRen(k) {
  const me = G.t[G.me], f = me.fc[k], c = rcost(f.lv);
  if (f.cd >= 95) return note("Already in excellent condition.");
  if (me.bud < c) return note(`You need ${fm1(c)} in cash.`);
  me.bud -= c;
  me.fn.inf += c;
  ilog(`${FAC[k][0]} renovated for ${fm1(c)} (condition ${Math.round(f.cd)}% to 100%).`);
  f.cd = 100;
  note(`${FAC[k][0]} renovated for ${fm1(c)}.`);
}
