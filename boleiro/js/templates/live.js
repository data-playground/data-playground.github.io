// HTML templates: live match
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function pitchLive(M) {
  const s = M.hs, t = M.T[s], S = slOf(t);
  return `<div class="pitch"><div class="ln" style="left:0;right:0;top:50%"></div><div class="ln" style="left:35%;top:86%;width:30%;height:14%"></div><div class="ln" style="left:35%;top:0;width:30%;height:14%"></div><div class="ln" style="left:38%;top:42%;width:24%;height:16%;border-radius:50%"></div>${S.map(([pos, x, y], k) => {
    const i = t.xi[k], p = t.pl[i];
    if (!p) return "";
    if (M.off[t.name + i]) return `<div class="slot gh" style="left:${x}%;top:${y}%"><span class="sp">${pos}</span><br>${p.n.split(" ").pop()}<br><span class="sp">out</span></div>`;
    const pn = pen(p, pos);
    return `<div class="slot ${clsPen(pn)} ${PS.k === k ? "sel" : ""}" draggable="true" data-ps="${k}" style="left:${x}%;top:${y}%"><span class="sp">${pos}</span><br>${p.n.split(" ").pop()}<br><b>${Math.round(p.o - pn)}</b> <span class="sp">${M.cnd(s, i)}%</span></div>`;
  }).join("")}</div>`;
}
function gkHTML(M) {
  const s = M.gk, t = M.T[s], bg = M.bn(s).filter((j) => t.pl[j].pos == "GK"), can = M.ns[s] < 5 && bg.length > 0, on = t.xi.map((i, k) => ({ i, k })).filter((x) => x.k > 0 && !M.off[t.name + x.i]);
  return `<div class="card"><b class="bad">${t.pl[t.xi[0]].n} is out and your team has no goalkeeper. The match is stopped until you pick one.</b>${can ? `<div class="row"><label>Goalkeeper <select id="gkn">${bg.map((j) => `<option value="${j}">${t.pl[j].n} (${t.pl[j].o})</option>`).join("")}<option value="-1">Put a field player in goal instead</option></select></label></div>` : `<p class="mut">${bg.length ? "You have no substitutions left." : "There is no goalkeeper on your bench."} A field player has to go in goal.</p>`}<div class="row"><label>${can ? "Field player to take off (or to go in goal)" : "Field player to go in goal"} <select id="gko">${on.map((x) => `<option value="${x.i}">${t.pl[x.i].sp} ${t.pl[x.i].n} (${t.pl[x.i].o})</option>`).join("")}</select></label><button class="p" data-a="gkok">Confirm</button></div></div>`;
}
function pzHTML() {
  const M = G.mt;
  if (!M) return "";
  if (M.gk != null) return gkHTML(M);
  const s = M.hs, t = M.T[s], bn = M.bn(s).sort((a, b) => t.pl[a].pos.localeCompare(t.pl[b].pos) || t.pl[b].o - t.pl[a].o), msg = PMSG;
  PMSG = "";
  return `<div class="card">${ttHTML(M)}<div class="row"><label>Formation <select id="pfm">${Object.keys(FM).map((f) => `<option ${f == t.f ? "selected" : ""}>${f}</option>`).join("")}</select></label><label>Style <select id="pst">${Object.keys(STN).map((k) => `<option value="${k}" ${k == t.style ? "selected" : ""}>${STN[k]}</option>`).join("")}</select></label><span class="mut">Shape now: <b>${shapeTxt(t, M)}</b></span></div>${pitchLive(M)}<div><b>Bench</b> <span class="mut">(${M.ns[s]}/5 substitutions used)</span><div>${bn.map((i) => `<div class="chip ${PS.b === i ? "sel" : ""}" draggable="true" data-pb="${i}">${t.pl[i].sp} ${t.pl[i].n} (${t.pl[i].o}, cond ${M.cnd(s, i)}%)</div>`).join("") || `<span class="mut">No one left on the bench.</span>`}</div></div><p class="mut" style="margin:8px 0 0" id="pmsg">${msg || "Drag a player onto another to swap them, onto an empty spot to move him there, or drag a bench player onto a slot to substitute him. Clicking works too. The number on a slot is that player's rating in that position, and the border colour shows how well he fits."}</p></div>`;
}
function ttHTML(M) {
  if (M.req != "tt" && M.req != "ht") return "";
  const c = ttCtx(M), d = M.ttd[M.req], best = Object.keys(TT).sort((a, b) => ttBase(c, b) - ttBase(c, a))[sf(G.t[G.me], "asst") < -0.3 ? 1 : 0], mood = c.mo < 45 ? " Morale is low." : c.mo > 75 ? " Morale is high." : "", ctx = c.ht ? `${c.gd < 0 ? "You are losing" : c.gd == 0 ? "It is level" : "You are ahead"} at the break.` : `${c.fav ? "You are the favourites" : c.dog ? "You are the underdogs" : "It looks an even match"}.`;
  return `<div class="ttb"><div class="ch"><b>${c.ht ? "Half-time team talk" : "Pre-match team talk"}</b><span class="mut">${c.ht ? "Change anything you like, then resume." : "Set your shape, then resume."}</span></div>${d ? `<p>You said: <i>"${TT[d.k][1]}"</i></p><p><b>${d.rc}</b></p>` : `<div class="row">${Object.keys(TT).map((k) => `<button class="sm" data-a="tt" data-v="${k}">${TT[k][0]}</button>`).join("")}</div><p class="mut">Assistant: ${ctx}${mood} I would ${TT[best][2]}. You can also skip the talk.</p>`}</div>`;
}
