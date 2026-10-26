// HTML templates: cups pages
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const lgT = (r, a) => {
  const o = r.h == a ? [r.g[0], r.g[1]] : [r.g[1], r.g[0]], t = r.et ? r.h == a ? [r.et[0], r.et[1]] : [r.et[1], r.et[0]] : [0, 0];
  return `${o[0] + t[0]}-${o[1] + t[1]}${r.pen ? ` (${r.h == a ? r.pen[0] + "-" + r.pen[1] : r.pen[1] + "-" + r.pen[0]} p)` : r.et ? " aet" : ""}`;
};
const cupTie = (x) => `<div class="orow w2${x.h == G.me || x.a == G.me ? " me" : ""}"><span>${CC(x.h).name}</span><b>${lgT(x, x.h)}</b><span>${CC(x.a).name}</span></div>`;
const cupFix = ([h, a]) => `<div class="orow w2${h == G.me || a == G.me ? " me" : ""}"><span>${CC(h).name}</span><b class="mut">v</b><span>${CC(a).name}</span></div>`;
function cupKpis(cp, hist) {
  const id = G.me, cont = cp.kind == "cont", inC = cp.ids.includes(id);
  let st = "Not entered", sb = "";
  if (inC) {
    if (cp.done) {
      st = cp.w == id ? "Winners" : "Knocked out";
      sb = cp.w == id ? "you won it" : "";
    } else {
      let al;
      if (cont) {
        const fk = cp.evs.findIndex((e) => e.ph != "G"), grp = cp.grp.find((g) => g.includes(id));
        al = cp.k < fk ? !!grp : cp.alive.includes(id);
      } else al = cp.alive.includes(id) || cp.bye.includes(id);
      if (al) {
        st = "Still in";
        const f = cp.fx.find((x) => x.includes(id));
        sb = f ? `${f[0] == id ? "vs" : "at"} ${CC(f[0] == id ? f[1] : f[0]).name}` : !cont && cp.bye.includes(id) ? "bye this round" : "";
      } else {
        st = "Knocked out";
        if (!cont) {
          let lk = -1;
          (cp.res || []).forEach((r, k) => {
            if (r && r.some((x) => x.h == id || x.a == id)) lk = k;
          });
          if (lk >= 0) sb = "in the " + cupRName(cp, lk);
        }
      }
    }
  }
  const stage = cp.done ? "Finished" : cont ? evName(cp, cp.k) : cupRName(cp, cp.k), left = cp.done ? 1 : cont ? (cp.alive || cp.ids).length : cp.k == 0 ? cp.ids.length : cp.alive.length;
  return `<div class="kpis"><div class="kp"><small>Stage</small><b class="tx">${stage}</b><span>${cp.done ? "" : fd(cp.slots[cp.k])}</span></div><div class="kp"><small>Clubs left</small><b>${left}</b><span>of ${cp.ids.length} entered</span></div><div class="kp"><small>Your club</small><b class="tx ${st == "Winners" || st == "Still in" ? "g" : st == "Knocked out" ? "bad" : ""}">${st}</b><span>${sb}</span></div><div class="kp"><small>Last winner</small><b class="tx">${hist.length ? hist[0].w : "–"}</b><span>${hist.length ? "Season " + hist[0].s : "no history yet"}</span></div></div>`;
}
function contHTML(cp) {
  const me = G.me;
  let h = "";
  if (cp.grp.length) h += `<div class="ch" style="margin:4px 0 8px"><b>Groups</b><span class="mut">P = played, GD = goal difference. The top two go through.</span></div><div class="fgrid">${cp.grp.map((g, gi) => `<div class="card"><div class="ch"><b>Group ${"ABCDEFGH"[gi]}</b></div><table class="fit"><tr><th class="l">Club</th><th>P</th><th>GD</th><th>Pts</th></tr>${grpRank(cp, g).map((i, r) => {
    const t = cp.tab[i];
    return `<tr class="${i == me ? "me" : ""}"><td class="l" style="box-shadow:inset 3px 0 ${r < 2 ? "var(--accent)" : "transparent"}">${CC(i).name}</td><td>${t.P}</td><td>${t.GF - t.GA > 0 ? "+" : ""}${t.GF - t.GA}</td><td><b>${t.Pts}</b></td></tr>`;
  }).join("")}</table></div>`).join("")}</div>`;
  const tie = (t, ph) => {
    const fin = ph == "F", c = fin ? t.r2 ? lgT(t.r2, t.a) : "–" : `<i>${t.r1 ? lgT(t.r1, t.a) : "–"}</i><i>${t.r2 ? lgT(t.r2, t.a) : "–"}</i>`;
    return `<div class="orow w2${t.a == me || t.b == me ? " me" : ""}"><span class="${t.w === t.a ? "wn" : ""}">${CC(t.a).name}</span><b class="lg">${c}</b><span class="${t.w === t.b ? "wn" : ""}">${CC(t.b).name}</span></div>`;
  };
  (cp.hist || []).concat(cp.ties.length && !cp.done ? [{ ph: cp.evs[Math.min(cp.k, cp.evs.length - 1)].ph, ties: cp.ties, cur: 1 }] : []).forEach((x) => {
    h += `<div class="card"><div class="ch"><b>${PHN[x.ph]}</b>${x.cur ? '<span class="ev eg">NOW</span>' : ""}</div>${x.ph == "F" ? "" : '<div class="mut" style="font-size:12px;margin:-4px 0 6px">Two legs: first leg above, second below. Scores follow the order of the clubs listed.</div>'}${x.ties.map((t) => tie(t, x.ph)).join("")}</div>`;
  });
  if (!cp.done && cp.fx.length) h += `<div class="card"><div class="ch"><b>Next: ${evName(cp, cp.k)}</b><span class="mut">${fd(cp.slots[cp.k])}</span></div>${cp.fx.map(cupFix).join("")}</div>`;
  return h;
}
function cupHTML(me) {
  const all = Object.values(cups());
  if (!all.length) return `<div class="card">No cup this season.</div>`;
  const cur = G.cv && cups()[G.cv] ? G.cv : G.lg[me.lg].nid, cp = cups()[cur] || all[0];
  const hist = (G.ch || []).filter((x) => x.nid == cp.nid).slice(-8).reverse();
  const sel = `<select id="cpv">${all.map((x) => `<option value="${x.nid}" ${x.nid == cp.nid ? "selected" : ""}>${x.name}</option>`).join("")}</select>`;
  const past = hist.length ? `<p class="mut" style="margin:8px 0 0;font-size:12.5px">Past winners: ${hist.map((x) => `S${x.s} ${x.w}`).join(" · ")}</p>` : "";
  if (cp.skip) return `<div class="card"><div class="ch"><b>${cp.name}</b>${sel}</div><p class="mut" style="margin:0">The cup had already started when this save was made, so it starts next season.</p>${past}</div>`;
  const info = cp.kind == "cont" ? `${cp.ids.length} clubs. Clubs from leagues you follow qualify by league position; other places go to guest clubs.` : `Single match, extra time and penalties if level. Prize money grows each round.`;
  const head = `${cupKpis(cp, hist)}<div class="card"><div class="ch"><b>${cp.name}</b>${sel}</div><p class="mut" style="margin:0;font-size:12.5px">${cp.done ? `Winners: <b>${CC(cp.w).name}</b>. ` : ""}${info}</p>${past}</div>`;
  if (cp.kind == "cont") return head + contHTML(cp);
  const rounds = cp.slots.map((d, k) => {
    const nm = cupRName(cp, k), nx = k == cp.k && !cp.done;
    let inner = "";
    if (cp.res[k]) inner = cp.res[k].map(cupTie).join("");
    else if (nx) inner = cp.fx.map(cupFix).join("") + (cp.bye.length ? `<div class="mut" style="font-size:12.5px;margin-top:6px">Byes: ${cp.bye.map((i) => G.t[i].name).join(", ")}</div>` : "");
    else inner = `<div class="mut">To be drawn.</div>`;
    return `<div class="card"><div class="ch"><b>${nm}</b><span class="mut">${fd(d)} ${cp.res[k] ? '<span class="ev">PLAYED</span>' : nx ? '<span class="ev eg">NEXT</span>' : ""}</span></div>${inner}</div>`;
  }).join("");
  return head + rounds;
}
