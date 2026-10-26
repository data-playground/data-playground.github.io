// Builds leagues, clubs, players and fixtures from a world file
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const mkL = (names, hi, lo) => names.map((n, i) => ({ n, rep: Math.round(hi - (hi - lo) * i / (names.length - 1)) }));
const WORLD = { v: 1, name: "Built-in fictional world", nations: [
  { id: "cos", name: "Costaverde", leagues: [{ tier: 1, name: "Costaverde Serie A", tv: 60, clubs: CL.map(([n, rep]) => ({ n, rep })) }, { tier: 2, name: "Costaverde Serie B", tv: 18, clubs: mkL(["Alvorada", "Bela Vista", "Campo Real", "Dourados City", "Esperança", "Floresta FC", "Gaúcho Unido", "Horizonte", "Ipanema Azul", "Jacarandá", "Lagoa Dourada", "Mirante", "Nova Aurora", "Ouro Verde", "Planalto", "Quixadá City", "Recanto", "Sol Nascente", "Trindade FC", "Uberaba Norte"], 61, 48) }] },
  { id: "nor", name: "Norland", leagues: [{ tier: 1, name: "Norland Premier", tv: 40, clubs: mkL(["Kronborg", "Fjordvik", "Nordstrand", "Valhalla", "Skarholm", "Thule City", "Bergvik Real", "Aurora Boreal", "Vikingmark", "Haldor FC", "Lindholm", "Osterfjord", "Stavmark", "Tromvik", "Helgeland FC", "Midgard"], 74, 52) }, { tier: 2, name: "Norland Second Division", tv: 12, clubs: mkL(["Ulvik", "Rørstad", "Sandvik", "Torsvik", "Ekeby", "Granvik", "Hjortland", "Isvik", "Jernmark", "Kvarnby", "Langvik", "Mosby", "Nesvik", "Odalen", "Presthaug", "Raudvik"], 58, 46) }] }
] };
const SPOS = ["GK", "LB", "CB", "RB", "DM", "CM", "AM", "LW", "RW", "ST"], COARSE = { GK: "GK", LB: "DF", CB: "DF", RB: "DF", DM: "MF", CM: "MF", AM: "MF", LW: "FW", RW: "FW", ST: "FW" }, MAXL = 10;
let WS = WORLD, WSEL = ["cos:1", "cos:2"], WMSG = "", XW = "", HOME = null, NSTEP = 1, SHLK = false;
function valWorld(w) {
  const e = [], seen = new Set();
  if (!w || w.v !== 1 || !Array.isArray(w.nations) || !w.nations.length) return ['Expected {"v":1,"nations":[...]}.'];
  w.nations.forEach((nt, ni) => {
    if (!nt.id || !nt.name) e.push(`Nation ${ni + 1} needs an id and a name.`);
    const ls = nt.leagues;
    if (!Array.isArray(ls) || !ls.length) {
      e.push(`${nt.name || ni + 1}: no leagues.`);
      return;
    }
    const ts = ls.map((l) => l.tier);
    if (new Set(ts).size != ts.length) e.push(`${nt.name}: two leagues share a tier.`);
    ls.forEach((l) => {
      const tag = `${nt.name} tier ${l.tier}`;
      if (!(l.tier >= 1)) e.push(`${tag}: tier must be 1 or more.`);
      if (!Array.isArray(l.clubs) || l.clubs.length < 6 || l.clubs.length > 40 || l.clubs.length % 2) e.push(`${tag}: needs an even number of clubs, 6 to 40.`);
      if (l.fmt && l.fmt != "single" && l.fmt != "double") e.push(`${tag}: fmt must be single or double.`);
      (l.clubs || []).forEach((c) => {
        if (!c.n) e.push(`${tag}: a club has no name.`);
        else if (seen.has(c.n)) e.push(`Duplicate club name: ${c.n}.`);
        seen.add(c.n);
        if (!(c.rep >= 20 && c.rep <= 95)) e.push(`${c.n}: rep must be 20 to 95.`);
        (c.players || []).forEach((p) => {
          if (!p.n || !SPOS.includes(p.sp) || !(p.a >= 15 && p.a <= 45) || !(p.o >= 1 && p.o <= 99) || p.nat !== void 0 && typeof p.nat != "string") e.push(`${c.n}: bad player ${p.n || "?"} (needs n, sp, a, o).`);
        });
      });
    });
  });
  return e.slice(0, 6);
}
const lgList = (w) => {
  const o = [];
  w.nations.forEach((nt) => [...nt.leagues].sort((a, b) => a.tier - b.tier).forEach((l) => o.push({ key: nt.id + ":" + l.tier, nt, l })));
  return o;
};
const worldList = (sel) => {
  const o = [];
  lgList(WS).filter((x) => sel.includes(x.key)).forEach((x) => x.l.clubs.forEach((c, ci) => o.push({ key: x.key, ci, c, l: x.l, nt: x.nt })));
  return o;
};
const NCODE = { England: "ENG", Scotland: "SCO", Wales: "WAL", "Northern Ireland": "NIR", Ireland: "IRL", USA: "USA", Spain: "ESP", Argentina: "ARG", Brazil: "BRA", Portugal: "POR", Italy: "ITA", Germany: "GER", France: "FRA", Netherlands: "NED", Belgium: "BEL", Turkey: "TUR", Uruguay: "URU", "Ivory Coast": "CIV", "South Africa": "RSA", "South Korea": "KOR", Switzerland: "SUI", "DR Congo": "COD", Denmark: "DEN", Sweden: "SWE", Norway: "NOR", Croatia: "CRO", Poland: "POL", Morocco: "MAR", Nigeria: "NGA", Ghana: "GHA", Senegal: "SEN", Japan: "JPN", Colombia: "COL", Chile: "CHI", Paraguay: "PAR", Mexico: "MEX", Canada: "CAN", Australia: "AUS", Austria: "AUT", "Czech Republic": "CZE", Serbia: "SRB", Greece: "GRE", Algeria: "ALG", Cameroon: "CMR", Egypt: "EGY", Ecuador: "ECU", Peru: "PER", Venezuela: "VEN", Finland: "FIN", Iceland: "ISL", Russia: "RUS", Ukraine: "UKR", Slovenia: "SVN", Slovakia: "SVK", Hungary: "HUN", Romania: "ROU", "Costa Rica": "CRC", "Cape Verde": "CPV" };
const ncode = (n) => n ? NCODE[n] || n.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() : "";
const pn = (p) => p.nt ? `${p.n} <span class="mut" title="${p.nt}" style="font-size:.78em">${ncode(p.nt)}</span>` : p.n;
const natFor = (cn, all) => {
  if (!cn) return void 0;
  const o = (all || []).filter((x) => x != cn);
  return o.length && Math.random() < 0.14 ? pick(o) : cn;
};
const lgNats = () => [...new Set((G.lg || []).map((l) => l.cn))];
let NATS = [];
function baseP(pos, o, a) {
  return { n: pick(FN)[0] + ". " + pick(LN), pos, o, g: 0, y: 0, r: 0, ap: 0, mn: 0, inj: 0, sus: 0, pl: 0, cd: 100, mo: 60, rs: 0, fm: 6.3, id: uid(), ls: null, a };
}
function impP(p) {
  const q = baseP(COARSE[p.sp], p.o, p.a);
  q.n = p.n;
  setSp(q, p.sp);
  if (p.pc) q.pc = p.pc;
  if (p.ae) q.ae = p.ae;
  if (p.sec) Object.entries(p.sec).forEach(([k, v]) => {
    q.fam[k] = v;
  });
  q.pot = p.pot || q.o + Math.max(0, Math.round(rn(0, 14) - (q.a - 19) * 1.5));
  if (p.w) q.w = p.w;
  if (p.cy) q.cy = p.cy;
  if (p.nat) q.nt = p.nat;
  return q;
}
function mkClub(c, id, lgi, cn, all) {
  const b = c.rep;
  let pl;
  if (c.players && c.players.length >= 5) {
    pl = c.players.map(impP);
    const MN0 = { GK: 2, DF: 6, MF: 6, FW: 4 };
    for (const q in MN0) while (pl.filter((p) => p.pos == q).length < MN0[q]) {
      const p = baseP(q, Math.max(28, Math.round(b - 8 + rn(-5, 3))), Math.round(rn(18, 30)));
      p.pot = p.o + Math.round(rn(0, 10));
      setSp(p, pick(SPG[q]));
      pl.push(p);
    }
  } else {
    pl = [];
    [["GK", 2], ["DF", 6], ["MF", 6], ["FW", 4]].forEach(([p, c2]) => {
      for (let k = 0; k < c2; k++) pl.push(baseP(p, Math.max(28, Math.round(b + rn(-7, 5) - k * 1.5)), Math.round(rn(18, 35))));
    });
    pl.forEach((p) => {
      p.pot = p.o + Math.max(0, Math.round(rn(0, 14) - (p.a - 19) * 1.5));
    });
    {
      const ix = { GK: 0, DF: 0, MF: 0, FW: 0 };
      pl.forEach((p) => {
        const L = { GK: ["GK", "GK"], DF: ["LB", "RB", "CB", "CB", "CB", pick(["LB", "RB", "CB"])], MF: ["DM", "CM", "CM", "AM", "CM", pick(["DM", "CM", "AM"])], FW: ["ST", "ST", "LW", "RW"] }[p.pos];
        setSp(p, L[ix[p.pos]++]);
      });
    }
  }
  pl.forEach((p) => {
    if (!p.nt) p.nt = natFor(cn, all);
  });
  const t = { id, lg: lgi, rep: b, rp: b, rv: -1, co: null, fp: 0, bud: 0, fn: nf(), sp: [], fs: 0, nh: 0, name: c.n, pl, f: "4-4-2", style: "balanced", xi: [], P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0 };
  t.st = stad(t);
  {
    const c0 = t.st.cap;
    if (c.stadium && c.stadium.cap) t.st.cap = Math.round(cl(c.stadium.cap, c0 * 0.75, c0 * 1.35) / 500) * 500;
  }
  t.fc = mkFc(t);
  pl.forEach((p) => {
    if (!p.w) p.w = wageFor(p);
    if (!p.cy) p.cy = 1 + (Math.random() * 4 | 0);
  });
  auto(t);
  return t;
}
function buildWorld(sel) {
  const L = worldList(sel);
  NATS = [...new Set(L.map((x) => x.nt.name))];
  const t = [], lg = [], by = {};
  let id = 0;
  L.forEach((x) => {
    if (!by[x.key]) {
      by[x.key] = { id: lg.length, key: x.key, name: x.l.name, cn: x.nt.name, nid: x.nt.id, tier: x.l.tier, ids: [], n: x.l.clubs.length, rounds: (x.l.fmt == "single" ? 1 : 2) * (x.l.clubs.length - 1), fmt: x.l.fmt || "double", tv: x.l.tv || ({ 1: 60, 2: 18, 3: 6 }[x.l.tier] || 4), fix: [] };
      lg.push(by[x.key]);
    }
    t.push(mkClub(x.c, id, by[x.key].id, x.nt.name, NATS));
    by[x.key].ids.push(id++);
  });
  lg.forEach((l) => rivals(l, t));
  return { t, lg };
}
function rivals(l, t) {
  const s = l.ids.map((i) => t[i]).sort((a, b) => b.rep - a.rep);
  for (let i = 0; i + 1 < s.length; i += 2) {
    s[i].rv = s[i + 1].id;
    s[i + 1].rv = s[i].id;
  }
}
function mkFix(l) {
  const ids = [...l.ids].sort(() => Math.random() - 0.5);
  return fixtures(l.n).slice(0, l.rounds).map((r) => r.map(([a, b]) => [ids[a], ids[b]]));
}
function mk() {
  return buildWorld(["cos:1"]).t;
}
function fixtures(n) {
  const ids = [...Array(n).keys()], R = [];
  for (let r = 0; r < n - 1; r++) {
    const m = [];
    for (let i = 0; i < n / 2; i++) {
      const a = ids[i], b = ids[n - 1 - i];
      m.push(r % 2 ? [b, a] : [a, b]);
    }
    R.push(m);
    ids.splice(1, 0, ids.pop());
  }
  return R.concat(R.map((r) => r.map(([a, b]) => [b, a])));
}
