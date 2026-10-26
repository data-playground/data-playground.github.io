// Real-date calendar, windows, rest days
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 864e5, dayOf = (y, m, d) => Math.round(Date.UTC(y, m, d) / DAY), fd = (x) => {
  const t = new Date(x * DAY);
  return DN[t.getUTCDay()] + " " + t.getUTCDate() + " " + MN[t.getUTCMonth()];
};
function buildCal() {
  const n = G.nr, y = 2026 + G.season - 1;
  let s = dayOf(y, 7, 1);
  while (new Date(s * DAY).getUTCDay() != 6) s++;
  const W = 40, out = [];
  let wk = [], mid = new Set();
  if (n <= W) {
    for (let i = 0; i < n; i++) wk.push(n > 1 ? Math.round(i * (W - 1) / (n - 1)) : 0);
  } else {
    for (let w = 0; w < W; w++) wk.push(w);
    const ord = [...Array(W - 2).keys()].map((i) => i + 1).sort((a, b) => Math.abs(a - 20) - Math.abs(b - 20));
    ord.slice(0, Math.min(n - W, ord.length)).forEach((w) => mid.add(w));
  }
  wk.forEach((w) => {
    out.push(s + 7 * w);
    if (mid.has(w)) out.push(s + 7 * w + 4);
  });
  while (out.length < n) out.push(out[out.length - 1] + 3);
  G.cal = out.slice(0, n);
  G.calS = G.season;
  G.cs = s;
}
function cal() {
  if (!G.cal || G.calS != G.season || G.cal.length != G.nr || G.cs == null) buildCal();
  return G.cal;
}
const dRd = (R) => {
  const c = cal();
  return c[Math.min(Math.max(R, 0), c.length - 1)];
};
const sepD = () => dayOf(2026 + G.season - 1, 8, 15), janA = () => dayOf(2026 + G.season, 0, 1), janB = () => dayOf(2026 + G.season, 0, 14);
const S1 = () => cal().filter((x) => x <= sepD()).length - 1;
const WM1 = () => {
  const i = cal().findIndex((x) => x >= janA());
  return i < 0 ? cal().length : i;
};
const restDays = () => {
  const c = cal(), R = G.round;
  return R > 0 ? nxtEvD(c[R - 1]) : 14;
};
const winSum = () => dRd(G.round) <= sepD();
function winOpen() {
  const R = G.round;
  if (R >= G.nr) return false;
  const d = dRd(R);
  return d <= sepD() || d >= janA() && d <= janB();
}
