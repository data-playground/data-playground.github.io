// HTML templates: squad table and pitch
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function fitCell(me, p) {
  const pn = pen(p, slOf(me)[SEL][0]);
  return `<td class="${pn <= 1 ? "g" : pn > 7 ? "bad" : ""}">${Math.round(p.o - pn)}${pn > 1 ? ` (-${Math.round(pn)})` : ""}</td>`;
}
function placeP(i) {
  const me = G.t[G.me];
  if (busy) return;
  const p = me.pl[i];
  if (!p) return;
  const cur = me.xi.indexOf(i);
  if (SEL < 0) {
    if (cur >= 0) SEL = cur;
    return render();
  }
  if (!av2(p)) {
    return note(`${p.n} is ${p.nd ? "on international duty" : p.inj ? "injured" : "suspended"} and can't play.`);
  }
  const old = me.xi[SEL];
  if (cur >= 0 && cur != SEL) me.xi[cur] = old;
  me.xi[SEL] = i;
  SEL = -1;
  render();
}
function pitchHTML(me) {
  const S = slOf(me);
  return `<div class="pitch"><div class="ln" style="left:0;right:0;top:50%"></div><div class="ln" style="left:35%;top:86%;width:30%;height:14%"></div><div class="ln" style="left:35%;top:0;width:30%;height:14%"></div><div class="ln" style="left:38%;top:42%;width:24%;height:16%;border-radius:50%"></div>${S.map(([pos, x, y], k) => {
    const p = me.pl[me.xi[k]];
    if (!p) return "";
    const pn = pen(p, pos);
    return `<div draggable="true" class="slot ${pn <= 1 ? "fg" : pn <= 7 ? "fa" : "fr"} ${SEL == k ? "sel" : ""}" data-sl="${k}" style="left:${x}%;top:${y}%"><span class="sp">${pos}</span><br>${p.n.split(" ").pop()}<br><b>${Math.round(p.o - pn)}</b>${p.sp != pos ? ` <span class="sp">(${p.sp})</span>` : ""}</div>`;
  }).join("")}</div>${SEL >= 0 ? `<p class="mut">Selected slot: ${S[SEL][0]}. Click a player in the list to put him there; the list shows his rating in that slot.</p>` : `<p class="mut">Green is a natural fit, amber is acceptable, red is poor. A number in brackets is the player's own position.</p>`}`;
}
