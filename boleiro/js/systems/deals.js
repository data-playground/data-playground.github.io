// Players as part of a transfer deal (part-exchange, loan)
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function xCred(p, s, ln) {
  const need = cnt(s, p.pos) <= MNH[p.pos] + 1 || p.o > nd(s, p.pos) ? 1 : 0.8;
  return +Math.max(0.02, val(p) * 0.85 * (ln ? 0.3 : 1) * need * (p.cy <= 1 ? 0.85 : 1) * (p.a >= 31 ? 0.85 : 1)).toFixed(2);
}
function xList() {
  const me = G.t[G.me], N = G.neg;
  return (N && N.px || []).map((id) => me.pl.find((q) => q.id == id)).filter((q) => q && q.ln == null);
}
function xC(q, N, s) {
  return xCred(q, s, N.pm && N.pm[q.id]);
}
function xCr(N) {
  const s = G.t[N.tid];
  return N.k == "fee" && s ? xList().reduce((a, q) => a + xC(q, N, s), 0) : 0;
}
function npx(id) {
  const N = G.neg;
  if (!N || N.k != "fee") return;
  const iv = $("#nv");
  if (iv && iv.value !== "" && !isNaN(+iv.value)) N.lo = +iv.value;
  N.px = N.px || [];
  N.pm = N.pm || {};
  const i = N.px.indexOf(id);
  if (i >= 0) {
    if (!N.pm[id]) N.pm[id] = 1;
    else {
      N.px.splice(i, 1);
      delete N.pm[id];
    }
  } else if (N.px.length < 4) N.px.push(id);
  G.msg = "";
  render();
}
