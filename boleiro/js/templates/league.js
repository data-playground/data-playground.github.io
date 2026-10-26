// HTML templates: league table and results
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const fr_ = (d) => {
  const c = d.r == null ? "" : d.r >= 7.5 ? "hi" : d.r <= 5.5 ? "lo" : "";
  return `<div class="fr${d.rd ? " out" : ""}"><span class="fp">${d.pos}</span><span class="fn">${d.n}${d.g ? `<span class="ev eg">GOAL${d.g > 1 ? " ×" + d.g : ""}</span>` : ""}${d.a ? `<span class="ev">ASSIST${d.a > 1 ? " ×" + d.a : ""}</span>` : ""}${d.y ? `<span class="ev ey">YELLOW</span>` : ""}${d.rd ? `<span class="ev er">RED</span>` : ""}${d.a0 > 0 ? `<span class="ev">ON ${d.a0}'</span>` : ""}${d.b != null && d.b < 90 && !d.rd ? `<span class="ev">OFF ${d.b}'</span>` : ""}</span><b class="rt ${c}">${d.r == null ? "–" : d.r.toFixed(1)}</b>${d.cd != null ? `<span class="fc">${d.cd}%</span>` : `<span></span>`}</div>`;
};
const rtHTML = (rt) => {
  const best = rt.filter((d) => d.r != null).sort((a, b) => b.r - a.r)[0];
  return `<div class="ch"><b>Player ratings</b><span class="mono mut">${best ? "Best: " + best.n.split(" ").pop() + " " + best.r.toFixed(1) : ""}</span></div>${rt.map((d) => fr_({ ...d, pos: d.sp })).join("")}`;
};
function lform(M) {
  const el = $("#lform");
  if (!el || M.hs == null || M.hs < 0 || !M.tm) return;
  const s = M.hs, t = M.T[s], S = slOf(t), rows = [];
  Object.entries(M.tm).forEach(([k, q]) => {
    if (q.s != s) return;
    const p = t.pl[q.i], k2 = t.xi.indexOf(q.i), onp = k2 >= 0, mm = (onp ? M.min : q.b) - q.a;
    rows.push({ pos: onp ? S[k2][0] : "–", n: p.n, r: mm >= 1 ? +M.rate(s, q.i).toFixed(1) : null, g: M.pg[k] || 0, a: M.ast[k] || 0, y: M.yc[k] || 0, rd: M.off[k] ? 1 : 0, a0: q.a, b: onp ? null : q.b, cd: onp ? M.cnd(s, q.i) : null, on: onp });
  });
  const on = rows.filter((r) => r.on), of = rows.filter((r) => !r.on);
  el.innerHTML = `<div class="ch"><b>Your XI</b><span class="mono mut">live rating · condition</span></div>${on.map(fr_).join("")}${of.length ? `<div class="mut" style="margin:8px 0 2px;font-size:12px">Substituted</div>${of.map(fr_).join("")}` : ""}`;
}
