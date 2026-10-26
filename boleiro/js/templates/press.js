// HTML templates: press
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function pressHTML(me) {
  const pm = pmI(), p = pm.pend, wait = p && !p.done, last = pm.log[0];
  const kp = `<div class="kpis"><div class="kp"><small>Media image</small><b class="tx ${pm.im >= 60 ? "g" : pm.im < 40 ? "bad" : ""}">${pmLab(pm.im)}</b><span>${Math.round(pm.im)} / 100</span></div><div class="kp"><small>Conferences</small><b>${pm.n}</b><span>answered so far</span></div><div class="kp"><small>Waiting</small><b class="tx ${wait ? "g" : ""}">${wait ? "Press conference" : "Nothing"}</b><span>${wait ? p.sc : "after your next match"}</span></div><div class="kp"><small>Last headline</small><b class="tx" style="font-size:14px;line-height:1.3">${last ? last.h : "–"}</b><span>${last ? last.s + " · " + last.sc : ""}</span></div></div>`;
  let c;
  if (!p) c = `<div class="card"><div class="ch"><b>Press conference</b></div><p class="mut" style="margin:0">No press conference yet. Journalists will be waiting for you after your next match. What you say changes how the squad, the board and the press see you.</p></div>`;
  else {
    let nx = 0;
    while (nx < p.qs.length && p.a[nx] != null) nx++;
    const shown = p.skip ? 0 : Math.min(nx + 1, p.qs.length);
    c = `<div class="card"><div class="ch"><b>Press conference</b><span class="mut">after ${p.sc}</span></div><div class="chat">${p.skip ? `<div class="rx" style="align-self:flex-start">You skipped this press conference.</div>` : p.qs.slice(0, shown).map((q, i) => `<div class="bub"><small>Journalist</small>${q.txt}</div>${p.a[i] != null ? `<div class="bub me"><small>You</small>${q.as[p.a[i]].say}</div><div class="rx">${p.rc[i]}</div>` : `<div class="opts">${q.as.map((a, j) => `<button data-a="pa" data-q="${i}" data-o="${j}">${a.l}</button>`).join("")}</div>`}`).join("")}${wait ? `<div class="opts"><button class="sm" data-a="pskip">Skip the press conference</button></div>` : ""}</div>${wait ? "" : `<p class="mut" style="margin:10px 0 0;font-size:12.5px">${p.skip ? "Journalists noted your absence." : "That is all the journalists wanted."} A new press conference follows your next match.</p>`}</div>`;
  }
  return kp + c + `<div class="card"><div class="ch"><b>Headlines</b><span class="mut">what the papers wrote about you</span></div>${pm.log.length ? pm.log.map((x) => `<div class="hl"><b>“${x.h}”</b><small>${x.s} · ${x.sc}</small></div>`).join("") : '<span class="mut">No headlines yet.</span>'}<p class="mut" style="margin:10px 0 0;font-size:12.5px">A warm press makes the board a little more patient each round. A hostile one wears it down. Your media image drifts back to neutral over time.</p></div>`;
}
