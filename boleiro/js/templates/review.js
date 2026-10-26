// HTML templates: review
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function rvHTML(x) {
  const r = x.rv;
  if (!r) return "";
  const row = (l, a, b) => `<div class="orow w2"><span>${a}</span><b class="mut" style="font-weight:500">${l}</b><span>${b}</span></div>`;
  return `<div class="card" style="order:2"><div class="ch"><b>Assistant's review</b><span class="mut">what we learned</span></div><div class="chat"><div class="bub"><small>Assistant</small><b>${r.v}</b><br>${r.sub}</div></div><div style="margin:10px 0 4px">${row("", "<b>You</b>", `<b>${r.o}</b>`)}${row("Shots", r.sh[0], r.sh[1])}${row("On target", r.ot[0], r.ot[1])}${row("Possession", r.pos + "%", 100 - r.pos + "%")}</div>${r.B.map((b) => `<div class="adv"><span class="ev ${b.k == "g" ? "eg" : b.k == "w" ? "ey" : ""}">${b.k == "g" ? "GOOD" : b.k == "w" ? "WATCH" : "NOTE"}</span><span class="at">${b.t}</span></div>`).join("")}</div>`;
}
