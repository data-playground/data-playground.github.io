// Stadium, tickets, sponsors, wages, season finance
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const WK = 0.07, wbill = (t) => t.pl.reduce((a, p) => a + p.w, 0), nf = () => ({ tk: 0, sp: 0, tv: 0, bn: 0, wg: 0, mt: 0, ot: 0, tr: 0, cs: 0, inf: 0 });
const inf = () => Math.pow(1.035, (G ? G.season : 1) - 1), pop = (t) => Math.pow(1.11, t.rp - 50), SV = (t) => 0.9 * pop(t) * inf(), refP = (t) => 6 * Math.pow(pop(t), 0.4) * inf();
const slotsAd = (t) => 1 + Math.floor(t.st.cap / 12e3), spn = (t) => SV(t) * (0.7 + 0.05 * slotsAd(t)), wageFor = (p) => +Math.max(0.02, WK * Math.pow(1.12, p.o - 50)).toFixed(3), renewWage = (p) => +(wageFor(p) * (p.mo < 45 ? 1.25 : 1)).toFixed(3);
const COS = [["SkyGulf Airways", "air", 3], ["Nordika Sport", "sport", 3], ["Banco Meridian", "bank", 3], ["TeleNova Mobile", "tel", 2], ["Coralix Cola", "drink", 3], ["Kaiser Brau", "drink", 2], ["Veloce Motors", "auto", 3], ["Pacifica Energy", "energy", 2], ["Hexa Bet", "bet", 2], ["Orbis Tech", "tech", 3], ["Mercato Supermarkets", "retail", 1], ["Aurora Insurance", "bank", 2], ["Dynamo Fitness", "sport", 1], ["Lumen Telecom", "tel", 1], ["Terra Foods", "retail", 1], ["Vento Airlines", "air", 2]];
const d0f = (t) => {
  const p = pop(t), q = p <= 23 ? p : 23 * Math.pow(p / 23, 0.45);
  return 6e3 + 2800 * Math.pow(q, 0.9);
};
function stad(t) {
  const d0 = d0f(t);
  return { cap: Math.ceil(d0 / 500) * 500, pr: [1, 2.5, 6].map((m) => +(refP(t) * m).toFixed(1)), pend: null };
}
function gate(t, pos) {
  const d0 = d0f(t), hy = cl(0.82 + (t.exp - pos) * 0.012 + (t.rp - t.rep) * 0.01 + (ef(t, "pt") - 8) * 8e-3, 0.55, 1.1), sh = [0.7, 0.25, 0.05], el = [1.3, 1.15, 1.05], mx = [1, 2.5, 6];
  let rev = 0, att = 0;
  for (let i = 0; i < 3; i++) {
    const a = Math.min(t.st.cap * sh[i], d0 * sh[i] * hy * Math.pow(refP(t) * mx[i] / t.st.pr[i], el[i]));
    att += a;
    rev += a * t.st.pr[i] / 1e6;
  }
  return { att, rev, full: att / t.st.cap };
}
const estAnn = (t) => gate(t, t.exp).rev * G.lg[t.lg].rounds / 2 + spn(t) + G.lg[t.lg].tv / G.lg[t.lg].n, slotKeys = (t) => ["shirt", "kit", "name", ...Array.from({ length: slotsAd(t) }, (_, i) => "ad" + i)], slotName = (k) => k == "shirt" ? "Shirt" : k == "kit" ? "Kit manufacturer" : k == "name" ? "Stadium naming rights" : "Stadium advertising " + (+k.slice(2) + 1);
const stName = (t) => {
  const d = t.sp.find((d2) => d2.slot == "name");
  return d ? d.co + " Arena" : t.name + " Stadium";
};
function mkOff(t, k) {
  const w = k == "shirt" ? 0.38 : k == "kit" ? 0.18 : k == "name" ? 0.14 : 0.05, out = [];
  COS.filter((c) => k != "kit" || c[1] == "sport").sort(() => Math.random() - 0.5).slice(0, 3).forEach((c) => {
    const base = SV(t) * w * [0.8, 1, 1.2][c[2] - 1] * rn(0.9, 1.12), perf = Math.random() < 0.5;
    out.push({ co: c[0], yrs: 1 + (Math.random() * 5 | 0), amt: +(perf ? base * 0.85 : base).toFixed(3), bonus: perf ? +(base * 0.5).toFixed(3) : 0, tgt: Math.max(1, t.exp - 1) });
  });
  return out;
}
function initSp(t) {
  t.sp = slotKeys(t).map((k) => ({ ...mkOff(t, k)[0], slot: k, yrs: 1 + (Math.random() * 3 | 0), bonus: 0 }));
}
function finRound() {
  G.lg.forEach((l) => {
    if (G.round > l.rounds) return;
    l.ids.forEach((id) => {
      const t = G.t[id], w = t.pl.reduce((a, p) => a + p.w, 0) / l.rounds, mt = t.st.cap * 4e-5 * inf() / l.rounds, ot = (0.35 * Math.pow(pop(t), 0.9) + Object.values(t.fc).reduce((a, f) => a + f.lv, 0) * 8e-3) * inf() / l.rounds, sp = (t.id == G.me ? t.sp.reduce((a, d) => a + d.amt, 0) : spn(t)) / l.rounds, tv = l.tv * inf() * 0.5 / l.n / l.rounds, sw = t.id == G.me ? (stCost() - stBase()) / l.rounds : 0;
      t.fn.wg += w;
      t.fn.mt += mt;
      t.fn.ot += ot;
      t.fn.sp += sp;
      t.fn.tv += tv;
      t.fn.sw = (t.fn.sw || 0) + sw;
      t.bud += sp + tv - w - mt - ot - sw;
    });
    table(l.id).forEach((t, i) => t.pos = i + 1);
  });
}
const RES = (b) => Math.max(0.3, 0.05 * (b.ann || 0));
function austerity(t) {
  if (t.bud < 0) {
    t.bud = +(t.bud * 0.25).toFixed(2);
  }
  for (let k = 0; k < 4 && t.pl.length > 17 && wbill(t) > 0.72 * t.ann; k++) {
    const c = t.pl.filter((p) => p.ln == null && ["rotation", "depth", "prospect"].includes(p.role) && cnt(t, p.pos) > MNH[p.pos]).sort((x, y) => y.w - x.w)[0];
    if (!c) break;
    move(c, t, null, 0, false);
  }
}
function finSeason() {
  G.lg.forEach((l) => table(l.id).forEach((t, i) => {
    const pos = i + 1, tv = l.tv * inf() * 0.5 * (l.n + 1 - pos) / (l.n * (l.n + 1) / 2);
    t.fp = pos;
    t.fn.tv += tv;
    t.bud += tv;
    if (t.id == G.me) t.sp.forEach((d) => {
      if (d.bonus && pos <= d.tgt) {
        t.fn.bn += d.bonus;
        t.bud += d.bonus;
      }
    });
    const fl = t.nh ? t.fs / t.nh : 0.8;
    if (t.st.pend && --t.st.pend.yrs <= 0) {
      t.st.cap = t.st.pend.cap;
      t.st.pend = null;
    }
    if (t.id != G.me) {
      const k = fl > 0.96 ? 1.05 : fl < 0.8 ? 0.95 : 1;
      t.st.pr = t.st.pr.map((x) => +Math.max(2, x * k).toFixed(1));
      if (!t.st.pend && fl > 0.96 && t.bud > 12) {
        t.bud -= 6;
        t.st.pend = { cap: t.st.cap + 5e3, yrs: 1 };
      }
    }
    {
      const hu = t.id == G.me;
      Object.entries(t.fc).forEach(([k, f]) => {
        if (f.up) {
          f.lv++;
          f.cd = 100;
          f.up = 0;
          if (hu) ilog(`${FAC[k][0]} upgraded to level ${f.lv}.`);
        } else {
          f.cd = Math.max(0, f.cd - (8 + f.lv * 0.4));
          if (f.cd < 35) {
            f.lv = Math.max(1, f.lv - 1);
            f.cd = 78;
            if (hu) ilog(`${FAC[k][0]} fell to level ${f.lv} through neglect.`);
          }
        }
        if (!hu) {
          const c = fcost(f.lv), r = rcost(f.lv);
          if (f.cd < 60 && t.bud > r * 3) {
            t.bud -= r;
            f.cd = 100;
          } else if (!f.up && f.lv < (f.max = Math.max(f.lv, facCap(t))) && t.bud > c * 6) {
            t.bud -= c;
            f.up = 1;
          }
        } else f.h.push({ s: G.season, lv: f.lv, cd: Math.round(f.cd) });
      });
    }
    t.rp = cl(t.rp + (t.exp - pos) * 0.1, t.rep - 8, t.rep + 8);
    t.ann = t.fn.tk + t.fn.sp + t.fn.tv + t.fn.bn;
    if (t.id != G.me) austerity(t);
    t.fl = t.fn;
    t.fn = nf();
    t.fs = 0;
    t.nh = 0;
    if (t.id == G.me) {
      t.sp.forEach((d) => d.yrs--);
      t.sp = t.sp.filter((d) => d.yrs > 0);
    }
  }));
  G.off = {};
  G.sk = {};
}
const prevTxt = (me, v) => {
  const g = gate({ ...me, st: { ...me.st, pr: v } }, me.pos || me.exp);
  return `Projected per home match: ${Math.round(g.att).toLocaleString()} fans (${Math.round(g.full * 100)}% full), ${fm1(g.rev)}. About ${fm1(g.rev * 19)} a season.`;
};
function setPrices() {
  const me = G.t[G.me];
  me.st.pr = [0, 1, 2].map((i) => Math.max(1, +$("#tp" + i).value || 1));
  note("Ticket prices updated.");
}
function expandSt() {
  const me = G.t[G.me], c = 6;
  if (me.st.pend) return note("Construction is already under way.");
  if (me.bud < c) return note(`You need ${fm1(c)} in cash.`);
  me.bud -= c;
  me.fn.cs += c;
  me.st.pend = { cap: me.st.cap + 5e3, yrs: 1 };
  note(`Expansion started: +5,000 seats for ${fm1(c)}. It opens next season.`);
}
function newSt() {
  const me = G.t[G.me], cap = +$("#nsc").value, c = +(cap * 3e-3).toFixed(1);
  if (me.st.pend) return note("Construction is already under way.");
  if (cap <= me.st.cap) return note("Choose a stadium larger than your current one.");
  if (me.bud < c) return note(`You need ${fm1(c)} in cash.`);
  me.bud -= c;
  me.fn.cs += c;
  me.st.pend = { cap, yrs: 2 };
  note(`New ${cap.toLocaleString()}-seat stadium started for ${fm1(c)}. It opens in two seasons.`);
}
function accept(k, i) {
  const me = G.t[G.me], o = (G.off[k] || [])[i];
  if (!o) return;
  me.sp.push({ ...o, slot: k });
  delete G.off[k];
  note(`Signed ${o.co} for ${slotName(k).toLowerCase()}.`);
}
function renewOld(i) {
  const me = G.t[G.me], p = me.pl[i];
  if (!p) return;
  if (p.mo < 30) return note(`${p.n} is unhappy and refuses to discuss a new contract.`);
  const w = renewWage(p);
  p.w = w;
  p.cy = 3;
  note(`${p.n} signs a new 3-year contract on ${fm1(w)} a year.`);
}
