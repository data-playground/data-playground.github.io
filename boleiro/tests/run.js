// Runs the headless test cases against index.html. `npm test` (quick set) or `npm run test:long` (adds multi-season runs).
const { spawnSync } = require("child_process"), fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "cases"), index = path.join(__dirname, "..", "index.html");
const long = process.argv.includes("--long");
const cases = fs.readdirSync(dir).filter(f => f.endsWith(".js") && (long || !f.startsWith("long_"))).sort();
let failed = 0;
for (const c of cases) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ["--max-old-space-size=6000", path.join(__dirname, "harness.js"), index, path.join(dir, c)], { encoding: "utf8", timeout: 20 * 60 * 1000 });
  const out = (r.stdout || "") + (r.stderr || "");
  const bad = r.status !== 0 || /TEST ERROR|ReferenceError|TypeError|SyntaxError/.test(out);
  if (bad) { failed++; console.log("FAIL", c); console.log(out.split("\n").slice(-12).join("\n")); }
  else console.log("ok  ", c, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
console.log(failed ? failed + " failed" : "all " + cases.length + " passed");
process.exit(failed ? 1 : 0);
