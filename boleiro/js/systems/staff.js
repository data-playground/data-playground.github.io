// Staff and coaches
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

let STS = null, STMSG = "";
const STR = [["asst", "Assistant manager", "Better advice, reviews and team-talk hints"], ["fit", "Fitness coach", "Less fatigue in matches, faster recovery"], ["phy", "Physio", "Shorter injuries"], ["gk", "Goalkeeping coach", "Develops goalkeepers"], ["def", "Defensive coach", "Develops defenders"], ["mid", "Midfield coach", "Develops midfielders"], ["att", "Attacking coach", "Develops forwards"], ["yth", "Youth coach", "Extra growth for players 21 and under"]];
const sf = (t, k) => {
  if (!G || !G.st || !t || t.id != G.me) return 0;
  const c = G.st.r[k];
  return ((c ? c.q : 0) - 50) / 50;
};
const stWage = (q, t) => {
  const a = (t || G.t[G.me]).ann || 40;
  return Math.round(a * 35e-4 * (0.4 + 1.6 * Math.pow(q / 100, 2)) * 1e4) / 1e4;
};
function stMk(k, q, y) {
  const S = G.st;
  return { id: ++S.id, n: pick(FN) + " " + pick(LN), a: 38 + (Math.random() * 26 | 0), q, sp: k, y };
}
function stPool() {
  const S = G.st;
  STR.forEach(([k]) => {
    while (S.pool.filter((c) => c.sp == k).length < 3) S.pool.push(stMk(k, cl(Math.round(rn(30, 78)), 20, 95), 2));
  });
}
function stI() {
  if (G.st) return G.st;
  const S = G.st = { r: {}, id: 0, log: [], pool: [] }, me = G.t[G.me];
  STR.forEach(([k]) => {
    const c = stMk(k, cl(Math.round(rn(42, 58)), 20, 90), 1 + (Math.random() * 3 | 0));
    c.w = stWage(c.q, me);
    S.r[k] = c;
  });
  stPool();
  return S;
}
const stCost = () => Object.values(stI().r).reduce((a, c) => a + (c ? c.w : 0), 0), stBase = () => 8 * stWage(50);
function stYear() {
  if (!G.st) return;
  const S = G.st;
  STR.forEach(([k, l]) => {
    const c = S.r[k];
    if (!c) return;
    c.y--;
    if (c.y <= 0) {
      S.log.unshift(`${c.n} (${l.toLowerCase()}) left when his contract ended.`);
      S.r[k] = null;
    }
  });
  S.pool = S.pool.filter(() => Math.random() > 0.4);
  stPool();
  S.log.length = Math.min(S.log.length, 8);
}
const stRole = (k) => STR.find((x) => x[0] == k);
function stHire(id) {
  const S = stI(), me = G.t[G.me], c = S.pool.find((x) => x.id == id);
  if (!c) return;
  const k = c.sp, old = S.r[k];
  if (c.q > me.rep + 25) {
    STMSG = `${c.n} will not join a club of this size.`;
    return;
  }
  const sev = old ? Math.round(old.w * 0.5 * 1e4) / 1e4 : 0;
  if (me.bud < sev) {
    STMSG = "You cannot afford the severance pay.";
    return;
  }
  me.bud -= sev;
  me.fn.sw = (me.fn.sw || 0) + sev;
  S.pool = S.pool.filter((x) => x.id != id);
  if (old) S.pool.push({ id: old.id, n: old.n, a: old.a, q: old.q, sp: k, y: 2 });
  S.r[k] = { ...c, w: stWage(c.q, me), y: c.y || 2 };
  STS = null;
  STMSG = `${c.n} is your new ${stRole(k)[1].toLowerCase()}.${sev ? " Severance paid: " + fm1(sev) + "." : ""}`;
}
function stFire(k) {
  const S = stI(), me = G.t[G.me], c = S.r[k];
  if (!c) return;
  const sev = Math.round(c.w * 0.5 * 1e4) / 1e4;
  if (me.bud < sev) {
    STMSG = "You cannot afford the severance pay.";
    return;
  }
  me.bud -= sev;
  me.fn.sw = (me.fn.sw || 0) + sev;
  S.pool.push({ id: c.id, n: c.n, a: c.a, q: c.q, sp: k, y: 2 });
  S.r[k] = null;
  STS = null;
  STMSG = `${c.n} has been dismissed. Severance paid: ${fm1(sev)}. The role is vacant, and a vacant role counts as the worst possible coach.`;
}
function stRenew(k) {
  const S = stI(), c = S.r[k];
  if (!c || c.y > 2) return;
  c.y = Math.min(3, c.y + 2);
  c.w = stWage(c.q);
  STMSG = `${c.n} signed a new contract (${c.y} seasons, ${fm1(c.w)} a year).`;
}
const stPct = (x) => {
  const r = Math.round(x);
  return (r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r) + "%";
};
function stEff(k, e) {
  if (k == "asst") return e >= 0.4 ? "Sharp: spots problems early" : e >= -0.3 ? "Average advice" : "Slow: misses some things";
  if (k == "fit") return `${stPct(-10 * e)} fatigue, ${e >= 0 ? "faster" : "slower"} recovery`;
  if (k == "phy") return `${stPct(-15 * e)} injury time`;
  if (k == "yth") return `${stPct(10 * e)} growth up to age 21`;
  return `${stPct(15 * e)} growth, ${stPct(-10 * e)} decline`;
}
