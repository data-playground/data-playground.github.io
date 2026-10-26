// HTML templates: national teams and tournaments
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function ntHTML(me) {
  ensureNat();
  const TPH = tpHTML(me);
  const I = iwGet(), M = natMap(), nats = competes(M), W = I.w;
  if (!G.nv || !nats.includes(G.nv)) G.nv = me.pl.map((p) => p.nt).find((n) => nats.includes(n)) || nats[0];
  const rk = nats.map((n) => ({ n, E: eloOf(n), S: ntStr(ntXI(ntSel(M[n]))) })).sort((a, b) => b.E.e - a.E.e);
  const nxt = W.find((w) => !w.pl), cl_ = nxt ? nxt.an ? "Squads announced." : "Squads are announced a few days before." : "All windows done this season.";
  const wl = W.map((w) => `<tr><td class="l">${IWN[w.i]}</td><td class="l">${fd(w.t)} to ${fd(w.t + 5)}</td><td>${w.pl ? "played" : w.an ? "squads out" : "to come"}</td></tr>`).join("");
  const ids = new Set();
  W.forEach((w) => {
    if (!w.pl && w.an) Object.values(w.sq).forEach((a) => a.forEach((i) => ids.add(i)));
  });
  const mp = me.pl.filter((p) => nats.includes(p.nt)).sort((a, b) => (b.nd ? 2 : ids.has(b.id) ? 1 : 0) - (a.nd ? 2 : ids.has(a.id) ? 1 : 0) || b.o - a.o).slice(0, 18);
  const mine = mp.length ? `<table><tr><th class="l">Player</th><th>Nation</th><th>Rating</th><th>Caps</th><th>Goals</th><th class="l">Status</th></tr>${mp.map((p) => `<tr><td class="l">${p.n}</td><td>${ncode(p.nt)}</td><td>${p.o}</td><td>${p.ic || 0}</td><td>${p.ig || 0}</td><td class="l">${p.nd ? "away on duty" : ids.has(p.id) ? "called up" : p.inj ? "injured" : "-"}</td></tr>`).join("")}</table>` : `<p class="mut">None of your players belongs to a national team yet.</p>`;
  const sel = `<select id="ntv">${nats.slice().sort().map((n) => `<option value="${n}" ${n == G.nv ? "selected" : ""}>${n}</option>`).join("")}</select>`, sq = ntSel(M[G.nv] || []), xi = ntXI(sq), clubOf = {};
  G.t.forEach((t) => t.pl.forEach((p) => clubOf[p.id] = t.name));
  (G.gc || []).forEach((t) => t.pl.forEach((p) => clubOf[p.id] = t.name));
  const sqh = sq.map((p) => `<tr><td class="l">${xi.includes(p) ? "<b>" + p.n + "</b>" : p.n}</td><td>${p.pos}</td><td>${p.a}</td><td>${p.o}</td><td>${p.ic || 0}</td><td>${p.ig || 0}</td><td class="l mut">${clubOf[p.id] || p.c || "Free agent"}</td></tr>`).join("");
  const res = G.irs.slice(0, 16).map((r) => `<tr><td class="l">${r[0]}</td><td><b>${r[2]}-${r[3]}</b></td><td class="l">${r[1]}</td></tr>`).join("");
  return TPH + tmHTML() + `<div class="card"><h3>International windows, season ${G.season}</h3><p class="mut" style="margin:4px 0">Each nation calls up its best 23 players from the whole world, followed or not. Called-up players miss that week's club match and come back a little tired. ${cl_}</p><table>${wl}</table></div>
<div class="card"><h3>Your players</h3>${mine}</div>
<div class="card"><h3>Rankings</h3><div class="scroll" style="max-height:320px"><table><tr><th class="l">#</th><th class="l">Nation</th><th>Rating</th><th>XI</th><th>W-D-L</th></tr>${rk.slice(0, 40).map((r, i) => `<tr><td class="l">${i + 1}</td><td class="l">${r.n} <span class="mut">${ncode(r.n)}</span></td><td><b>${r.E.e}</b></td><td>${r.S.toFixed(1)}</td><td>${r.E.w}-${r.E.d}-${r.E.l}</td></tr>`).join("")}</table></div><p class="mut" style="margin:4px 0 0">${nats.length} nations compete. Rating starts from squad strength and moves with results.</p></div>
<div class="card"><h3>Squad</h3><div class="row">${sel}</div><div class="scroll" style="max-height:420px"><table><tr><th class="l">Player</th><th>Pos</th><th>Age</th><th>Rating</th><th>Caps</th><th>Goals</th><th class="l">Club</th></tr>${sqh}</table></div><p class="mut" style="margin:4px 0 0">Bold = starting XI (4-3-3). Players from unfollowed leagues are still part of the world: they age, improve and retire, and generated youngsters fill the gaps.</p></div>
<div class="card"><h3>Recent results</h3>${res ? `<table>${res}</table>` : `<p class="mut">No international matches yet.</p>`}</div>`;
}
function tmHTML() {
  const hist = G.itw || [], tn = G.itn || [];
  let s = G.season, nx = s % 2 == 0 ? s : s + 1;
  const nxt = `${nx % 4 == 0 ? "World Cup" : "European, South American, CONCACAF, African and Asian championships"}, summer ${2026 + nx} (end of season ${nx})`;
  if (!G.tv || !tn.some((t, i) => i + ":" + t.y == G.tv)) G.tv = tn.length ? tn.length - 1 + ":" + tn[tn.length - 1].y : "";
  const T = G.tv ? tn[+G.tv.split(":")[0]] : null;
  const hall = hist.slice().reverse().map((h) => `<tr><td>${h.y}</td><td class="l">${h.name}</td><td class="l"><b>${h.ch}</b></td><td class="l">${h.ru}</td><td class="l mut">${h.boot ? h.boot[0] + " (" + ncode(h.boot[1]) + ") " + h.boot[2] : ""}</td></tr>`).join("");
  let det = "";
  if (T) {
    det = `<div class="row"><select id="tnv">${tn.map((t, i) => `<option value="${i}:${t.y}" ${G.tv == i + ":" + t.y ? "selected" : ""}>${t.y} ${t.name}</option>`).join("")}</select></div><div class="row" style="flex-wrap:wrap;align-items:flex-start">${T.groups.map((g, gi) => `<div style="min-width:230px;margin:0 12px 10px 0"><b>Group ${"ABCDEFGH"[gi]}</b><table>${g.map((r, i) => `<tr><td class="l">${i < 2 ? "<b>" + r.n + "</b>" : r.n}</td><td>${r.P}</td><td>${r.GF - r.GA > 0 ? "+" : ""}${r.GF - r.GA}</td><td><b>${r.Pts}</b></td></tr>`).join("")}</table></div>`).join("")}</div>` + T.ko.map((r) => `<p style="margin:6px 0 2px"><b>${r.name}</b></p><table>${r.ties.map((t) => `<tr><td class="l">${t.w == t.a ? "<b>" + t.a + "</b>" : t.a}</td><td><b>${t.ga}-${t.gb}</b>${t.pen ? ' <span class="mut">pens</span>' : ""}</td><td class="l">${t.w == t.b ? "<b>" + t.b + "</b>" : t.b}</td></tr>`).join("")}</table>`).join("");
  }
  return `<div class="card"><h3>International tournaments</h3><p class="mut" style="margin:4px 0">Next: ${nxt}. Every four years there is a 32-nation World Cup, and two years later the five continental championships. Fields come from the rankings with some luck, then groups of four and knockout rounds. Players come back a little tired, and a few come back injured.</p>${hist.length ? `<table><tr><th>Year</th><th class="l">Tournament</th><th class="l">Champions</th><th class="l">Runners-up</th><th class="l">Top scorer</th></tr>${hall}</table>` : `<p class="mut">None played yet.</p>`}${det ? `<div style="margin-top:8px">${det}</div>` : ""}</div>`;
}
const NMC = { UEFA: "eu", CONMEBOL: "sa", CONCACAF: "na", CAF: "af", AFC: "as" };
function tpHTML(me) {
  const N = G.nm, M = natMap(), nats = competes(M), tp = G.tp;
  if (!N) {
    const cur = G.nmp && nats.includes(G.nmp) ? G.nmp : me.pl.map((p) => p.nt).find((n) => nats.includes(n)) || nats[0];
    return `<div class="card"><h3>Manage a national team</h3><p class="mut" style="margin:4px 0">Take charge of a nation next to your club job. You pick its squad and tactics and play its tournament matches yourself: the World Cup, and the championship of its confederation. Your nation is always in the field (qualifiers are not played yet). Matches with the club are unaffected.</p><div class="row"><select id="nmn">${nats.slice().sort().map((n) => `<option value="${n}" ${n == cur ? "selected" : ""}>${n}</option>`).join("")}</select><button data-a="nm" data-k="take"><b>Take charge</b></button></div></div>`;
  }
  tqEnsure();
  const T = ntTeam(N.n, true, G.tp || G.tq), S = slOf(T), inXI = new Set(T.xi.map((i) => T.pl[i].oid)), inSq = new Set(T.pl.map((q) => q.oid)), clubOf = {};
  G.t.forEach((t) => t.pl.forEach((p) => clubOf[p.id] = t.name));
  (G.gc || []).forEach((t) => t.pl.forEach((p) => clubOf[p.id] = t.name));
  const ys = G.season, nx = ys % 2 == 0 ? ys : ys + 1, ck = NMC[confOf(N.n)], nxt = nx % 4 == 0 ? "World Cup" : ck ? TD[ck].name : "World Cup (next one)", hd = `<div class="card"><h3>${N.n} <span class="mut">national team</span></h3><div class="row" style="flex-wrap:wrap"><select id="nmf">${Object.keys(SL).map((f) => `<option ${f == N.f ? "selected" : ""}>${f}</option>`).join("")}</select><select id="nms">${Object.keys(STY).map((f) => `<option ${f == N.sty ? "selected" : ""}>${f}</option>`).join("")}</select>${tp ? "" : `<button data-a="nm" data-k="resign">Resign</button>`}</div><p class="mut" style="margin:6px 0 0">${tp ? "Tournament under way." : `Next: ${nxt}, summer ${2026 + nx} (end of season ${nx}).`} Strength of your XI: <b>${ntStr(T.xi.map((i) => T.pl[i])).toFixed(1)}</b>.${(N.hist || []).length ? "<br>History: " + N.hist.map((h) => `${h.y} ${h.name}: ${h.stage}${h.rc ? ` (reputation ${h.rc > 0 ? "+" : ""}${h.rc})` : ""}`).join("; ") : ""}</p></div>`;
  let tpc = "";
  if (tp) {
    const mine = tpMine(), opp = mine ? mine.a == N.n ? mine.b : mine.a : null, rk = (gr) => gr.slice().sort((a, b) => tp.st[b].Pts - tp.st[a].Pts || tp.st[b].GF - tp.st[b].GA - (tp.st[a].GF - tp.st[a].GA) || tp.st[b].GF - tp.st[a].GF);
    tpc = `<div class="card"><h3>${tp.y} ${tp.name}</h3><p style="margin:4px 0">${tp.out ? `<span class="bad">${N.n} are out.</span> The rest of the tournament can be simulated.` : `Next: <b>${tpLab()}</b> vs <b>${opp}</b> (rating ${eloOf(opp).e}, you ${eloOf(N.n).e}).`}</p><div class="row" style="flex-wrap:wrap">${tp.out ? "" : `<button data-a="nm" data-k="live"><b>Play match (live)</b></button><button data-a="nm" data-k="sim">Simulate match</button>`}<button data-a="nm" data-k="all">Simulate rest of tournament</button></div>
${tp.mine.length ? `<table style="margin-top:8px">${tp.mine.map((m) => `<tr><td class="l mut">${m.lab}</td><td class="l">${N.n} vs ${m.opp}</td><td><b>${m.gf}-${m.ga}</b>${m.pen ? ` (${m.pen[0]}-${m.pen[1]}p)` : m.et ? " aet" : ""}</td></tr>`).join("")}</table>` : ""}
<div class="row" style="flex-wrap:wrap;align-items:flex-start;margin-top:8px">${tp.groups.map((g, gi) => `<div style="min-width:230px;margin:0 12px 10px 0"><b>Group ${"ABCDEFGH"[gi]}</b><table>${rk(g).map((n) => {
      const r = tp.st[n];
      return `<tr><td class="l">${n == N.n ? "<b>" + n + "</b>" : n}</td><td>${r.P}</td><td>${r.GF - r.GA > 0 ? "+" : ""}${r.GF - r.GA}</td><td><b>${r.Pts}</b></td></tr>`;
    }).join("")}</table></div>`).join("")}</div>
${tp.ko.map((r) => `<p style="margin:6px 0 2px"><b>${r.name}</b></p><table>${r.ties.map((t) => `<tr><td class="l">${t.w == t.a ? "<b>" + t.a + "</b>" : t.a}</td><td><b>${t.ga}-${t.gb}</b>${t.pen ? ' <span class="mut">pens</span>' : ""}</td><td class="l">${t.w == t.b ? "<b>" + t.b + "</b>" : t.b}</td></tr>`).join("")}</table>`).join("")}</div>`;
  }
  const L = (M[N.n] || []).slice().sort((a, b) => b.o - a.o).slice(0, 40), stl = (p) => {
    const q = N.pl[p.id];
    return tp && tp.inj[p.id] > 0 ? '<span class="bad">injured</span>' : tp && tp.sus[p.id] > 0 ? '<span class="bad">suspended</span>' : q == "in" ? "<b>Must start</b>" : q == "out" ? "Left out" : "Auto";
  };
  const sqc = `<div class="card"><h3>Squad and selection</h3><p class="mut" style="margin:4px 0">Tap the status to cycle Auto, Must start and Left out. Auto picks the best player for each slot. Bold = starting XI, the rest of the 23 is shown as Squad.</p><div class="scroll" style="max-height:420px"><table class="fit"><tr><th class="l">Player</th><th>Age</th><th>Ovr</th><th class="l">Pick</th><th class="l">Status</th></tr>${L.map((p) => `<tr><td>${inXI.has(p.id) ? "<b>" + p.n + "</b>" : p.n}<div class="sub">${p.sp || p.pos} · ${clubOf[p.id] || p.c || "Free agent"}</div></td><td>${p.a}</td><td>${p.o}</td><td class="l">${inXI.has(p.id) ? "XI" : inSq.has(p.id) ? "Squad" : "-"}</td><td class="l"><button data-a="nm" data-k="pl" data-i="${p.id}">${stl(p)}</button></td></tr>`).join("")}</table></div></div>
<div class="card"><h3>Starting XI (${T.f})</h3><table>${T.xi.map((i, k) => `<tr><td class="l mut">${S[k][0]}</td><td class="l">${T.pl[i].n}</td><td>${T.pl[i].o}</td></tr>`).join("")}</table></div>`;
  return hd + tqHTML() + tpc + sqc;
}
function tqHTML() {
  const t = G.tq, N = G.nm;
  if (!t || !N) return "";
  const rk = tqRank(t), av = !t.done && t.md < 6 && G.round >= tqU(t.md), nxm = !t.done && t.md < 6 && !av;
  const fx = TQF.map((m, i) => {
    const p = m.find((q) => q.includes(0)), home = p[0] == 0, opp = t.grp[home ? p[1] : p[0]], r = t.mine[i];
    return `<tr><td class="l mut">Matchday ${i + 1}</td><td class="l">${home ? "vs" : "at"} ${opp}</td><td>${r ? `<b>${r.gf}-${r.ga}</b>` : i == t.md && av ? "<b>available</b>" : i == t.md && !t.done ? `<span class="mut">after round ${tqU(i)}</span>` : `<span class="mut">-</span>`}</td></tr>`;
  }).join("");
  return `<div class="card"><h3>Qualifying: ${t.y} ${t.name}</h3><p class="mut" style="margin:4px 0">Your group of four, home and away. The top two go to the tournament. Each qualifier stays open until the next one opens, then it is simulated for you. ${t.done ? "" : `Strength: you ${eloOf(N.n).e}.`}</p>
${t.done ? `<p style="margin:4px 0">${t.q ? `<span class="g">Qualified</span>` : `<span class="bad">Not qualified</span>`}: finished ${t.pos}${["st", "nd", "rd", "th"][Math.min(3, t.pos - 1)]}.</p>` : av ? `<div class="row" style="flex-wrap:wrap"><button data-a="nm" data-k="tq"><b>Play qualifier ${t.md + 1} (live)</b></button><button data-a="nm" data-k="tqs">Simulate</button></div>` : nxm ? `<p class="mut" style="margin:4px 0">Next qualifier opens after round ${tqU(t.md)} of the club season.</p>` : ""}
<div class="row" style="flex-wrap:wrap;align-items:flex-start;margin-top:6px"><div style="min-width:240px;margin:0 12px 8px 0"><table><tr><th class="l">Group</th><th>P</th><th>GD</th><th>Pts</th></tr>${rk.map((n) => {
    const r = t.st[n];
    return `<tr><td class="l">${n == N.n ? "<b>" + n + "</b>" : n}</td><td>${r.P}</td><td>${r.GF - r.GA > 0 ? "+" : ""}${r.GF - r.GA}</td><td><b>${r.Pts}</b></td></tr>`;
  }).join("")}</table></div><div style="min-width:240px"><table>${fx}</table></div></div></div>`;
}
