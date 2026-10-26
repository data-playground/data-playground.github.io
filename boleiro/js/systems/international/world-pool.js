// The world player pool and national squads
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const CONFS = {
  UEFA: "Albania,Armenia,Austria,Belgium,Bosnia and Herzegovina,Bulgaria,Croatia,Cyprus,Czech Republic,Denmark,England,Estonia,Finland,France,Georgia,Germany,Greece,Hungary,Iceland,Ireland,Israel,Italy,Kosovo,Lithuania,Luxembourg,Malta,Montenegro,Netherlands,North Macedonia,Northern Ireland,Norway,Poland,Portugal,Romania,Russia,Scotland,Serbia,Slovakia,Slovenia,Spain,Sweden,Switzerland,Turkey,Ukraine,Wales,Andorra,Latvia,Moldova",
  CONMEBOL: "Argentina,Bolivia,Brazil,Chile,Colombia,Ecuador,Paraguay,Peru,Uruguay,Venezuela",
  CONCACAF: "Canada,Costa Rica,Curaçao,Dominican Republic,Grenada,Guadeloupe,Guatemala,Haiti,Honduras,Jamaica,Martinique,Mexico,Panama,Suriname,Trinidad and Tobago,USA,El Salvador,Guyana",
  CAF: "Algeria,Angola,Benin,Burkina Faso,Cameroon,Cape Verde,Central African Republic,Comoros,Congo,DR Congo,Egypt,Equatorial Guinea,Gabon,Gambia,Ghana,Guinea,Guinea-Bissau,Ivory Coast,Kenya,Madagascar,Mali,Morocco,Mozambique,Nigeria,Senegal,Sierra Leone,South Africa,Togo,Tunisia,Uganda,Zambia,Zimbabwe",
  AFC: "Australia,Indonesia,Japan,South Korea,Syria,New Zealand"
};
const NCONF = {};
Object.entries(CONFS).forEach(([k, v]) => v.split(",").forEach((n) => NCONF[n] = k));
const confOf = (n) => NCONF[n] || "UEFA";
const IWK = [6, 10, 15, 33], IWN = ["September", "October", "November", "March"], NQ = { GK: 3, DF: 8, MF: 7, FW: 5 };
const DEVC = [[19, 4], [20, 3.2], [21, 2.6], [22, 1.8], [23, 1.1], [24, 0.5], [28, 0], [29, -0.3], [30, -0.8], [31, -1.3], [32, -1.9], [33, -2.5], [99, -3.2]];
function wpDev(p) {
  const ag = p.pos == "GK" ? p.a - 3 : p.a;
  let g = DEVC.find(([x]) => ag <= x)[1];
  if (g > 0) g *= cl((p.pot - p.o) / 8, 0, 1.3);
  return g + rn(-1, 1);
}
function natMap() {
  const m = {}, add = (p) => {
    if (p.nt) (m[p.nt] = m[p.nt] || []).push(p);
  };
  G.t.forEach((t) => t.pl.forEach(add));
  (G.gc || []).forEach((t) => t.pl.forEach(add));
  G.fa.forEach(add);
  const kk = (p) => p.n + "|" + p.nt + "|" + p.pos, seen = new Set();
  Object.values(m).forEach((L) => L.forEach((p) => seen.add(kk(p))));
  (G.wp || []).forEach((p) => {
    if (!seen.has(kk(p))) add(p);
  });
  return m;
}
const topAvg = (L, k) => {
  const a = L.map((p) => p.o).sort((x, y) => y - x).slice(0, k);
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 40;
};
function wpMk(nat, str, age, o0) {
  const pos = pick(["GK", "DF", "DF", "DF", "MF", "MF", "MF", "FW", "FW"]), a = age, o = o0 != null ? o0 : cl(Math.round(str - 8 + rn(-6, 5)), 30, 86);
  const pot = cl(Math.round(o + Math.max(0, rn(0, 16) - (a - 19) * 1.4)), o, 93);
  return { id: uid(), n: pick(FN)[0] + ". " + pick(LN), nt: nat, sp: pick(SPG[pos]), pos, o, pot, a, c: "", ic: 0, ig: 0, g: 1 };
}
function wpFill() {
  const m = natMap();
  Object.keys(m).forEach((nat) => {
    const L = m[nat];
    if (L.length < 5 || L.length >= 26) return;
    const str = topAvg(L, 8);
    for (let i = L.length; i < 28; i++) G.wp.push(wpMk(nat, str, Math.round(rn(19, 33)), cl(Math.round(str - 9 - (i - L.length) * 0.35 + rn(-5, 4)), 30, 86)));
  });
}
function wpBuild() {
  if (G.wp || typeof WS == "undefined" || !WS) return;
  const fol = new Set(G.lg.map((l) => l.key));
  G.wp = [];
  lgList(WS).forEach((x) => {
    if (fol.has(x.key)) return;
    x.l.clubs.forEach((c) => (c.players || []).forEach((p) => {
      if (!p.nat) return;
      G.wp.push({ id: uid(), n: p.n, nt: p.nat, sp: p.sp, pos: COARSE[p.sp] || "MF", o: p.o, pot: Math.max(p.o, p.pot || p.o), a: p.a, c: c.n, ic: 0, ig: 0 });
    }));
  });
  for (let y = 1; y < G.season; y++) G.wp.forEach((p) => {
    const old = p.o;
    p.o = cl(Math.round(p.o + wpDev(p)), 25, 95);
    if (p.o > old) p.o = Math.min(p.o, Math.max(old, p.pot + 1));
    p.pot = Math.max(p.pot, p.o);
    p.a++;
  });
  G.wp = G.wp.filter((p) => p.a < 37);
  wpFill();
}
function wpSeason() {
  if (!G.wp) return;
  const M = natMap(), str = {}, lost = {};
  Object.keys(M).forEach((n) => str[n] = topAvg(M[n], 14));
  const keep = [];
  G.wp.forEach((p) => {
    const old = p.o;
    p.o = cl(Math.round(p.o + wpDev(p)), 25, 95);
    if (p.o > old) p.o = Math.min(p.o, Math.max(old, p.pot + 1));
    p.pot = Math.max(p.pot, p.o);
    p.a++;
    p.c = p.c;
    const ag = p.pos == "GK" ? p.a - 2 : p.a, rp = ag < 34 ? 0 : ag == 34 ? 0.25 : ag == 35 ? 0.5 : ag == 36 ? 0.8 : 1;
    if (Math.random() < rp) lost[p.nt] = (lost[p.nt] || 0) + 1;
    else keep.push(p);
  });
  G.wp = keep;
  Object.entries(lost).forEach(([nat, k]) => {
    const s = str[nat] || 50;
    for (let i = 0; i < k; i++) {
      const o = cl(Math.round(s - 27 + rn(-6, 6)), 28, 62), y = wpMk(nat, s, Math.round(rn(17, 19)), o);
      y.pot = cl(Math.round(o + rn(6, 28) + (s - 60) * 0.3), o, 92);
      G.wp.push(y);
    }
  });
  wpFill();
}
const ensureNat = () => {
  if (!G.wp) wpBuild();
  G.nn = G.nn || {};
  G.ilog = G.ilog || [];
  G.irs = G.irs || [];
};
