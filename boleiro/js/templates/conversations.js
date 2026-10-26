// HTML templates: conversations
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function pcHTML(me) {
  const pc = pcI(), R = G.round, op = pc.open, wait = op.filter((o) => o.a == null).length, avg = me.pl.reduce((a, p) => a + p.mo, 0) / Math.max(1, me.pl.length), lab = moLab(avg), unh = me.pl.filter((p) => p.mo < 40).length, prs = me.pl.filter((p) => p.pr);
  const kp = `<div class="kpis"><div class="kp"><small>Squad mood</small><b class="tx ${lab[1] == "g" ? "g" : lab[1] == "b" ? "bad" : ""}">${lab[0]}</b><span>average ${Math.round(avg)} / 100</span></div><div class="kp"><small>Asking for a word</small><b>${wait}</b><span>${wait ? "waiting for you" : "nobody right now"}</span></div><div class="kp"><small>Unhappy players</small><b class="${unh ? "bad" : ""}">${unh}</b><span>morale under 40</span></div><div class="kp"><small>Promises</small><b>${prs.length}</b><span>you must keep</span></div></div>`;
  const mb = (p) => {
    const m = moLab(p.mo);
    return `<small>${p.pos} · ${(ROLE[p.role || "depth"] || ROLE.depth).s}</small><span class="pt">${p.n}</span><span class="mood ${m[1]}">${m[0].toUpperCase()}</span>`;
  };
  const req = op.map((o) => {
    const p = me.pl.find((x) => x.id == o.pid);
    if (!p) return "";
    const q = PCQ[o.k];
    return `<div class="pcc"><div class="chat"><div class="bub">${mb(p)}<br>${q.say}</div>${o.a != null ? `<div class="bub me"><small>You</small>${q.o[o.a][1]}</div><div class="rx">${o.rc}</div>` : `<div class="opts">${q.o.map((x, j) => `<button data-a="pq" data-i="${o.id}" data-o="${j}">${x[0]}</button>`).join("")}</div>`}</div></div>`;
  }).join("");
  const c1 = `<div class="card"><div class="ch"><b>Players asking for a word</b><span class="mut">ignore them for too long and they take it badly</span></div>${req || '<span class="mut">Nobody needs you right now. Players come to you when they are unhappy, short of minutes, or worried about their contract.</span>'}</div>`;
  const cur = pc.cur && me.pl.find((x) => x.id == pc.cur.pid), cc = cur ? `<div class="card"><div class="ch"><b>Talking to ${cur.n}</b><button class="sm" data-a="pwx">Close</button></div><div class="chat"><div class="bub">${mb(cur)}<br>You wanted to see me, boss?</div>${pc.cur.a != null ? `<div class="bub me"><small>You</small>${PCW[pc.cur.a][1]}</div><div class="rx">${pc.cur.rc}</div>` : `<div class="opts">${PCW.map((x, j) => `<button data-a="pw" data-p="${cur.id}" data-o="${j}">${x[0]}</button>`).join("")}</div>`}</div></div>` : "";
  const rows = [...me.pl].sort((a, b) => a.mo - b.mo).map((p) => {
    const m = moLab(p.mo), cd = pc.cd[p.id] > R - 5;
    return `<tr><td class="l"><b>${p.n}</b><div class="sub">${p.pos} · ${(ROLE[p.role || "depth"] || ROLE.depth).s}${p.pr ? " · promise" : ""}</div></td><td class="${m[1] == "g" ? "g" : m[1] == "b" ? "bad" : ""}">${m[0]}</td><td class="ac"><button class="sm" data-a="pw" data-p="${p.id}" ${cd ? "disabled" : ""}>${cd ? "Recent" : "Talk"}</button></td></tr>`;
  }).join("");
  const c2 = `${cc}<div class="card"><div class="ch"><b>Have a word</b><span class="mut">one chat per player every 5 rounds</span></div><table class="fit"><tr><th class="l">Player</th><th>Mood</th><th></th></tr>${rows}</table></div>`;
  const c3 = `<div class="card"><div class="ch"><b>Promises and history</b></div>${prs.map((p) => `<div class="hl"><b>${p.n}</b><small>${p.pr.k == "start" ? `You promised to play him: ${p.pr.n} more game${p.pr.n > 1 ? "s" : ""} of 45+ minutes` : `You promised a new contract by round ${p.pr.by}`}</small></div>`).join("")}${pc.log.map((x) => `<div class="hl ${x.s > 0 ? "g" : x.s < 0 ? "bad" : ""}">${x.t}<small>${x.r}</small></div>`).join("") || (prs.length ? "" : '<span class="mut">Nothing yet.</span>')}<p class="mut" style="margin:10px 0 0;font-size:12.5px">Promises are tracked: keep them and the player is delighted, break them and he is furious. Morale feeds into how well the squad plays.</p></div>`;
  return kp + c1 + c2 + c3;
}
