// Global game state (G) and UI flags
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

let G = null, view = "squad", busy = false, PZ = false, LP = 0;
let MLV = 30, XP = "", SVM = "", NS = false, PID = 0, SEL = -1;
let MK = [], MFt = { pos: "ALL", aff: true, yg: false };
const SPD = { s: 700, n: 350, f: 120 };
