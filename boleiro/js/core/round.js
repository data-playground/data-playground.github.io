// Playing a round (doRound) and what happens around it
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function doRound(live, wait) {
  if (busy || G.round >= G.nr || G.jl && !wait) return;
  if (G.tp) tpSimAll();
  tqCatch();
  iwTick(cupDue() ? nextCup() : dRd(G.round));
  if (cupDue()) return doCup(live, wait);
  const me = G.t[G.me];
  G.t.forEach((t) => t.id == G.me && !wait ? fixXI(t) : auto(t));
  if (live && G.round < HL().rounds) G.hold = { pos: table().indexOf(me) + 1, P: me.P, round: G.round };
  const out = [];
  let hp = null;
  G.lg.forEach((l) => {
    const rd = l.fix[G.round];
    if (!rd) return;
    rd.forEach(([h2, a2]) => {
      if (live && (h2 == G.me || a2 == G.me)) {
        hp = [h2, a2];
        return;
      }
      const r = play(G.t[h2], G.t[a2]);
      r.h = h2;
      r.a = a2;
      apply(h2, a2, r.g);
      out.push(r);
    });
  });
  if (!hp) {
    fin(out);
    autoSave();
    render();
    return;
  }
  const [h, a] = hp, hl = me.lg, shown = out.filter((y) => G.t[y.h].lg == hl), it = mgen(G.t[h], G.t[a], h == G.me ? 0 : 1);
  busy = true;
  PZ = false;
  LP = 0;
  PS = { k: null, b: null };
  ADS = {};
  ADN = {};
  ADV = [];
  view = "match";
  G.mt = null;
  G.live = { h, a, oth: shown };
  render();
  const sc = $("#mscore"), iv = setInterval(() => {
    if (PZ) return;
    const r = it.next();
    if (r.done) {
      clearInterval(iv);
      const x = r.value;
      x.h = h;
      x.a = a;
      apply(h, a, x.g);
      out.push(x);
      fin(out);
      busy = false;
      G.hold = null;
      G.mt = null;
      autoSave();
      render();
      return;
    }
    G.mt = r.value;
    const M = G.mt, mn = M.min - 1;
    flush();
    lform(M);
    advUp(M);
    if (M.req && !PZ) {
      PZ = true;
      showPz();
    }
    sc.textContent = `${G.t[h].name} ${M.g[0]} - ${M.g[1]} ${G.t[a].name} (${mn}')`;
    shown.forEach((y, k) => {
      const q = y.log.filter((e) => e.m <= mn).pop().s;
      $("#om" + k).textContent = q[0] + "-" + q[1];
    });
  }, SPD[G.speed || "n"]);
}
function roles(t) {
  const N = { GK: [1, 0], DF: [4, 2], MF: [4, 2], FW: [2, 1] }, st = [];
  for (const q in N) {
    t.pl.filter((p) => p.pos == q).sort((a, b) => b.o - a.o).forEach((p, i) => {
      p.role = i < N[q][0] ? "starter" : i < N[q][0] + N[q][1] ? "rotation" : "depth";
      if (p.role == "starter") st.push(p);
      if (p.a <= 21 && p.role != "starter") p.role = p.pot - p.o >= 8 ? "prospect" : "youth";
    });
  }
  st.sort((a, b) => b.o - a.o).slice(0, 4).forEach((p) => p.role = "key");
  t.pl.forEach((p) => {
    p.ms = ROLE[p.role].x;
    p.lm = 0;
    if (p.sn == null) p.sn = rn(-6, 6);
  });
}
function prep() {
  G.lg.forEach((l) => l.ids.map((i) => G.t[i]).sort((a, b) => str(b).all - str(a).all).forEach((t, i) => t.exp = i + 1));
  G.t.forEach(roles);
}
let LASTL = [];
function assist(me) {
  const pos = table().indexOf(me) + 1, L = ntNotes(me).concat(acNotes(me));
  me.pl.forEach((p, j) => {
    const r = ROLE[p.role], gap = p.ms - r.x;
    if (p.nd) {
    } else if (p.inj) L.push(`${p.n} is injured (${p.inj} match${p.inj > 1 ? "es" : ""}).`);
    else if (p.sus) L.push(`${p.n} is suspended.`);
    else {
      if (p.cd < 65 && me.xi.includes(j)) L.push(`${p.n} (${p.a}) looks exhausted, condition ${Math.round(p.cd)}%. Consider resting him.`);
      if (p.mo < 40) L.push(`${p.n} is ${p.mo < 30 ? "unhappy" : "frustrated"}: ${gap < -0.1 ? `he expected more games as a ${r.n}` : "the club is below expectations"}.`);
      if (p.ap >= 4 && p.fm >= 7) L.push(`${p.n} is in superb form (${p.fm.toFixed(1)}).`);
      else if (p.ap >= 4 && p.fm < 5.7) L.push(`${p.n} is badly out of form (${p.fm.toFixed(1)}).`);
    }
  });
  {
    const ex = me.pl.filter((p) => p.cy <= 1);
    if (ex.length) L.unshift(`${ex.length} contract(s) expire this season: ${ex.slice(0, 4).map((p) => p.n).join(", ")}${ex.length > 4 ? "..." : ""}. See Club & finances.`);
  }
  Object.keys(FAC).forEach((k) => {
    if (me.fc[k].cd < 50) L.unshift(`${FAC[k][0]} is run down (${Math.round(me.fc[k].cd)}% condition). Consider renovating.`);
  });
  {
    const cg = G.jl ? null : congest(me);
    if (cg) L.unshift(cg);
  }
  if (G.bc < 30) L.unshift(`The board is losing patience with results (${bcl(G.bc)}).`);
  if (G.of.length && !G.jl) L.unshift(`${G.of.length} club(s) have approached you. See Manager career.`);
  LASTL = L.slice();
  return `<div class="card"><b>Assistant manager</b><p class="mut" style="margin:4px 0">Expected finish: ${me.exp}º. Currently: ${pos}º.</p>${L.length ? `<ul style="margin:4px 0 0 18px;padding:0">${L.slice(0, 8).map((x) => `<li>${x}</li>`).join("")}</ul>` : '<span class="mut">No concerns right now.</span>'}</div>`;
}
function congest(me) {
  if (G.round >= G.nr) return null;
  const ds = [];
  for (let r = G.round; r < Math.min(G.nr, G.round + 4); r++) ds.push(dRd(r));
  Object.values(cups()).forEach((cp) => {
    if (!cp.done && cp.fx && cp.fx.some((t) => t.includes(G.me))) {
      const d = cp.slots[cp.k];
      if (d != null) ds.push(d);
    }
  });
  ds.sort((a, b) => a - b);
  const L = ds.filter((d, i) => i == 0 || d != ds[i - 1]).slice(0, 5);
  if (L.length < 3) return null;
  let best = null;
  for (let i = 0; i + 2 < L.length; i++) {
    const span = L[i + 2] - L[i];
    if (i == 0 && span <= 6) best = { span, d: L[i] };
  }
  if (!best && L.length >= 4 && L[3] - L[0] <= 10 && L[1] - L[0] <= 4) best = { span: L[3] - L[0], d: L[0] };
  if (!best) return null;
  const n = L.filter((d) => d >= best.d && d <= best.d + best.span + 1).length, xi = me.xi.map((i) => me.pl[i]).filter(Boolean).sort((a, b) => 100 - b.cd + (b.a - 26) * 2 - (100 - a.cd + (a.a - 26) * 2)).slice(0, 3);
  return `Busy spell: ${n}+ matches in ${best.span + 1} days from ${fd(best.d)}. Legs will get heavy, so plan some rotation. Most at risk: ${xi.map((p) => `${p.n} (${p.a}, ${Math.round(p.cd)}%)`).join(", ")}.`;
}
