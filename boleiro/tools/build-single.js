// Bundles the project into ONE self-contained HTML file: dist/boleiro.html
// (handy for sharing by e-mail or hosting anywhere). Run: npm run build
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">\s*/g, (m, f) => "");
const css = [...fs.readFileSync(path.join(root, "index.html"), "utf8").matchAll(/<link rel="stylesheet" href="(css\/[^"]+)">/g)]
  .map(m => fs.readFileSync(path.join(root, m[1]), "utf8")).join("\n");
const srcs = [...html.matchAll(/<script src="(js\/[^"]+)"><\/script>\s*/g)].map(m => m[1]);
const js = srcs.map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n");
html = html.replace(/<script src="js\/[^"]+"><\/script>\s*/g, "");
html = html.replace("</head>", "<style>\n" + css + "\n</style></head>");
html = html.replace("</body>", "<script>\n" + js.replace(/<\/script>/gi, "<\\/script>") + "\n</script></body>");
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist", "boleiro.html"), html);
console.log("dist/boleiro.html", (html.length / 1024).toFixed(0) + " KB");
