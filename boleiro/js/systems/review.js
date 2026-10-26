// Post-game review
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function rvGen(x) {
  if (!x || G.jl || !x.st) return;
  const me = G.t[G.me], h = x.h == G.me, i = h ? 0 : 1, o = CC(h ? x.a : x.h), gf = x.g[i], ga = x.g[1 - i], res = x.w != null ? x.w == G.me ? "W" : "L" : gf > ga ? "W" : gf < ga ? "L" : "D", sh = [x.st.sh[i], x.st.sh[1 - i]], ot = [x.st.ot[i], x.st.ot[1 - i]], pos = h ? x.st.pp : 100 - x.st.pp, dom = sh[0] - sh[1] + (ot[0] - ot[1]) * 1.5, B = [];
  let v, sub;
  if (res == "W") {
    if (dom >= 3) {
      v = "A deserved win";
      sub = "We were the better side and the result shows it.";
    } else if (dom <= -3) {
      v = "A lucky win";
      sub = "They had more of the chances, so do not get carried away.";
    } else {
      v = "A tight win";
      sub = "It could have gone either way, but we got the job done.";
    }
  } else if (res == "L") {
    if (dom <= -3) {
      v = "A deserved defeat";
      sub = "They were better than us on the day.";
    } else if (dom >= 3) {
      v = "An unlucky defeat";
      sub = "We created more than they did and still lost.";
    } else {
      v = "A narrow defeat";
      sub = "Fine margins decided this one.";
    }
  } else {
    if (dom >= 3) {
      v = "Two points dropped";
      sub = "We did enough to win but did not take our chances.";
    } else if (dom <= -3) {
      v = "A point we will take";
      sub = "They were the better side. We held on.";
    } else {
      v = "A fair draw";
      sub = "Neither side did enough to win.";
    }
  }
  if (x.pen) sub += " It went to penalties.";
  else if (x.et) sub += " It went to extra time.";
  const lg = x.log || [];
  let pv = [0, 0];
  const gl = lg.filter((e) => e.k == "g").map((e) => {
    const sd = e.s[0] > pv[0] ? 0 : 1;
    pv = e.s;
    return { m: e.m, mine: sd == i };
  });
  const lateC = gl.filter((g) => !g.mine && g.m >= 75), subs = lg.filter((e) => e.k == "s" && e.t.includes("(" + me.name + ")")).length;
  if (lateC.length) B.push({ k: "w", t: `We conceded ${lateC.length > 1 ? lateC.length + " goals" : "a goal"} after the 75th minute (${lateC.map((g) => g.m + "'").join(", ")}). ${subs < 3 ? "Fresher legs from the bench could help." : "Check the fitness of the players we kept on."}` });
  const lateW = gl.filter((g) => g.mine && g.m >= 85);
  if (res == "W" && gf - ga == 1 && lateW.length) B.push({ k: "g", t: `A late goal (${lateW[lateW.length - 1].m}') won us the game.` });
  if (gl[0] && !gl[0].mine && gl[0].m <= 15) B.push({ k: "w", t: `We conceded early (${gl[0].m}') and had to chase the game.` });
  if (ga == 0) B.push({ k: "g", t: "A clean sheet. The defence was solid." });
  if (gf == 0 && ot[0] >= 4) B.push({ k: "w", t: `We had ${ot[0]} shots on target and did not score. We need more finishing.` });
  if (pos <= 42 && res == "W") B.push({ k: "i", t: `We had only ${pos}% of the ball but made it count by sitting deep.` });
  if (pos >= 60 && res == "L") B.push({ k: "w", t: `We had ${pos}% of the ball but did little with it.` });
  const pl = me.pl.filter((p) => p.lm >= 30 && p.lr != null).sort((a, b) => b.lr - a.lr);
  if (pl[0]) B.push({ k: "g", t: `${pl[0].n} (${pl[0].pos}) was our best player, rating ${pl[0].lr.toFixed(1)}.` });
  const wp = pl[pl.length - 1];
  if (wp && pl.length > 1 && wp.lr <= 5.4) B.push({ k: "w", t: `${wp.n} (${wp.pos}) struggled, rating ${wp.lr.toFixed(1)}.` });
  me.pl.filter((p) => p.lm > 0 && p.sus > 0).forEach((p) => B.push({ k: "w", t: `${p.n} is suspended for the next ${p.sus} match${p.sus > 1 ? "es" : ""}.` }));
  const yel = lg.filter((e) => /^Yellow card/.test(e.t) && e.t.includes("(" + me.name + ")")).length;
  if (yel >= 3) B.push({ k: "i", t: `${yel} yellow cards. Watch the discipline.` });
  me.pl.filter((p) => p.lm > 0 && p.inj > 0).forEach((p) => B.push({ k: "w", t: `${p.n} is injured and will be out for about ${p.inj} round${p.inj > 1 ? "s" : ""}.` }));
  const tr = me.pl.filter((p) => p.lm >= 45 && !p.inj && p.cd < 60).sort((a, b) => a.cd - b.cd).slice(0, 3);
  if (tr.length) B.push({ k: "w", t: `Tired legs: ${tr.map((p) => `${p.n} (${Math.round(p.cd)}%)`).join(", ")} finished the match low on condition. Consider resting them.` });
  x.rv = { v, sub, sh, ot, pos, o: o.name, B: B.slice(0, sf(me, "asst") < -0.3 ? 3 : sf(me, "asst") < 0.3 ? 5 : 8) };
}
