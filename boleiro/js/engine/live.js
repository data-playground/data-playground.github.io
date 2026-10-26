// Live match: pause, substitutions, assistant advice, team talk
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const ic = (e) => {
  const t = e.t, c = e.k == "g" ? ["eg", "GOAL"] : /Second yellow/.test(t) ? ["er", "2ND YEL"] : /^Yellow card/.test(t) ? ["ey", "YELLOW"] : /RED CARD/.test(t) ? ["er", "RED"] : /^Substitution|bring on goalkeeper|goes in goal/.test(t) ? ["", "SUB"] : /goes down injured/.test(t) ? ["ei", "INJURY"] : null;
  return c ? `<span class="ev ${c[0]}">${c[1]}</span>` : "";
};
function flush() {
  const el = $("#mlog");
  if (!el || !G.mt) return;
  while (LP < G.mt.log.length) {
    const e = G.mt.log[LP++];
    el.insertAdjacentHTML("beforeend", `<div class="${e.k || ""}"><span class="mut">${e.m}'</span> ${ic(e)}${e.t}</div>`);
  }
  el.scrollTop = 1e5;
}
const STN = { balanced: "Balanced", attack: "All-out attack", counter: "Counter-attack" };
let PS = { k: null, b: null }, PMSG = "", PK = null, PKB = "career", ADV = [], ADS = {}, ADN = {};
const clsPen = (pn) => pn <= 1 ? "fg" : pn <= 7 ? "fa" : "fr";
function shapeTxt(t, M) {
  let d = 0, m = 0, f = 0;
  slOf(t).forEach(([pos, x, y], k) => {
    if (k == 0 || M.off[t.name + t.xi[k]]) return;
    if (y >= 62) d++;
    else if (y > 30) m++;
    else f++;
  });
  const men = d + m + f + (M.off[t.name + t.xi[0]] ? 0 : 1);
  return `${d}-${m}-${f}${men < 11 ? " (" + men + " men)" : ""}`;
}
function advise(M) {
  const s = M.hs;
  if (s == null || s < 0 || M.gk != null || !M.tm) return [];
  const t = M.T[s], S = slOf(t), oT = M.T[1 - s], m = M.min, gd = M.g[s] - M.g[1 - s], ns = M.ns[s], bn = M.bn(s), L = [], sty = t.style, ea = sf(t, "asst");
  const subFor = (k) => {
    if (ns >= 5) return null;
    const p = t.pl[t.xi[k]], sp = S[k][0], c = bn.filter((j) => t.pl[j].pos == "GK" == (p.pos == "GK"));
    if (!c.length) return null;
    const sc = (j) => t.pl[j].o - pen(t.pl[j], sp) - Math.max(0, 70 - M.cnd(s, j)) * 0.12;
    c.sort((a, b) => sc(b) - sc(a));
    return ea < -0.3 && t.xi[k] % 2 && c[1] ? c[1] : c[0];
  };
  let best = null;
  t.xi.forEach((i, k) => {
    if (M.off[t.name + i]) return;
    const p = t.pl[i], q = M.tm[t.name + i];
    if (!q) return;
    const mm = m - q.a, cd = M.cnd(s, i), r = mm >= 25 ? M.rate(s, i) : null, rs = [];
    let u = 0;
    if (r != null && (!best || r > best.r)) best = { p, r, i };
    const cLim = Math.round(54 + ea * 8);
    if (cd < cLim) {
      rs.push(`condition down to ${cd}%`);
      u = cd < cLim - 10 ? 2 : 1;
    }
    if (r != null && r <= 5.4 + ea * 0.4) {
      rs.push(`poor game so far (rating ${r.toFixed(1)})`);
      u = Math.max(u, r <= 4.8 + ea * 0.3 ? 2 : 1);
    }
    if (M.yc[t.name + i] == 1 && (p.pos == "DF" || p.pos == "MF") && m >= 55 && (rs.length || m >= 65)) rs.push("already booked, a second yellow would leave you a man down");
    if (!rs.length) return;
    const j = subFor(k), n = j == null ? null : t.pl[j];
    L.push({ key: "p" + i, u, t: `<b>${p.n}</b> (${S[k][0]}): ${rs.join("; ")}. ${n ? `Best replacement on the bench: ${n.n} (${n.pos}, ${n.o}, condition ${M.cnd(s, j)}%).` : ns >= 5 ? "No substitutions left." : "Nobody suitable on the bench."}`, act: n ? { k: "sub", o: i, n: j, txt: `Bring on ${n.n.split(" ").pop()}` } : null });
  });
  if (m >= 60 && gd < 0 && sty != "attack") L.push({ key: "st:a", u: m >= 75 ? 2 : 1, t: `You are ${-gd} goal${gd < -1 ? "s" : ""} down with ${90 - m} minutes left. All-out attack gives you the best chance of a comeback but leaves you open at the back.`, act: { k: "sty", v: "attack", txt: "All-out attack" } });
  if (m >= 70 && gd > 0 && sty != "counter") L.push({ key: "st:c", u: 0, t: `You are ahead with ${90 - m} minutes left. A counter-attack style can help protect the lead.`, act: { k: "sty", v: "counter", txt: "Counter-attack" } });
  const mo = t.xi.filter((i) => M.off[t.name + i]).length, oo = oT.xi.filter((i) => M.off[oT.name + i]).length;
  if (oo > mo && gd <= 0 && sty != "attack" && m < 85) L.push({ key: "men:o", u: 1, t: `${oT.name} are down to ${11 - oo} men. This is the moment to push forward.`, act: { k: "sty", v: "attack", txt: "All-out attack" } });
  if (mo > oo && sty == "attack") L.push({ key: "men:m", u: 1, t: `You are down to ${11 - mo} men. All-out attack is risky now, a balanced shape keeps you safer.`, act: { k: "sty", v: "balanced", txt: "Balanced" } });
  if (ea >= 0.4 && m >= 60) {
    const lm_ = Math.round(54 + ea * 8), so = [];
    t.xi.forEach((i, k) => {
      if (M.off[t.name + i]) return;
      const cd = M.cnd(s, i);
      if (cd >= lm_ && cd < lm_ + 8) so.push({ i, k, cd });
    });
    so.sort((x, y) => x.cd - y.cd).slice(0, 2).forEach((x) => L.push({ key: "soon" + x.i, u: 0, t: `<b>${t.pl[x.i].n}</b> (${S[x.k][0]}) will start to tire soon (condition ${x.cd}%).`, act: null }));
  }
  if (best && best.r >= 7.8) L.push({ key: "best", u: -1, t: `<b>${best.p.n}</b> is having an excellent game (rating ${best.r.toFixed(1)}). Keep him on the pitch.`, act: null });
  return L.filter((x) => x.u > 0 || ea >= -0.3).sort((a, b) => b.u - a.u);
}
function advR(M) {
  const el = $("#adv");
  if (!el) return;
  const on = !!(G.cfg && G.cfg.ap), h = `<div class="ch"><b>Assistant</b><button class="sm" data-a="advap" title="Pause the match when the assistant has urgent advice">Auto-pause: ${on ? "on" : "off"}</button></div>` + (ADV.length ? ADV.map((x, i) => `<div class="adv"><span class="ev ${x.u == 2 ? "ey" : x.u < 0 ? "eg" : ""}">${x.u == 2 ? "URGENT" : x.u == 1 ? "ADVICE" : x.u < 0 ? "GOOD" : "NOTE"}</span><span class="at">${x.t}</span><span class="ab">${x.act ? `<button class="sm p" data-a="advact" data-i="${i}">${x.act.txt}</button>` : ""}<button class="sm" data-a="advx" data-i="${i}" title="Dismiss">✕</button></span></div>`).join("") : `<span class="mut">Nothing to report. Your assistant speaks up about tired or struggling players, cards and tactics.</span>`);
  if (el.dataset.h !== h) {
    el.innerHTML = h;
    el.dataset.h = h;
  }
}
function advUp(M) {
  if (!M || M.hs == null || M.hs < 0) return;
  ADV = advise(M).filter((x) => !ADS[x.key]).slice(0, 4);
  if (G.cfg && G.cfg.ap && !PZ && !M.req && M.min > 1) {
    const n = ADV.find((x) => x.u == 2 && !ADN[x.key]);
    if (n) {
      ADN[n.key] = 1;
      PZ = true;
      advR(M);
      showPz();
      return;
    }
  }
  advR(M);
}
function advAct(i) {
  const x = ADV[i], M = G.mt;
  if (!x || !x.act || !M || M.gk != null) return;
  const a = x.act, s = M.hs, t = M.T[s];
  if (a.k == "sub") {
    if (M.ns[s] >= 5 || !M.bn(s).includes(a.n) || t.xi.indexOf(a.o) < 0 || M.off[t.name + a.o]) {
      ADS[x.key] = 1;
      advUp(M);
      return;
    }
    M.sub(s, a.o, a.n, M.min, "");
    PS = { k: null, b: null };
  } else {
    t.style = a.v;
  }
  ADS[x.key] = 1;
  flush();
  lform(M);
  if (PZ) showPz();
  else advUp(M);
}
const TT = { enc: ["Encourage them", "You are better than they think.", "encourage them"], dem: ["Demand more", "I expect a lot more from you.", "demand more"], foc: ["Stay focused", "Respect them and stick to the plan.", "tell them to stay focused"], rel: ["Relax them", "Go out there and enjoy it.", "tell them to relax"], fir: ["Fire them up", "Do it for the fans!", "fire them up"] };
function ttCtx(M) {
  const s = M.hs, t = M.T[s], q = (x) => x.a + x.m + x.d, r = q(M.S[s]) / Math.max(1, q(M.S[1 - s])), xs = t.xi.filter((i) => !M.off[t.name + i]), mo = xs.reduce((a, i) => a + t.pl[i].mo, 0) / Math.max(1, xs.length);
  return { s, t, r, mo, gd: M.g[s] - M.g[1 - s], ht: M.req == "ht", fav: r > 1.06, dog: r < 0.94 };
}
function ttBase(c, k) {
  let b;
  if (!c.ht) {
    const T = { enc: [0.6, 0.3, 0.1], dem: [-0.3, 0.2, 0.5], foc: [0.1, 0.3, 0.5], rel: [0.4, 0.1, -0.4], fir: [0.4, 0.3, 0] }[k];
    b = c.dog ? T[0] : c.fav ? T[2] : T[1];
    if (c.mo < 45) b += { enc: 0.3, dem: -0.4, foc: 0, rel: 0.1, fir: 0.1 }[k];
    if (c.mo > 75) b += { enc: 0, dem: 0.1, foc: 0.2, rel: -0.3, fir: 0.2 }[k];
  } else {
    const T = { enc: [0.3, 0.3, 0.2], dem: [0.6, 0.2, -0.2], foc: [0.1, 0.3, 0.6], rel: [-0.5, -0.1, 0.2], fir: [0.5, 0.3, -0.3] }[k];
    b = c.gd < 0 ? T[0] : c.gd == 0 ? T[1] : T[2];
  }
  return b;
}
const ttReact = (e) => e >= 0.5 ? "The players respond brilliantly. They look fired up and ready." : e >= 0.2 ? "A good reaction. The players nod along." : e > -0.15 ? "The room goes quiet. It doesn't seem to change much." : e > -0.4 ? "A mixed reaction, a few players look unconvinced." : "That went down badly. Some of the players look annoyed.";
function ttDo(k) {
  const M = G.mt;
  if (!M || M.hs == null || M.hs < 0 || M.req != "tt" && M.req != "ht" || M.ttd[M.req] || !TT[k]) return;
  const c = ttCtx(M), e = cl(ttBase(c, k) + rn(-0.3, 0.3), -1, 1), rc = ttReact(e);
  M.tf[c.s] = 1 + e * 0.035;
  M.fm(c.s);
  c.t.xi.forEach((i) => {
    const p = c.t.pl[i];
    p.mo = cl(p.mo + Math.round(e * 5), 0, 100);
  });
  M.ttd[M.req] = { k, e, rc };
  M.log.push({ m: M.req == "ht" ? 45 : 0, t: `Team talk (${c.t.name}): "${TT[k][1]}" ${rc}`, k: "", s: M.g.slice() });
}
function showPz() {
  if (G && G.mt) {
    lform(G.mt);
    advUp(G.mt);
  }
  const b = $("#pb");
  if (b) b.textContent = PZ ? "Resume" : "Pause";
  const z = $("#pz");
  if (z) {
    z.innerHTML = PZ ? pzHTML() : "";
    bindPz();
  }
}
function bindPz() {
  const e = $("#pst");
  if (e) e.onchange = (ev) => {
    G.mt.T[G.mt.hs].style = ev.target.value;
  };
  const f = $("#pfm");
  if (f) f.onchange = (ev) => {
    const M = G.mt;
    M.reform(M.hs, ev.target.value);
    flush();
    showPz();
  };
}
function doSubPs(bi, k) {
  const M = G.mt, s = M.hs, t = M.T[s], o = t.xi[k];
  if (M.ns[s] >= 5) {
    PMSG = "No substitutions left.";
    return;
  }
  if (k == 0 && t.pl[o].pos == "GK" && t.pl[bi].pos != "GK" || k != 0 && t.pl[bi].pos == "GK") {
    PMSG = "A goalkeeper can only replace the goalkeeper.";
    return;
  }
  M.sub(s, o, bi, M.min, "");
  flush();
}
function doSwapPs(a, b) {
  const M = G.mt;
  if (a != b) M.swap(M.hs, a, b);
  flush();
}
function psClick(kind, id) {
  const M = G.mt;
  if (!M || M.gk != null) return;
  if (kind == "s") {
    if (PS.b != null) {
      doSubPs(PS.b, id);
      PS = { k: null, b: null };
    } else if (PS.k == null) PS.k = id;
    else if (PS.k == id) PS.k = null;
    else {
      doSwapPs(PS.k, id);
      PS.k = null;
    }
  } else {
    if (PS.k != null) {
      doSubPs(id, PS.k);
      PS = { k: null, b: null };
    } else PS.b = PS.b == id ? null : id;
  }
  showPz();
}
function placeAt(i, k) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p || busy) return;
  if (!av2(p)) return note(`${p.n} is ${p.nd ? "on international duty" : p.inj ? "injured" : "suspended"} and can't play.`);
  const cur = me.xi.indexOf(i), old = me.xi[k];
  if (cur >= 0 && cur != k) me.xi[cur] = old;
  me.xi[k] = i;
  SEL = -1;
  render();
}
function fin(out) {
  out.forEach((x) => {
    if (x.h != G.me && x.a != G.me) {
      delete x.log;
      delete x.st;
    }
  });
  G.res.push(out);
  G.round++;
  G.lc = null;
  if (out.some((x) => x.h == G.me || x.a == G.me)) G.ld = dRd(G.round - 1);
  {
    const mx = out.find((x) => x.h == G.me || x.a == G.me);
    if (mx) {
      rvGen(mx);
      pmGen(mx);
      pcRound();
    }
  }
  endRound();
}
