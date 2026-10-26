// Main render function and click/input handling
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function render() {
  const A = $("#app");
  document.body.classList.toggle("in", !!G);
  if (!G) {
    const lim = limOf(MLV), Lg = lgList(WS), nsel = WSEL.filter((k) => Lg.some((x) => x.key == k)), wl = worldList(nsel);
    const nSv = SLOTS.filter((k) => svMeta(k)).length, au = svMeta("auto"), tab = HOME || (au ? "load" : "new"), stp = nsel.length ? NSTEP : 1, nclub = Lg.filter((x) => nsel.includes(x.key)).reduce((a, x) => a + x.l.clubs.length, 0), LV = [["Novice", 30], ["Experienced", 50], ["Established", 70], ["Legend (any club)", 95]], lvn = (LV.find((x) => x[1] == MLV) || LV[0])[0];
    const tabs2 = `<div class="seg" role="tablist"><button data-hm="new" class="${tab == "new" ? "on" : ""}">New game</button><button data-hm="load" class="${tab == "load" ? "on" : ""}">Load game${nSv ? ` (${nSv})` : ""}</button></div>`;
    const cont = au ? `<div class="card" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span><b>Continue where you left off</b><br><span class="mut">${au.l} · ${new Date(au.t).toLocaleString()}</span></span><button class="p" data-sv="load" data-s="auto">Continue</button></div>` : "";
    const stepper = `<div class="steps"><span class="sp ${stp == 1 ? "on" : ""}"><i>1</i>Leagues</span><span class="ln2"></span><span class="sp ${stp == 2 ? "on" : ""}"><i>2</i>Club</span></div>`;
    const s1 = `<div class="card"><div class="ch"><b>Leagues followed: ${nsel.length}/${MAXL}</b><span class="mut">${WS.name || "Custom world"} · ${WS.nations.length} nations · ${Lg.length} leagues</span></div>${WMSG ? `<p class="bad" style="margin:0 0 8px">${WMSG}</p>` : ""}<p class="mut" style="margin:0 0 6px;font-size:12.5px">Every followed league is fully simulated, and your transfer market starts limited to your own league. Include a nation's lower divisions to get promotion and relegation.</p>${WS.nations.map((nt) => `<div class="nrow"><b>${nt.name}</b><div class="chips">${[...nt.leagues].sort((a, b) => a.tier - b.tier).map((l) => {
      const k = nt.id + ":" + l.tier;
      return `<button data-lg="${k}" class="${nsel.includes(k) ? "p" : ""}">${l.name} (${l.clubs.length})</button>`;
    }).join("")}</div></div>`).join("")}</div>
<div class="card"><div class="ch"><b>Manager level</b></div><div class="row">${LV.map(([n, v]) => `<button data-ml="${v}" class="${MLV == v ? "p" : ""}">${n}</button>`).join("")}</div><p class="mut" style="margin:0;font-size:12.5px">Your reputation decides which clubs will hire you. Success raises it, and failure can get you sacked.</p></div>
<details class="card" ${XW || WMSG ? "open" : ""}><summary>Custom world (advanced)</summary><div style="margin-top:10px"><div class="row"><label>Load a world file (.json or .json.gz) <input type="file" id="wf" accept=".json,.gz"></label></div><div class="row"><button data-w="tpl">Show world data template</button><button data-w="load">Load pasted world</button><button data-w="fw">Use default world</button><button data-w="def">Use small test world</button></div><textarea id="wj" rows="3" style="width:100%;box-sizing:border-box" placeholder="Paste a world JSON here (see the template for the format)">${XW}</textarea></div></details>
<div class="foot"><span class="mut">${nsel.length ? `${nsel.length} league${nsel.length > 1 ? "s" : ""} · ${nclub} clubs` : "Pick at least one league"}</span><button class="p" data-ns="2" ${nsel.length ? "" : "disabled"}>Next: choose your club</button></div>`;
    const s2 = `<div class="row" style="justify-content:space-between"><button data-ns="1">← Back to leagues</button><span class="mut">Manager level: <b>${lvn}</b> · you can manage clubs up to reputation ${Math.round(lim)}</span></div>${nsel.map((k) => {
      const x = Lg.find((y) => y.key == k), all2 = wl.map((w, id) => ({ w, id })).filter((o) => o.w.key == k), vis = SHLK ? all2 : all2.filter((o) => o.w.c.rep <= lim), nl = all2.filter((o) => o.w.c.rep > lim).length;
      return `<div class="card"><div class="ch"><b>${x.nt.name}: ${x.l.name}</b><span class="mut">${all2.length - nl} available${nl ? ` · ${nl} locked` : ""}</span></div>${vis.length ? `<div class="clubs">${vis.map(({ w, id }) => `<button data-me="${id}" ${w.c.rep > lim ? "disabled" : ""}><b>${w.c.n}</b><small>reputation ${w.c.rep}${w.c.rep > lim ? " · locked" : ""}</small></button>`).join("")}</div>` : `<p class="mut" style="margin:0">No clubs here at your manager level. Go back to raise it, or show locked clubs.</p>`}</div>`;
    }).join("")}<div class="row"><button data-lk="1">${SHLK ? "Hide locked clubs" : "Show locked clubs"}</button></div>`;
    A.innerHTML = `<div class="st">${tabs2}${tab == "new" ? `${cont}${stepper}${stp == 1 ? s1 : s2}` : savesHTML()}</div>`;
    const wf = $("#wf");
    if (wf) wf.onchange = (e) => {
      if (e.target.files[0]) loadWorldFile(e.target.files[0]);
    };
    A.onclick = (e) => {
      const sv = e.target.closest("[data-sv]");
      if (sv) {
        svAct(sv.dataset.sv, sv.dataset.s);
        return;
      }
      const lk = e.target.closest("[data-lk]");
      if (lk) {
        SHLK = !SHLK;
        render();
        return;
      }
      const hm = e.target.closest("[data-hm]");
      if (hm) {
        HOME = hm.dataset.hm;
        render();
        return;
      }
      const ns = e.target.closest("[data-ns]");
      if (ns && !ns.disabled) {
        NSTEP = +ns.dataset.ns;
        render();
        window.scrollTo(0, 0);
        return;
      }
      const g = e.target.closest("[data-lg]");
      if (g) {
        const k = g.dataset.lg, i = WSEL.indexOf(k);
        WMSG = "";
        if (i >= 0) WSEL.splice(i, 1);
        else if (WSEL.length < MAXL) WSEL.push(k);
        else WMSG = `You can follow at most ${MAXL} leagues.`;
        render();
        return;
      }
      const w = e.target.closest("[data-w]");
      if (w) {
        wAct(w.dataset.w);
        return;
      }
      const l = e.target.closest("[data-ml]");
      if (l) {
        MLV = +l.dataset.ml;
        render();
        return;
      }
      const b = e.target.closest("[data-me]");
      if (b && !b.disabled) startGame(nsel, +b.dataset.me);
    };
    return;
  }
  if (G.jl && !["career", "table", "results", "save", "peek"].includes(view)) view = "career";
  const me = G.t[G.me], tb = table(), H = busy && G.hold, pos = H ? H.pos : tb.indexOf(me) + 1, rd = H ? H.round : G.round, done = rd >= HL().rounds, all = rd >= G.nr;
  const SUB = `${me.name} · ${HL().name} · Season ${G.season} · Round ${Math.min(rd, HL().rounds)}/${HL().rounds}${G.round < G.nr ? " · " + fd(dRd(G.round)) : ""} · ${pos}º · ${H ? H.P : me.P} pts · Board: ${bcl(G.bc)}`;
  $("#sub").textContent = SUB;
  const tabs = (G.jl ? ["career", "table", "results", "cal", "cup", "nat", "save"] : ["squad", "youth", "market", "club", "infra", "career", "table", "results", "cal", "cup", "nat", "review", "save"]).map((v) => `<button data-v="${v}" class="${view == v || view == "match" && v == "results" || view == "peek" && v == "career" ? "on" : ""}">${{ squad: "Squad & tactics", youth: "Youth academy", market: "Transfers", club: "Club & finances", infra: "Infrastructure", career: "Manager career", table: "Table", results: "Results", cal: "Calendar", cup: "Cup", nat: "National teams", review: "Development", save: "Save / Load" }[v]}</button>`).join("");
  const nm = !done ? nextMine() : null;
  const ctl = `<div class="row"><button class="p pp" data-a="live" ${busy || done || !valid(me) ? "disabled" : ""}>Play next match</button><button data-a="round" ${busy || all || !valid(me) ? "disabled" : ""}>Sim round</button><button data-a="season" ${busy || all || !valid(me) ? "disabled" : ""}>Sim season</button>${all ? `<button class="p" data-a="next" ${busy ? "disabled" : ""}>Next season</button>` : ""}<label>Speed <select id="sp">${[["s", "Slow"], ["n", "Normal"], ["f", "Fast"]].map(([k, l]) => `<option value="${k}" ${(G.speed || "n") == k ? "selected" : ""}>${l}</option>`).join("")}</select></label><button data-a="new" ${busy ? "disabled" : ""}>New game</button></div>`;
  let body = "";
  if (view == "squad") {
    const L = me.xi, sq = me.pl.map((p, i) => ({ p, i })).sort((a, b) => ["GK", "DF", "MF", "FW"].indexOf(a.p.pos) - ["GK", "DF", "MF", "FW"].indexOf(b.p.pos) || b.p.o - a.p.o), avC = Math.round(me.xi.reduce((a, i) => a + me.pl[i].cd, 0) / Math.max(me.xi.length, 1)), tir = nm && G.ld != null && !H && nm.d - G.ld <= 4;
    const fxc = `<div class="card fx"><b>Next fixture</b>${nm ? `<div class="big">${CC(nm.h == G.me ? nm.a : nm.h).name} <span class="mut" style="font-weight:400">· ${nm.h == G.me ? "home" : "away"}${nm.kind == "cup" ? " · " + nm.lab : ""}</span></div><div class="mono mut" style="font-size:12.5px;margin-top:2px">${fd(nm.d)}${G.ld != null && !H ? ` · ${nm.d - G.ld} days since your last match` : ""}</div>${tir ? `<span class="s">Tired legs: consider rotating.</span>` : ""}` : `<div class="mut" style="margin-top:6px">No more matches this season.</div>`}</div>`;
    body = `<div class="sq2"><div class="card pc"><div class="ch"><b>Starting XI</b><span class="mono mut">${me.f} · ${{ balanced: "Balanced", attack: "Attack", counter: "Counter" }[me.style] || me.style}</span></div>${valid(me) ? "" : `<p class="bad" style="margin:0 0 8px">Your lineup needs a goalkeeper in goal and a player in every slot.</p>`}${pitchHTML(me)}</div>
<div class="tc"><!--BD--><div class="card"><b>Tactics</b><div class="tg"><span>Formation</span><select id="fm">${Object.keys(FM).map((f) => `<option ${f == me.f ? "selected" : ""}>${f}</option>`).join("")}</select><span>Style</span><select id="st">${["balanced", "attack", "counter"].map((s) => `<option value="${s}" ${s == me.style ? "selected" : ""}>${{ balanced: "Balanced", attack: "All-out attack", counter: "Counter-attack" }[s]}</option>`).join("")}</select><span>XI condition</span><span class="mono">${avC}%</span><span>Squad mood</span><span>${mood(me.pl.reduce((a, p) => a + p.mo, 0) / me.pl.length)}</span></div><div class="row" style="margin:10px 0 0"><button data-a="auto">Auto-pick XI</button>${me.cs ? `<button data-a="rshape">Reset positions</button>` : ""}</div><p class="mut" style="margin:10px 0 0;font-size:12.5px">Attack: more chances for both sides and a looser defence. Counter-attack: fewer but sharper chances, and it punishes attacking teams. Older players tire faster, and attacking play tires everyone more.</p></div>${fxc}${assist(me)}</div></div>
<div class="card"><div class="ch"><b>Squad</b><span class="mut">Drag a player onto a slot, or click both. Hold a slot and drop it elsewhere to move it.</span></div><table class="sqt"><tr><th class="l">Player</th><th class="l hm">Role</th><th>Age</th><th>Ovr</th>${SEL >= 0 ? "<th>At slot</th>" : ""}<th>Form</th><th class="hm">G</th><th class="hm">A</th><th class="l">Status</th><th class="l">Cond</th><th class="l hm">Mood</th></tr>${sq.map(({ p, i }) => `<tr class="pl ${L.includes(i) ? "xi" : ""}" data-p="${i}" draggable="true"><td>${L.includes(i) ? '<b class="xd">●</b> ' : ""}${p.n}<div class="sub">${p.sp}${secTxt(p)} · ${p.ap} apps${p.y || p.r ? ` · ${p.y}Y ${p.r}R` : ""}</div></td><td class="l mut hm">${ROLE[p.role].s}</td><td>${p.a}</td><td><b>${p.o}</b></td>${SEL >= 0 ? fitCell(me, p) : ""}<td title="${p.lr ? "Last match " + p.lr.toFixed(1) : ""}">${p.ap ? p.fm.toFixed(1) : "–"}</td><td class="hm">${p.g}</td><td class="hm">${p.as || 0}</td><td class="l st ${p.inj || p.sus ? "bad" : "mut"}">${p.nd ? "Intl" : p.inj ? "Inj " + p.inj : p.sus ? "Susp " + p.sus : "Fit"}</td><td class="l ${p.cd < 70 ? "bad" : ""}"><span class="cb"><i style="width:${Math.round(p.cd)}%;background:${p.cd < 70 ? "var(--bad)" : p.cd < 85 ? "var(--warn)" : "var(--accent)"}"></i></span>${Math.round(p.cd)}</td><td class="l hm ${p.mo < 35 ? "bad" : p.mo >= 70 ? "g" : ""}">${mood(p.mo)}</td></tr>`).join("")}</table></div>`;
  }
  if (view == "inbox") body = inboxHTML(me);
  if (view == "market") body = marketHTML2(me);
  if (view == "club") body = clubHTML(me);
  if (view == "infra") body = infraHTML(me);
  if (view == "career") body = careerHTML(me);
  if (view == "save") body = savesHTML();
  if (view == "press") body = pressHTML(me);
  if (view == "talk") body = pcHTML(me);
  if (view == "staff") body = staffHTML(me);
  if (view == "peek") body = peekHTML();
  if (view == "table") {
    const vl = G.vl == null ? me.lg : G.vl, Lg = G.lg[vl], tb2 = table(vl), kk = prK(Lg), hasUp = G.lg.some((x) => x.nid == Lg.nid && x.tier == Lg.tier - 1), hasDn = G.lg.some((x) => x.nid == Lg.nid && x.tier == Lg.tier + 1);
    body = `<div class="card"><div class="row"><select id="vl">${G.lg.map((x) => `<option value="${x.id}" ${x.id == vl ? "selected" : ""}>${x.cn}: ${x.name}</option>`).join("")}</select></div><table class="fit"><tr><th class="l">Club</th><th>P</th><th class="hm">W</th><th class="hm">D</th><th class="hm">L</th><th>GD</th><th>Pts</th></tr>${tb2.map((t, i) => `<tr class="${t == me ? "me" : ""}" data-pk="${t.id}"><td class="l" style="box-shadow:inset 3px 0 ${i < kk && hasUp ? "var(--ac)" : i >= Lg.n - kk && hasDn ? "var(--red)" : "transparent"}">${i + 1}. ${t.name}</td><td>${t.W + t.D + t.L}</td><td class="hm">${t.W}</td><td class="hm">${t.D}</td><td class="hm">${t.L}</td><td>${t.GF - t.GA}</td><td><b>${t.P}</b></td></tr>`).join("")}</table>${hasUp || hasDn ? `<p class="mut">Green: promotion places. Red: relegation places.</p>` : ""}<p class="mut">Click a club to see its squad.</p></div>`;
  }
  if (view == "results") {
    const r = G.res[G.res.length - 1], vl = G.vl == null ? me.lg : G.vl;
    body = r ? `<div class="card"><div class="row"><select id="vl">${G.lg.map((x) => `<option value="${x.id}" ${x.id == vl ? "selected" : ""}>${x.cn}: ${x.name}</option>`).join("")}</select></div><h3>Round ${G.res.length} · ${fd(dRd(G.res.length - 1))}</h3>${r.filter((x) => G.t[x.h].lg == vl).map((x) => `<div class="orow${x.h == G.me || x.a == G.me ? " me" : ""}"><span>${G.t[x.h].name}</span><b>${x.g[0]}-${x.g[1]}</b><span>${G.t[x.a].name}</span></div>`).join("")}</div>` : `<div class="card mut">No matches played yet.</div>`;
  }
  if (view == "match" && !busy && !G.lc && !(G.res[G.res.length - 1] || []).some((x) => x.h == G.me || x.a == G.me)) view = "results";
  if (view == "cal") body = calHTML(me);
  if (view == "cup") body = cupHTML(me);
  if (view == "nat") body = ntHTML(me);
  if (view == "youth") body = acHTML(me);
  if (view == "match") {
    const R = G.res[G.res.length - 1], x = busy ? G.live : G.lc ? G.lc.x : R.find((x2) => x2.h == G.me || x2.a == G.me), oth = busy ? G.live.oth : G.lc ? G.lc.oth : R.filter((y) => y !== x && G.t[y.h].lg == me.lg);
    const um = busy && (G.live.nm || G.live.h == G.me || G.live.a == G.me), lf = um ? `<div class="card" id="lform" style="order:2"></div>` : !busy && x.rt ? `<div class="card" style="order:2">${rtHTML(x.rt)}</div>` : "";
    body = `<div class="mtg"><div class="col"><div class="card mt" style="order:1">${(busy ? G.live.cn : G.lc && x.cn) ? `<div class="mut" style="text-align:center">${busy ? G.live.cn : x.cn}</div>` : ""}<div class="score" id="mscore">${CC(x.h).name} ${busy ? "0 - 0" : x.g[0] + " - " + x.g[1]} ${CC(x.a).name}</div>${!busy && x.ko ? `<div style="text-align:center">${koTxt(x)}</div>` : ""}${busy ? `<div class="row" style="justify-content:center"><button data-a="pause" id="pb">${PZ ? "Resume" : "Pause"}</button></div><div id="adv" class="advb"></div><div id="pz"></div>` : ""}</div>${!busy && x.rv ? rvHTML(x) : ""}<div class="card" style="order:3"><div class="ch"><b>Match events</b></div><div id="mlog">${busy ? "" : x.log.map((e) => `<div class="${e.k || ""}"><span class="mut">${e.m}'</span> ${ic(e)}${e.t}</div>`).join("")}</div></div></div><div class="col r">${lf}<div class="card" style="order:4"><div class="ch"><b>Other matches</b></div>${oth.map((y, k) => `<div class="orow"><span>${nmOf(y.h)}</span><b id="om${k}">${busy ? "0-0" : y.g[0] + "-" + y.g[1]}</b><span>${nmOf(y.a)}</span></div>`).join("") || '<span class="mut">None.</span>'}</div></div></div>`;
  }
  if (view == "review" && !G.review) {
    const yg = me.pl.filter((p) => p.a <= 23).sort((a, b) => b.pot - a.pot);
    body = `<div class="card"><h3>Development</h3><p class="mut" style="margin:4px 0">The full report (who improved, who declined, retirements, academy intake) is written when the season ends. Until then, here are your young players and how much game time they are getting.</p>${yg.length ? `<table class="fit"><tr><th class="l">Player</th><th>Age</th><th>Ovr</th><th>Pot</th><th>Mins</th></tr>${yg.map((p) => `<tr><td>${pn(p)}<div class="sub">${p.pos}</div></td><td>${p.a}</td><td>${p.o}</td><td>${p.pot}</td><td>${p.mn || 0}</td></tr>`).join("")}</table>` : `<p class="mut">No players aged 23 or under in the first team.</p>`}</div>`;
  }
  if (view == "review" && G.review) {
    const R = G.review, rows = [...R.ch].sort((a, b) => b.p.o - b.old - (a.p.o - a.old)), note = (x) => [x.x.pt < -0.6 ? "little playing time" : "", x.x.fb > 0.6 ? "strong form" : x.x.fb < -0.6 ? "poor form" : "", x.x.g > 2 ? "natural growth" : x.x.g < -1 ? "ageing" : ""].filter(Boolean).join(", ");
    body = `<div class="card"><h3>Season ${G.season - 1} development</h3><table class="fit"><tr><th class="l">Player</th><th>Age</th><th>Ovr</th><th>+/-</th></tr>${rows.map((x) => {
      const d = x.p.o - x.old;
      return `<tr><td>${pn(x.p)}<div class="sub">${x.p.pos}${note(x) ? " · " + note(x) : ""}</div></td><td>${x.p.a}</td><td>${x.old}→${x.p.o}</td><td class="${d < 0 ? "bad" : d > 0 ? "g" : ""}">${d > 0 ? "+" : ""}${d}</td></tr>`;
    }).join("")}</table></div><div class="card"><b>Retired:</b> ${R.ret.map((p) => `${p.n} (${p.pos}, ${p.a})`).join(", ") || "nobody"}<br><b>Contracts expired (left as free agents):</b> ${R.exp.map((p) => `${p.n} (${p.pos}, ${p.o})`).join(", ") || "none"}<br><b>Promoted from the academy:</b> ${R.yth.map((p) => `${p.n} (${p.pos}, ${p.a}, ovr ${p.o})`).join(", ") || "none"}<br><b>Academy intake:</b> ${R.ac.in.map((p) => `${p.n} (${p.pos}, ${p.a}, ovr ${p.o}, pot ${acRange(p)[0]}-${acRange(p)[1]})`).join(", ") || "none"}<br><b>Left the academy:</b> ${R.ac.left.map((p) => `${p.n} (${p.pos}, ${p.a}, ovr ${p.o})`).join(", ") || "nobody"}<br><b>Promoted:</b> ${G.pr.up.map((id) => G.t[id].name).join(", ") || "none"}<br><b>Relegated:</b> ${G.pr.rel.map((id) => G.t[id].name).join(", ") || "none"}<br><span class="mut">Your starting XI was reset to the best eleven for your formation.</span></div>`;
  }
  const bd = `<div class="card"><b>Board objective:</b> finish in the top ${G.goal}. ${done ? pos <= G.goal ? `<span class="g">Met</span> – finished ${pos}º.` : `<span class="bad">Missed</span> – finished ${pos}º.` : `Currently ${pos}º.`}${done ? ` Champions: <b>${tb[0].name}</b>.${me.pl.some((p) => p.cy <= 1) ? ` <span class="bad">${me.pl.filter((p) => p.cy <= 1).length} contract(s) expire now: renew them in Club & finances before starting the next season.</span>` : ""}` : nm ? ` ${H ? "Now playing:" : "Next:"} ${nm.kind == "cup" ? `<b>${nm.lab}</b>, ` : ""}${fd(nm.d)}, ${nm.h == G.me ? "home" : "away"} vs <b>${CC(nm.h == G.me ? nm.a : nm.h).name}</b>.${G.ld != null && !H ? ` <span class="${nm.d - G.ld <= 4 ? "bad" : "mut"}">${nm.d - G.ld} days since your last match${nm.d - G.ld <= 4 ? " - tired legs, consider rotating" : ""}.</span>` : ""}` : ""}</div>`;
  A.innerHTML = shellHTML(me, done, SUB, view == "squad" ? "" : bd, G.jl ? "" : ctl, body.replace("<!--BD-->", bd));
  A.onclick = (e) => {
    const sv = e.target.closest("[data-sv]");
    if (sv && !busy) {
      svAct(sv.dataset.sv, sv.dataset.s);
      return;
    }
    const pt = e.target.closest && e.target.closest(".pitch");
    if (pt && !e.target.closest("[data-ps],[data-sl]")) {
      const r = pt.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
      if (busy) {
        if (PS.k > 0 && G.mt && G.mt.gk == null) {
          G.mt.move(G.mt.hs, PS.k, px, py);
          PS.k = null;
          showPz();
        }
      } else if (SEL > 0) moveSlot(SEL, px, py);
      return;
    }
    const b = e.target.closest("button,tr.pl,[data-ps],[data-pb],[data-sl],tr[data-pk]");
    if (!b) return;
    const d = b.dataset;
    if (busy) {
      if (d.a == "pause") {
        if (PZ && G.mt && G.mt.gk != null) {
          PMSG = "Choose a goalkeeper first.";
          showPz();
          return;
        }
        PZ = !PZ;
        showPz();
      } else if (d.a == "tt") {
        ttDo(d.v);
        showPz();
      } else if (d.a == "advap") {
        G.cfg = G.cfg || {};
        G.cfg.ap = !G.cfg.ap;
        advUp(G.mt);
      } else if (d.a == "advx") {
        const x = ADV[+d.i];
        if (x) {
          ADS[x.key] = 1;
          advUp(G.mt);
        }
      } else if (d.a == "advact") advAct(+d.i);
      else if (d.a == "gkok") {
        const M = G.mt;
        if (!M || M.gk == null) return;
        const gn = $("#gkn"), n = gn ? +gn.value : -1, o = +$("#gko").value;
        M.gkFix(M.gk, n >= 0 ? n : null, o, M.min);
        M.gk = null;
        flush();
        showPz();
      } else if (d.ps !== void 0) psClick("s", +d.ps);
      else if (d.pb !== void 0) psClick("b", +d.pb);
      return;
    }
    if (d.v) {
      view = d.v;
      G.msg = "";
      MORE = false;
      FLT = false;
      render();
    } else if (d.a == "nm") {
      nmAct(d.k, d.i);
      if (!busy) render();
    } else if (d.a == "npx") {
      npx(+d.i);
    } else if (d.a == "flt") {
      FLT = !FLT;
      render();
    } else if (d.a == "stp") {
      STS = d.r;
      STMSG = "";
      render();
    } else if (d.a == "stx") {
      STS = null;
      render();
    } else if (d.a == "sth") {
      stHire(+d.i);
      render();
    } else if (d.a == "str") {
      stRenew(d.r);
      render();
    } else if (d.a == "std") {
      stFire(d.r);
      render();
    } else if (d.a == "pq") {
      pcAns(+d.i, +d.o);
      render();
    } else if (d.a == "pw") {
      pcTalk(+d.p, d.o == null ? null : +d.o);
      render();
    } else if (d.a == "pwx") {
      pcI().cur = null;
      render();
    } else if (d.a == "pa") {
      pmAns(+d.q, +d.o);
      render();
    } else if (d.a == "pskip") {
      pmSkip();
      render();
    } else if (d.a == "sbc") {
      SBC = !SBC;
      try {
        localStorage.setItem("bf_sb", SBC ? "1" : "0");
      } catch (x) {
      }
      render();
    } else if (d.a == "more") {
      MORE = !MORE;
      render();
    } else if (d.a == "live") doRound(true);
    else if (d.a == "round") doRound(false);
    else if (d.a == "season") {
      simSeason();
      view = "table";
      render();
    } else if (d.a == "nof") nOffer(false);
    else if (d.a == "nacc") nOffer(true);
    else if (d.a == "nwalk") nWalk("You walked away from the talks.", false);
    else if (d.a == "bid") startBuy(+d.i, false);
    else if (d.a == "bidloan") startBuy(+d.i, true);
    else if (d.a == "nspon") startSpon(d.k, +d.i);
    else if (d.a == "seek") seekAll();
    else if (d.a == "oacc") ofAccept(+d.i);
    else if (d.a == "ocnt") ofCounter(+d.i);
    else if (d.a == "orej") ofReject(+d.i);
    else if (d.a == "lst") listP(+d.i, d.t);
    else if (d.a == "job") takeJob(+d.i);
    else if (d.a == "apply") applyJob(+d.i);
    else if (d.a == "fup") facUp(d.k);
    else if (d.a == "fren") facRen(d.k);
    else if (d.a == "prices") setPrices();
    else if (d.a == "expand") expandSt();
    else if (d.a == "newst") newSt();
    else if (d.a == "accept") accept(d.k, +d.i);
    else if (d.a == "renew") renew(+d.i);
    else if (d.a == "buy") buyP(+d.i, false);
    else if (d.a == "loan") buyP(+d.i, true);
    else if (d.a == "sell") sellP(+d.i);
    else if (d.a == "loanout") loanOut(+d.i);
    else if (d.a == "rel") relP(+d.i);
    else if (d.a == "yup") promoteY(+d.i);
    else if (d.a == "ydn") sendDown(+d.i);
    else if (d.a == "yrel") relY(+d.i);
    else if (d.a == "ysell") sellY(+d.i);
    else if (d.a == "yloan") loanY(+d.i);
    else if (d.a == "ylst") listY(+d.i, d.t);
    else if (d.a == "recall") recallLoan(+d.i);
    else if (d.a == "next") {
      rollover();
    } else if (d.a == "new") {
      G = null;
      NSTEP = 1;
      HOME = "new";
      render();
    } else if (d.a == "auto") {
      auto(me);
      render();
    } else if (d.a == "rshape") {
      me.cs = null;
      auto(me);
      render();
    } else if (d.a == "peek" || d.pk !== void 0) {
      PK = +(d.i !== void 0 ? d.i : d.pk);
      PKB = view == "peek" ? PKB : view;
      view = "peek";
      render();
    } else if (d.a == "unpeek") {
      view = PKB || "career";
      render();
    } else if (d.a == "wait") waitRound();
    else if (d.a == "waits") waitSeason();
    else if (d.sl !== void 0) {
      SEL = SEL == +d.sl ? -1 : +d.sl;
      render();
    } else if (d.p !== void 0) {
      placeP(+d.p);
    }
  };
  const tp = $("#tp0");
  if (tp) ["#tp0", "#tp1", "#tp2"].forEach((s) => $(s).oninput = () => {
    $("#tpv").textContent = prevTxt(me, ["#tp0", "#tp1", "#tp2"].map((x) => Math.max(1, +$(x).value || 1)));
  });
  const mp = $("#mkp");
  if (mp) {
    mp.onchange = () => {
      MFt.pos = mp.value;
      render();
    };
    $("#mks").onchange = (e) => {
      MFt.st = e.target.value;
      render();
    };
    $("#mko").onchange = (e) => {
      MFt.so = e.target.value;
      render();
    };
    $("#mkmin").onchange = (e) => {
      MFt.min = +e.target.value || 0;
      render();
    };
    $("#mka").onchange = (e) => {
      MFt.aff = e.target.checked;
      render();
    };
    $("#mky").onchange = (e) => {
      MFt.yg = e.target.checked;
      render();
    };
  }
  const nf = $("#nmf");
  if (nf) nf.onchange = () => {
    G.nm.f = nf.value;
    render();
  };
  const ns2 = $("#nms");
  if (ns2) ns2.onchange = () => {
    G.nm.sty = ns2.value;
    render();
  };
  const nn = $("#nmn");
  if (nn) nn.onchange = () => {
    G.nmp = nn.value;
  };
  const nv = $("#ntv");
  if (nv) nv.onchange = (e) => {
    G.nv = e.target.value;
    render();
  };
  const tv = $("#tnv");
  if (tv) tv.onchange = (e) => {
    G.tv = e.target.value;
    render();
  };
  const cv = $("#cpv");
  if (cv) cv.onchange = (e) => {
    G.cv = e.target.value;
    render();
  };
  const vs = $("#vl");
  if (vs) vs.onchange = (e) => {
    G.vl = +e.target.value;
    render();
  };
  const al = $("#apl");
  if (al) al.onchange = (e) => {
    APL = +e.target.value;
    render();
  };
  const ao = $("#apo");
  if (ao) ao.onchange = (e) => {
    APO = e.target.checked;
    render();
  };
  const ms = $("#msc");
  if (ms) ms.onchange = (e) => {
    G.cfg.ms = e.target.value;
    render();
  };
  const sp = $("#sp");
  if (sp) sp.onchange = () => {
    G.speed = sp.value;
  };
  const sp2 = $("#sp2");
  if (sp2) sp2.onchange = () => {
    G.speed = sp2.value;
  };
  const fm = $("#fm");
  if (fm) {
    fm.onchange = () => {
      me.f = fm.value;
      me.cs = null;
      auto(me);
      render();
    };
    $("#st").onchange = (e) => {
      me.style = e.target.value;
      render();
    };
  }
}
