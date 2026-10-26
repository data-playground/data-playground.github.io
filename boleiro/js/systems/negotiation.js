// Transfer, renewal and sponsor negotiations; AI offers
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function reply(N, o) {
  N.n++;
  if (N.d > 0) {
    if (o >= N.ask) return { r: "ok", v: N.ask };
    if (o >= N.res) return { r: "ok", v: +o.toFixed(3) };
    if (o >= N.res * 0.85 && N.n < 3) {
      N.ask = Math.max(N.res, +((N.ask + o) / 2).toFixed(3));
      return { r: "counter", v: N.ask };
    }
    return { r: "no" };
  }
  if (o <= N.ask) return { r: "ok", v: N.ask };
  if (o <= N.res) return { r: "ok", v: +o.toFixed(3) };
  if (o <= N.res * 1.2 && N.n < 3) {
    N.ask = Math.min(N.res, +((N.ask + o) / 2).toFixed(3));
    return { r: "counter", v: N.ask };
  }
  return { r: "no" };
}
function nLog(x) {
  G.neg.log.push(x);
  G.neg.log = G.neg.log.slice(-5);
  G.msg = "";
  render();
}
function nWalk(why, cool) {
  const N = G.neg;
  if (N && cool && N.pid != null) G.cool[N.pid] = G.round + 3;
  G.neg = null;
  note(why);
}
function wDemand(p, renew2) {
  const b = renew2 ? renewWage(p) : wageFor(p);
  return { ask: +(b * 1.2).toFixed(3), res: +(b * rn(0.95, 1.03) * (renew2 && p.mo < 45 ? 1.1 : 1)).toFixed(3) };
}
function startBuy(i, loan) {
  const x = MK[i], me = G.t[G.me];
  if (!x || busy || !winOpen()) return note("The transfer window is closed.");
  const p = x.p, s = x.s;
  if (G.cool[p.id] > G.round) return note(`${p.n}'s side won't talk again until round ${G.cool[p.id] + 1}.`);
  if (me.pl.length >= 28) return note("Your squad is full (28). Release, sell or send a youngster to the academy first.");
  if (s && cnt(s, p.pos) <= MNH[p.pos]) return note(`${s.name} won't sell: they need cover in that position.`);
  if (loan && (!s || (p.role == "key" || p.role == "starter") && p.ls != "L")) return note("Loan refused: first-team players aren't available on loan.");
  if (s && s.rep > me.rep + 6 && (p.role == "key" || p.role == "starter")) return note(`${p.n} won't leave ${s.name} for a smaller club.`);
  if (!s) {
    const f = ask(p, null);
    if (f > me.bud) return note(`Not enough budget (${fm1(f)} signing fee).`);
    G.neg = { k: "terms", pid: p.id, tid: null, fee: f, ...wDemand(p, false), yrs: 3, n: 0, log: ["Free agent: agree personal terms."] };
    G.msg = "";
    return render();
  }
  const a = loan ? +(val(p) * 0.08 * (p.ls == "L" ? 0.8 : 1)).toFixed(2) : ask(p, s);
  G.neg = { k: loan ? "loan" : "fee", pid: p.id, tid: s.id, d: 1, ask: a, res: +(a * (loan ? rn(0.75, 0.92) : rn(0.84, 0.96))).toFixed(2), n: 0, log: [] };
  G.msg = "";
  render();
}
function startRenew(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p) return;
  if (G.cool[p.id] > G.round) return note(`${p.n}'s agent won't talk again until round ${G.cool[p.id] + 1}.`);
  if (p.mo < 30) return note(`${p.n} is unhappy and refuses to discuss a new contract.`);
  G.neg = { k: "wage", pid: p.id, tid: me.id, ...wDemand(p, true), yrs: 3, n: 0, log: [] };
  G.msg = "";
  render();
}
function renew(i) {
  startRenew(i);
}
function startSpon(k, i) {
  const o = (G.off[k] || [])[i];
  if (!o) return;
  G.neg = { k: "spon", slot: k, oi: i, co: o.co, ask: o.amt, res: +(o.amt * rn(1.1, 1.3)).toFixed(3), bonus: o.bonus, yrs: o.yrs, tgt: o.tgt, n: 0, log: [] };
  G.msg = "";
  render();
}
function seekAll() {
  const me = G.t[G.me];
  if (G.sk.all) return note("Your agents have already canvassed the market this season.");
  slotKeys(me).forEach((k) => {
    if (!me.sp.some((d) => d.slot == k)) G.off[k] = mkOff(me, k);
  });
  G.sk.all = 1;
  note("Your agents came back with fresh offers for the open slots.");
}
function nOffer(acc) {
  const N = G.neg;
  if (!N) return;
  const me = G.t[G.me], iv = $("#nv"), yv = $("#ny");
  let o = acc ? null : +(iv && iv.value);
  const y = +(yv && yv.value) || N.yrs || 3;
  if (N.k == "spon") {
    if (acc) o = N.ask;
    if (!(o > 0)) return note("Enter an amount.");
    const M = { ask: N.ask, res: N.res, n: N.n, d: -1 }, r = reply(M, o);
    N.n = M.n;
    if (r.r == "ok") {
      me.sp.push({ co: N.co, yrs: N.yrs, amt: r.v, bonus: N.bonus, tgt: N.tgt, slot: N.slot });
      delete G.off[N.slot];
      G.neg = null;
      return note(`Signed ${N.co} for ${slotName(N.slot).toLowerCase()}: ${fm1(r.v)} a year for ${N.yrs} season${N.yrs > 1 ? "s" : ""}.`);
    }
    if (r.r == "counter") {
      N.ask = M.ask;
      N.lo = o;
      return nLog(`${N.co} come back with ${fm1(M.ask)} a year.`);
    }
    (G.off[N.slot] || []).splice(N.oi, 1);
    G.neg = null;
    return note(`${N.co} withdraw their offer.`);
  }
  const ps = fp(N.pid);
  if (!ps) return nWalk("He is no longer available.");
  const p = ps.p, s = ps.t;
  if (N.k == "fee" || N.k == "loan") {
    if (!winOpen()) return nWalk("The transfer window has closed.");
    const px = N.k == "fee" ? xList() : [], cr = px.reduce((a, q) => a + xC(q, N, s), 0);
    if (acc) o = Math.max(0, +(N.ask - cr).toFixed(2));
    if (!(o > 0) && !(o == 0 && cr > 0)) return note("Enter an amount.");
    if (px.length) {
      if (s.pl.length - 1 + px.length > 26) return note(`${s.name} have no room for that many players.`);
      if (me.pl.length - px.length + 1 < 15 || ["GK", "DF", "MF", "FW"].some((q) => cnt(me, q) - px.filter((x) => x.pos == q).length + (p.pos == q ? 1 : 0) < MNH[q])) return note("You need squad cover in that position first.");
    }
    const r = reply(N, o + cr);
    if (r.r == "ok") {
      const cash = Math.max(0, +(r.v - cr).toFixed(2));
      if (N.k == "loan" ? r.v > me.bud : cash > me.bud) {
        N.n--;
        return note(`You can't afford ${fm1(cash)}.`);
      }
      if (N.k == "loan") {
        move(p, s, me, r.v, true);
        news(`${me.name} loan ${p.n} (${p.pos}, ${p.o}) from ${s.name} for ${fm1(r.v)}.`);
        G.neg = null;
        return note(`${p.n} joins on loan until the end of the season (fee ${fm1(r.v)}). You pay his wages.`);
      }
      G.neg = { k: "terms", pid: p.id, tid: N.tid, fee: r.v, ex: px.map((q) => ({ id: q.id, ln: !!(N.pm && N.pm[q.id]), f: +(xC(q, N, s) * Math.min(1, r.v / Math.max(cr, 1e-3))).toFixed(2) })), ...wDemand(p, false), yrs: 3, n: 0, log: [`${s.name} accept ${fm1(r.v)}${px.length ? ` (${fm1(cash)} cash plus ${px.map((q) => q.n).join(", ")})` : ""}. Now agree personal terms.`] };
      G.msg = "";
      return render();
    }
    if (r.r == "counter") {
      N.lo = o;
      return nLog(`${s.name} reply: they want ${fm1(N.ask)}${cr ? `, your players count for ${fm1(cr)}` : ""}.`);
    }
    return nWalk(`${s.name} end the talks and won't discuss ${p.n} again for a few rounds.`, true);
  }
  if (N.k == "terms" || N.k == "wage") {
    const ym = YM[y] || 1;
    if (acc) o = +(N.ask * ym).toFixed(3);
    if (!(o > 0)) return note("Enter an amount.");
    const M = { ask: N.ask * ym, res: N.res * ym, n: N.n, d: 1 }, r = reply(M, o);
    N.n = M.n;
    N.ask = M.ask / ym;
    N.yrs = y;
    if (r.r == "ok") {
      if (N.k == "wage") {
        p.w = r.v;
        p.cy = y;
        G.neg = null;
        return note(`${p.n} signs a ${y}-year contract on ${fm1(r.v)} a year.`);
      }
      if (!winOpen()) return nWalk("The transfer window has closed.");
      const ex = (N.ex || []).map((e) => ({ q: me.pl.find((q) => q.id == e.id), f: e.f, ln: e.ln })).filter((e) => e.q && e.q.ln == null), exf = ex.reduce((a, e) => a + e.f, 0), cash = Math.max(0, +(N.fee - exf).toFixed(2)), xt = ex.length ? ` plus ${ex.map((e) => e.q.n + (e.ln ? " (on loan)" : "")).join(", ")}` : "";
      if (me.bud < cash) return nWalk("You can no longer afford the fee.");
      ex.forEach((e) => move(e.q, me, s, e.f, !!e.ln));
      move(p, s, me, N.fee, false);
      p.w = r.v;
      p.cy = y;
      news(`${me.name} sign ${p.n} (${p.pos}, ${p.o})${s ? " from " + s.name : " as a free agent"} for ${fm1(cash)}${xt}.`);
      G.neg = null;
      return note(`${p.n} joins on ${fm1(r.v)} a year for ${y} season${y > 1 ? "s" : ""} (fee ${fm1(cash)}${xt}).`);
    }
    if (r.r == "counter") {
      N.lo = o;
      return nLog(`His agent: "${fm1(M.ask)} a year over ${y} season${y > 1 ? "s" : ""}."`);
    }
    return nWalk(`${p.n}'s agent ends the talks.`, true);
  }
}
function aiEx(b, fee) {
  const c = b.pl.filter((q) => q.ln == null && q.role != "key" && q.role != "starter" && val(q) * 0.9 >= fee * 0.15 && val(q) * 0.9 <= fee * 0.7 && cnt(b, q.pos) > MNH[q.pos] && !G.ob.some((x) => x.xp == q.id));
  return c.length ? pick(c) : null;
}
function ofTxt(o) {
  const x = o.xp ? fp(o.xp) : null;
  return x && x.t === G.t[o.from] && x.p.ln == null ? `${fm1(Math.max(0, o.fee - o.xv))}<div class="sub">+ ${x.p.n.split(" ").slice(-1)[0]} (${x.p.pos} ${x.p.o})</div>` : fm1(o.fee);
}
function genOffers() {
  if (!G) return;
  if (!winOpen()) {
    G.ob = [];
    return;
  }
  const me = G.t[G.me];
  G.ob = G.ob.filter((o) => o.exp >= G.round && (fp(o.pid) || {}).t === me);
  me.pl.concat(me.ac || []).forEach((p) => {
    if (p.ln != null) return;
    let n = G.ob.filter((o) => o.pid == p.id).length;
    const pr = p.ls ? 0.4 : p.role == "key" || p.role == "starter" ? 0.06 : 0.03;
    G.t.forEach((b) => {
      if (n >= 3 || b.id == G.me || !inSc(b, me) || b.pl.length >= 26 || Math.random() > pr || p.o < nd(b, p.pos) + 1) return;
      const ls = p.ls;
      if (ls == "L" || !ls && Math.random() < 0.12) {
        const fee = +(val(p) * 0.06 * rn(0.8, 1.2)).toFixed(2);
        if (b.bud - RES(b) >= fee) {
          G.ob.push({ id: uid(), pid: p.id, from: b.id, type: "loan", fee, max: +(fee * rn(1.3, 1.6)).toFixed(2), exp: G.round + 2, n: 0 });
          n++;
        }
      } else {
        const fee = +(val(p) * (ls == "S" ? rn(0.8, 1.02) : rn(1.1, 1.4))).toFixed(2), xp = me.pl.includes(p) && Math.random() < 0.3 ? aiEx(b, fee) : null, xv = xp ? +(val(xp) * 0.9).toFixed(2) : 0;
        if (b.bud - RES(b) >= fee - xv && wbill(b) + wageFor(p) - (xp ? wageFor(xp) : 0) <= 0.65 * b.ann) {
          G.ob.push({ id: uid(), pid: p.id, from: b.id, type: "buy", fee, max: +Math.min(b.bud + xv, fee * rn(1.12, 1.35)).toFixed(2), exp: G.round + 2, n: 0, xp: xp ? xp.id : null, xv });
          n++;
        }
      }
    });
  });
}
function ofAccept(id) {
  const o = G.ob.find((x) => x.id == id), me = G.t[G.me];
  if (!o) return;
  if (!winOpen()) return note("The transfer window is closed.");
  const ps = fp(o.pid), b = G.t[o.from];
  if (!ps || ps.t !== me) {
    G.ob = G.ob.filter((x) => x !== o);
    return note("He is no longer at your club.");
  }
  const p = ps.p;
  const xpl = o.xp ? fp(o.xp) : null, xo = xpl && xpl.t === b && xpl.p.ln == null && !ps.y ? xpl.p : null, xv = xo ? o.xv : 0;
  if (!ps.y && (me.pl.length <= 15 || cnt(me, p.pos) <= MNH[p.pos] && !(xo && xo.pos == p.pos))) return note("You need squad cover in that position first.");
  if (b.bud < o.fee - xv || b.pl.length >= 26 && !xo) {
    G.ob = G.ob.filter((x) => x !== o);
    return note(`${b.name} can no longer complete the deal.`);
  }
  const loan = o.type == "loan";
  if (ps.y) ySend(p, me, b, o.fee, loan);
  else move(p, me, b, o.fee, loan);
  if (xo) move(xo, b, me, xv, false);
  const cash = +(o.fee - xv).toFixed(2), xt = xo ? ` plus ${xo.n} (${xo.pos}, ${xo.o})` : "";
  news(`${me.name} ${loan ? "loan" : "sell"} ${p.n} (${p.pos}, ${p.o}) to ${b.name} for ${fm1(cash)}${xt}.`);
  G.ob = G.ob.filter((x) => x.pid != o.pid && !(xo && x.xp == xo.id));
  note(`${loan ? "Loaned" : "Sold"} ${p.n} to ${b.name} for ${fm1(cash)}${xt}.`);
}
function ofCounter(id) {
  const o = G.ob.find((x) => x.id == id);
  if (!o) return;
  const v = +($("#oc" + id) || {}).value;
  if (!(v > 0)) return note("Enter an amount.");
  const b = G.t[o.from], M = { ask: o.fee, res: o.max, n: o.n, d: -1 }, r = reply(M, v);
  o.n = M.n;
  if (r.r == "ok") {
    o.fee = r.v;
    return ofAccept(id);
  }
  if (r.r == "counter") {
    o.fee = M.ask;
    return note(`${b.name} improve their offer to ${fm1(M.ask)}.`);
  }
  G.ob = G.ob.filter((x) => x !== o);
  note(`${b.name} withdraw their offer.`);
}
function ofReject(id) {
  G.ob = G.ob.filter((x) => x.id != id);
  note("Offer rejected.");
}
function listP(i, t) {
  const p = G.t[G.me].pl[i];
  if (!p) return;
  p.ls = p.ls == t ? null : t;
  genOffers();
  note(p.ls ? `${p.n} is now listed for ${p.ls == "S" ? "sale" : "loan"}. Clubs may make offers while the window is open.` : `${p.n} is no longer listed.`);
}
