// Board and season goals
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function genGoals() {
  const me = G.t[G.me], ep = epOf(me), n = Math.round(ep * 5), L = HL();
  G.mgl = [];
  G.mp = [];
  L.fix.forEach((rd, i) => {
    if (i >= G.round) rd.forEach(([h, a]) => {
      if (h == G.me && a == me.rv || a == G.me && h == me.rv) G.mgl.push({ kind: "derby", rd: i, text: `Beat ${G.t[me.rv].name} (round ${i + 1})` });
    });
  });
  [0, 8, 16, 24, 32].forEach((s) => {
    if (s >= G.round && s + 4 < L.rounds) G.mgl.push({ kind: "run", from: s, to: s + 4, need: n, text: `Take at least ${n} points from rounds ${s + 1}-${s + 5}` });
  });
}
function glog(x) {
  G.gn.unshift(`Season ${G.season}: ${x}`);
  G.gn.length = Math.min(G.gn.length, 15);
}
