// Tiny helpers ($, pick, rn, clamp)
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const $ = (s) => document.querySelector(s), pick = (a) => a[Math.random() * a.length | 0], rn = (a, b) => a + Math.random() * (b - a), cl = (x, a, b) => Math.max(a, Math.min(b, x));
