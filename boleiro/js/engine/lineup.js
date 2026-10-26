// Formations, positions, auto line-up, tactics helpers
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function autoOld(t) {
  const [d, m, f] = FM[t.f];
  t.xi = [];
  [["GK", 1], ["DF", d], ["MF", m], ["FW", f]].forEach(([p, c]) => t.pl.map((x, i) => [x, i]).filter(([x]) => x.pos == p && !x.inj && !x.sus).sort((a, b) => sc_(b[0]) - sc_(a[0])).slice(0, c).forEach(([, i]) => t.xi.push(i)));
  fixXI(t);
}
const SPG = { GK: ["GK"], DF: ["LB", "RB", "CB", "CB", "CB"], MF: ["DM", "CM", "CM", "AM", "CM"], FW: ["ST", "ST", "LW", "RW"] }, TR = { GK: [40, 70], CB: [55, 72], LB: [72, 52], RB: [72, 52], DM: [58, 62], CM: [58, 55], AM: [66, 45], LW: [76, 45], RW: [76, 45], ST: [66, 62] }, SECMAP = { CB: ["DM", "RB", "LB"], LB: ["RB", "LW", "CB"], RB: ["LB", "RW", "CB"], DM: ["CM", "CB"], CM: ["DM", "AM"], AM: ["CM", "LW", "RW", "ST"], LW: ["RW", "AM", "ST"], RW: ["LW", "AM", "ST"], ST: ["AM", "LW", "RW"] };
const FAMX = { CB: 0, LB: 1, RB: 1, DM: 2, CM: 3, AM: 4, LW: 5, RW: 5, ST: 6 }, PBASE = [[0, 5, 3, 6, 10, 13, 14], [5, 0, 5, 7, 9, 6, 12], [3, 5, 0, 3, 6, 10, 13], [6, 7, 3, 0, 3, 6, 9], [10, 9, 6, 3, 0, 3, 5], [13, 6, 10, 6, 3, 0, 5], [14, 12, 13, 9, 5, 5, 0]];
const WA = { ST: 1, LW: 0.7, RW: 0.7, AM: 0.5, CM: 0.12 }, WM = { DM: 1, CM: 1, AM: 0.5, LW: 0.3, RW: 0.3 }, WD = { CB: 1, LB: 1, RB: 1, DM: 0.2 }, SW = { ST: 5, LW: 3.5, RW: 3.5, AM: 3, CM: 1.5, DM: 0.8, CB: 0.5, LB: 0.6, RB: 0.6, GK: 0 };
function slOf(t) {
  return t.cs && t.cs.length == 11 ? t.cs : SL[t.f] || SL["4-4-2"];
}
function roleAt(x, y) {
  const w = x <= 24 ? "L" : x >= 76 ? "R" : "C";
  if (y >= 64) return w == "L" ? "LB" : w == "R" ? "RB" : "CB";
  if (y >= 55) return w == "L" ? "LB" : w == "R" ? "RB" : "DM";
  if (y >= 33) return w == "L" ? "LW" : w == "R" ? "RW" : "CM";
  if (y >= 24) return w == "L" ? "LW" : w == "R" ? "RW" : "AM";
  return w == "L" ? "LW" : w == "R" ? "RW" : "ST";
}
function moveSlotOf(t, k, x, y) {
  if (k < 1 || k > 10) return false;
  x = Math.round(Math.max(8, Math.min(92, x)));
  y = Math.round(Math.max(8, Math.min(80, y)));
  t.cs = slOf(t).map((a) => a.slice());
  t.cs[k] = [roleAt(x, y), x, y];
  return true;
}
function moveSlot(k, x, y) {
  const me = G.t[G.me];
  if (busy) return;
  moveSlotOf(me, k, x, y);
  SEL = -1;
  render();
}
const SL = { "4-1-4-1": [["GK", 50, 90], ["LB", 14, 70], ["CB", 38, 75], ["CB", 62, 75], ["RB", 86, 70], ["DM", 50, 60], ["LW", 14, 42], ["CM", 38, 46], ["CM", 62, 46], ["RW", 86, 42], ["ST", 50, 18]], "3-4-3": [["GK", 50, 90], ["CB", 28, 76], ["CB", 50, 79], ["CB", 72, 76], ["LB", 10, 58], ["CM", 36, 52], ["CM", 64, 52], ["RB", 90, 58], ["LW", 18, 24], ["ST", 50, 18], ["RW", 82, 24]], "5-4-1": [["GK", 50, 90], ["LB", 10, 64], ["CB", 30, 76], ["CB", 50, 79], ["CB", 70, 76], ["RB", 90, 64], ["LW", 14, 44], ["CM", 38, 50], ["CM", 62, 50], ["RW", 86, 44], ["ST", 50, 20]], "4-4-2": [["GK", 50, 90], ["LB", 14, 70], ["CB", 38, 75], ["CB", 62, 75], ["RB", 86, 70], ["LW", 14, 46], ["CM", 38, 50], ["CM", 62, 50], ["RW", 86, 46], ["ST", 38, 20], ["ST", 62, 20]], "4-3-3": [["GK", 50, 90], ["LB", 14, 70], ["CB", 38, 75], ["CB", 62, 75], ["RB", 86, 70], ["CM", 30, 48], ["DM", 50, 60], ["CM", 70, 48], ["LW", 16, 24], ["ST", 50, 16], ["RW", 84, 24]], "5-3-2": [["GK", 50, 90], ["LB", 10, 62], ["CB", 30, 76], ["CB", 50, 79], ["CB", 70, 76], ["RB", 90, 62], ["CM", 30, 48], ["DM", 50, 56], ["CM", 70, 48], ["ST", 38, 20], ["ST", 62, 20]], "3-5-2": [["GK", 50, 90], ["CB", 28, 76], ["CB", 50, 79], ["CB", 72, 76], ["LW", 10, 48], ["CM", 32, 52], ["DM", 50, 60], ["CM", 68, 52], ["RW", 90, 48], ["ST", 38, 20], ["ST", 62, 20]], "4-2-3-1": [["GK", 50, 90], ["LB", 14, 70], ["CB", 38, 75], ["CB", 62, 75], ["RB", 86, 70], ["DM", 38, 60], ["CM", 62, 60], ["LW", 16, 36], ["AM", 50, 38], ["RW", 84, 36], ["ST", 50, 16]] };
FM["4-2-3-1"] = [4, 5, 1];
FMX["4-2-3-1"] = { a: 1.02, m: 1.04, d: 0.96 };
function setSp(p, sp) {
  p.sp = sp;
  const t = TR[sp];
  p.pc = Math.round(cl(t[0] + rn(-12, 12), 25, 97));
  p.ae = Math.round(cl(t[1] + rn(-12, 12), 25, 97));
  p.fam = {};
  p.fam[sp] = 100;
  if (sp != "GK" && Math.random() < 0.45) p.fam[pick(SECMAP[sp])] = Math.round(rn(55, 85));
}
function pen(p, s) {
  if (!p || p.sp === s) return 0;
  if (s == "GK" || p.sp == "GK") return 45;
  let b = PBASE[FAMX[p.sp]][FAMX[s]];
  if (p.sp == "LB" && s == "RB" || p.sp == "RB" && s == "LB" || p.sp == "LW" && s == "RW" || p.sp == "RW" && s == "LW") b += 3;
  if (s == "LB" || s == "RB" || s == "LW" || s == "RW") b += Math.max(0, 65 - p.pc) * 0.12;
  if (s == "CB") b += Math.max(0, 70 - p.ae) * 0.1;
  if ((s == "LW" || s == "RW") && p.sp == "ST") b += Math.max(0, p.ae - 60) * 0.08;
  return Math.min(25, b * (1 - 0.75 * (p.fam && p.fam[s] || 0) / 100));
}
function auto(t) {
  const S = slOf(t), av = t.pl.map((p, i) => i).filter((i) => !t.pl[i].inj && !t.pl[i].sus), xi = Array(11).fill(-1);
  for (let n = 0; n < 11; n++) {
    let b = null;
    for (let k = 0; k < 11; k++) {
      if (xi[k] >= 0) continue;
      for (const i of av) {
        if (xi.includes(i)) continue;
        const sc = sc_(t.pl[i]) - pen(t.pl[i], S[k][0]);
        if (!b || sc > b.sc) b = { k, i, sc };
      }
    }
    if (!b) break;
    xi[b.k] = b.i;
  }
  t.xi = xi;
  fixXI(t);
}
function fixXI(t) {
  const S = slOf(t) || SL["4-4-2"], seen = new Set();
  if (!t.xi || t.xi.length != 11) t.xi = Array(11).fill(-1);
  t.xi = t.xi.map((i) => {
    if (i < 0 || !t.pl[i] || !av2(t.pl[i]) || seen.has(i)) return -1;
    seen.add(i);
    return i;
  });
  for (let k = 0; k < 11; k++) {
    if (t.xi[k] >= 0) continue;
    let b = -1, bs = -1e9;
    t.pl.forEach((p, i) => {
      if (t.xi.includes(i) || !av2(p)) return;
      const sc = sc_(p) - pen(p, S[k][0]);
      if (sc > bs) {
        bs = sc;
        b = i;
      }
    });
    if (b < 0) t.pl.forEach((p, i) => {
      if (b < 0 && !t.xi.includes(i)) b = i;
    });
    t.xi[k] = b;
  }
}
function str(t, fx, ex) {
  const X0 = FMX[t.f] || FMX["4-4-2"], cf = 1 + ((t.co ? t.co.abil : 60) - 60) * 4e-4, X = { a: X0.a * cf, m: X0.m * cf, d: X0.d * cf }, S = slOf(t) || SL["4-4-2"], L = [];
  t.xi.forEach((i, k) => {
    const p = t.pl[i];
    if (p && !(ex && ex.has(i))) L.push({ p, s: S[k][0], e: p.o + cl((p.fm - PB[p.pos]) * 1.5, -2, 2) + (p.mo - 60) * 0.02 + (fx ? fx(p) : 0) - pen(p, S[k][0]) });
  });
  const wv = (W) => {
    let a = 0, b = 0;
    L.forEach((x) => {
      const w = W[x.s] || 0;
      if (w) {
        a += w * x.e;
        b += w;
      }
    });
    return b ? a / b : 35;
  }, A = wv(WA), M = wv(WM), D = wv(WD), K = wv({ GK: 1 });
  return { a: (A * 0.65 + M * 0.35) * X.a * 1.011, m: M * X.m * 1.012, d: (D * 0.6 + K * 0.4) * X.d, k: K, all: L.reduce((a, x) => a + x.p.o, 0) / Math.max(L.length, 1) };
}
const secTxt = (p) => {
  const s = Object.entries(p.fam || {}).filter(([k, v]) => k != p.sp && v >= 40).map(([k, v]) => `${k} ${Math.round(v)}`).join(", ");
  return s ? ` <span class="mut">(${s})</span>` : "";
};
const limOf = (r) => Math.max(56, 45 + r * 0.55);
function defSel(w) {
  let best = w.nations[0];
  w.nations.forEach((n) => {
    if (n.leagues.length > best.leagues.length) best = n;
  });
  return lgList(w).filter((x) => x.nt.id == best.id).slice(0, MAXL).map((x) => x.key);
}
