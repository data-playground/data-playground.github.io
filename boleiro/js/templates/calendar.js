// HTML templates: calendar page
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const resCls = (x, me) => x.w != null ? x.w == me ? "g" : "bad" : x.g[x.h == me ? 0 : 1] > x.g[x.h == me ? 1 : 0] ? "g" : x.g[x.h == me ? 0 : 1] < x.g[x.h == me ? 1 : 0] ? "bad" : "";
const resTxt = (x) => `${x.g[0] + (x.et ? x.et[0] : 0)}-${x.g[1] + (x.et ? x.et[1] : 0)}${x.pen ? ` (${x.pen[0]}-${x.pen[1]}p)` : x.et ? " aet" : ""}${x.agg ? ` agg ${x.agg[0]}-${x.agg[1]}` : ""}`;
function calHTML(me) {
  const c = cal(), L = HL(), R = [];
  for (let r = 0; r < L.rounds; r++) {
    const m = L.fix[r] && L.fix[r].find((x) => x.includes(me.id));
    if (!m) continue;
    const y = G.res[r] && G.res[r].find((q) => q.h == me.id || q.a == me.id);
    R.push({ d: c[r], c: "League", h: m[0], a: m[1], g: y ? y.g : null, pl: r < G.round });
  }
  Object.values(cups()).forEach((cp) => {
    if (cp.skip || !cp.ids.includes(me.id)) return;
    if (cp.kind == "cont") {
      const fk = cp.evs.findIndex((e) => e.ph != "G"), grp = cp.grp.find((g) => g.includes(me.id));
      cp.slots.forEach((d, k) => {
        const ev = cp.evs[k], nm = cp.name + " · " + evName(cp, k), t = (cp.res[k] || []).find((x) => x.h == me.id || x.a == me.id);
        if (t) {
          R.push({ d, c: nm, h: t.h, a: t.a, x: t, pl: true });
          return;
        }
        if (k == cp.k && !cp.done) {
          const f = cp.fx.find((x) => x.includes(me.id));
          if (f) R.push({ d, c: nm, h: f[0], a: f[1], pl: false });
          return;
        }
        if (k > cp.k) {
          if (ev.ph == "G") {
            const f = cp.gfx[ev.md].find((x) => x.includes(me.id));
            if (f) R.push({ d, c: nm, h: f[0], a: f[1], pl: false });
          } else if (cp.k < fk ? !!grp : cp.alive.includes(me.id)) R.push({ d, c: cp.name + " · " + evName(cp, k), fut: 1, pl: false });
        }
      });
      return;
    }
    cp.slots.forEach((d, k) => {
      const nm = cupRName(cp, k), t = (cp.res[k] || []).find((x) => x.h == me.id || x.a == me.id);
      if (t) R.push({ d, c: cp.name + " · " + nm, h: t.h, a: t.a, x: t, pl: true });
      else if (k == cp.k && !cp.done) {
        const f = cp.fx.find((x) => x.includes(me.id));
        if (f) R.push({ d, c: cp.name + " · " + nm, h: f[0], a: f[1], pl: false });
        else if (cp.bye.includes(me.id)) R.push({ d, c: cp.name + " · " + nm, bye: 1, pl: false });
      } else if (k > cp.k && (cp.alive.includes(me.id) || cp.bye.includes(me.id))) R.push({ d, c: cp.name + " · " + nm, fut: 1, pl: false });
    });
  });
  R.push({ d: dayOf(2026 + G.season - 1, 8, 15), c: "Transfer window", note: "Summer window closes" }, { d: janA(), c: "Transfer window", note: "Winter window opens" }, { d: janB(), c: "Transfer window", note: "Winter window closes" });
  R.sort((a, b) => a.d - b.d);
  let prev = null, nxt = true, tight = 0;
  const rows = R.map((r) => {
    if (r.note) return `<tr class="mut"><td>${fd(r.d)}</td><td colspan="4" class="l">${r.note}</td></tr>`;
    let rest = "";
    if (!r.bye) {
      if (prev != null) {
        const g = r.d - prev;
        rest = `<span class="${g <= 4 ? "bad" : "mut"}">${g} d</span>`;
        if (g <= 4 && !r.fut) tight++;
      }
      prev = r.d;
    }
    const hi = !r.pl && nxt && !r.bye;
    if (hi) nxt = false;
    const opp = r.bye ? "Bye" : r.fut ? "If you advance" : `${r.h == me.id ? "vs" : "at"} <b>${CC(r.h == me.id ? r.a : r.h).name}</b>`;
    let res = "";
    if (r.g) {
      const my = r.h == me.id ? r.g[0] : r.g[1], op = r.h == me.id ? r.g[1] : r.g[0];
      res = `<span class="${my > op ? "g" : my < op ? "bad" : ""}">${r.g[0]}-${r.g[1]}</span>`;
    } else if (r.x) {
      res = `<span class="${resCls(r.x, me.id)}">${resTxt(r.x)}</span>`;
    }
    return `<tr ${hi ? 'style="font-weight:600"' : ""}><td>${fd(r.d)}</td><td class="l">${r.c}</td><td class="l">${opp}</td><td>${res}</td><td>${rest}</td></tr>`;
  }).join("");
  return `<div class="card"><h3>Season ${G.season} calendar</h3><p class="mut" style="margin:4px 0">${fd(c[0])} to ${fd(c[c.length - 1])}. Rest = days since your previous match. Red means 4 days or fewer, so tired legs. Short turnarounds this season: ${tight}.</p><div class="scroll"><table><tr><th class="l">Date</th><th class="l">Competition</th><th class="l">Match</th><th>Result</th><th>Rest</th></tr>${rows}</table></div></div>`;
}
