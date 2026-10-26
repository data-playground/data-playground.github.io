// HTML templates: youth academy
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function loanRows() {
  const me = G.t[G.me];
  return G.t.flatMap((s) => s.pl.filter((p) => p.ln == me.id).map((p) => ({ p, s })));
}
function loanCard(loans) {
  if (!loans.length) return "";
  return `<div class="card"><div class="ch"><b>Out on loan</b><span class="mut">${loans.length}</span></div><table class="fit"><tr><th class="l">Player</th><th>Ovr</th><th>Apps</th><th>Min</th><th class="hm">G</th><th class="hm">A</th><th class="hm">Form</th><th></th></tr>${loans.map(({ p, s }) => {
    const b = p.l0 || { ap: 0, mn: 0, g: 0, as: 0 }, ap = (p.ap || 0) - b.ap, mn = (p.mn || 0) - b.mn;
    return `<tr><td>${pn(p)}${p.yl ? ` <span class="mut">(academy)</span>` : ""}<div class="sub">${p.pos} · age ${p.a} · ${s.name}</div></td><td><b>${p.o}</b></td><td>${ap}</td><td class="${mn < 90 && G.round >= 6 ? "bad" : ""}">${mn}</td><td class="hm">${(p.g || 0) - b.g}</td><td class="hm">${(p.as || 0) - b.as}</td><td class="hm">${ap ? p.fm.toFixed(1) : "–"}</td><td class="ac"><button class="sm" data-a="recall" data-i="${p.id}">Recall</button></td></tr>`;
  }).join("")}</table><p class="mut" style="margin:8px 0 0;font-size:12.5px">Stats count from the day he left. Recalling is free and takes effect immediately. Loans end after the season either way; academy players return to the academy.</p></div>`;
}
function acHTML(me) {
  ensureAcad();
  const ac = me.ac.slice().map((p, i) => ({ p, i })).sort((a, b) => b.p.a - a.p.a || b.p.o - a.p.o), stars = (p) => {
    const v = p.pot + (p.pe || 0) * Math.max(0, (23 - p.a) / 8);
    return v >= 82 ? "★★★★★" : v >= 75 ? "★★★★" : v >= 67 ? "★★★" : v >= 58 ? "★★" : "★";
  }, open = winOpen();
  const rows = ac.map(({ p, i }) => {
    const r = acRange(p), st = p.a >= AL ? `<span class="bad">last season</span>` : p.a >= 20 ? `<span class="mut">slowing</span>` : p.a <= 17 ? `<span class="mut">growing fast</span>` : "", ls = p.ls == "S" ? "For sale" : p.ls == "L" ? "For loan" : "", bids = G.ob.filter((o) => o.pid == p.id).length || "";
    return `<tr><td>${pn(p)}<div class="sub">${p.sp} · age ${p.a}${st ? " · " + st : ""}${ls ? " · " + ls : ""}</div></td><td><b>${p.o}</b></td><td>${r[0]}-${r[1]} <span class="mut">${stars(p)}</span></td><td class="hm">${fm1(val(p))}</td><td class="hm">${bids}</td><td class="ac"><div class="acb"><button class="sm" data-a="yup" data-i="${i}" ${me.pl.length >= 28 ? "disabled" : ""}>Promote</button><button class="sm" data-a="ysell" data-i="${i}" ${open ? "" : "disabled"}>Sell</button><button class="sm" data-a="yloan" data-i="${i}" ${open ? "" : "disabled"}>Loan out</button><button class="sm" data-a="ylst" data-t="S" data-i="${i}">${p.ls == "S" ? "Unlist" : "For sale"}</button><button class="sm" data-a="ylst" data-t="L" data-i="${i}">${p.ls == "L" ? "Unlist" : "For loan"}</button><button class="sm" data-a="yrel" data-i="${i}">Release</button></div></td></tr>`;
  }).join("");
  const dn = me.pl.map((p, i) => ({ p, i })).filter((x) => x.p.a <= AL).sort((a, b) => a.p.o - b.p.o);
  const drows = dn.map(({ p, i }) => `<tr><td>${pn(p)}<div class="sub">${p.pos} · ${ROLE[p.role || "depth"].s} · age ${p.a}</div></td><td><b>${p.o}</b></td><td class="ac"><button class="sm" data-a="ydn" data-i="${i}">Send to academy</button></td></tr>`).join("");
  return `<div class="kpis"><div class="kp"><small>Academy level</small><b>${ef(me, "yt").toFixed(1)}</b><span>see Infrastructure</span></div><div class="kp"><small>Academy players</small><b>${ac.length}</b><span>no limit on places</span></div><div class="kp"><small>Senior squad</small><b>${me.pl.length}/28</b><span>players</span></div><div class="kp"><small>Last season</small><b class="${ac.some((x) => x.p.a >= AL) ? "bad" : ""}">${ac.filter((x) => x.p.a >= AL).length}</b><span>promote, sell or loan</span></div></div><div class="card"><div class="ch"><b>Academy players</b><span class="mut">ages up to ${AL}</span></div><p class="mut" style="margin:0 0 10px;font-size:12.5px">Academy level ${ef(me, "yt").toFixed(1)} (see Infrastructure), which sets the quality of the 3 to 7 youngsters who arrive each year. There is no limit on places. Academy players sit outside the senior squad: <b>${me.pl.length}/28</b> senior players. They cost no wages. They grow faster than idle youngsters in the first team, but from 20 they grow less than they would playing in the senior squad, and anyone older than ${AL} leaves at the end of the season unless you promote him. You can promote, sell or loan them directly. Loans go to another club's first team and end after the season, when he returns here. Ranges show what scouts think of each player's ceiling.</p>
<table class="fit yt"><tr><th class="l">Player</th><th>Ovr</th><th>Potential</th><th class="hm">Value</th><th class="hm">Bids</th><th></th></tr>${rows || `<tr><td class="l mut" colspan="6">The academy is empty.</td></tr>`}</table></div>
${loanCard(loanRows())}
<div class="card"><h3>Senior players who can drop down</h3><table class="fit"><tr><th class="l">Player</th><th>Ovr</th><th></th></tr>${drows || `<tr><td class="l mut" colspan="3">Nobody aged ${AL} or under in the senior squad.</td></tr>`}</table></div>`;
}
