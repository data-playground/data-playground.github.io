// Save slots, export/import of save files
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const SLOTS = ["auto", "1", "2", "3"];
function svMeta(k) {
  try {
    return JSON.parse(localStorage.getItem("bfo_m_" + k) || "null");
  } catch (e) {
    return null;
  }
}
function svSnap() {
  return JSON.stringify({ v: 1, G: Object.assign({}, G, { live: null, mt: null, hold: null, res: G.res.map((r, i) => i == G.res.length - 1 ? r : r.filter((x) => x.h == G.me || x.a == G.me).map((x) => ({ h: x.h, a: x.a, g: x.g }))) }) });
}
async function pack(s) {
  try {
    if (typeof CompressionStream !== "undefined") {
      const st = new Blob([s]).stream().pipeThrough(new CompressionStream("gzip")), b = new Uint8Array(await new Response(st).arrayBuffer());
      let bin = "";
      for (let i = 0; i < b.length; i += 8192) bin += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
      return "BFO1:" + btoa(bin);
    }
  } catch (e) {
  }
  return "BFO0:" + btoa(unescape(encodeURIComponent(s)));
}
async function unpack(t) {
  t = t.trim();
  if (t.startsWith("BFO1:")) {
    const bin = atob(t.slice(5)), b = Uint8Array.from(bin, (c) => c.charCodeAt(0)), st = new Blob([b]).stream().pipeThrough(new DecompressionStream("gzip"));
    return await new Response(st).text();
  }
  if (t.startsWith("BFO0:")) return decodeURIComponent(escape(atob(t.slice(5))));
  throw 0;
}
async function doSave(k) {
  if (!G) return;
  if (busy && k != "auto") {
    SVM = "Finish the match before saving.";
    return render();
  }
  try {
    const d = await pack(svSnap()), m = G.t[G.me];
    localStorage.setItem("bfo_d_" + k, d);
    localStorage.setItem("bfo_m_" + k, JSON.stringify({ t: Date.now(), l: `${m.name} · Season ${G.season} · Round ${G.round}/38 · ${mlab(G.mg.rep)} manager` }));
    if (k != "auto") SVM = `Saved to slot ${k}.`;
  } catch (e) {
    SVM = "Could not save: browser storage is full or unavailable. Delete another save, or download a save file to keep a copy.";
  }
  if (k != "auto" || SVM.startsWith("Could")) render();
}
function autoSave() {
  if (!NS && G) doSave("auto");
}
function load(s) {
  const o = JSON.parse(s);
  if (!o || o.v !== 1 || !o.G || !o.G.t) throw 0;
  G = o.G;
  mig();
  busy = false;
  PZ = false;
  LP = 0;
  G.hold = null;
  G.mt = null;
  G.live = null;
  MK = [];
  view = G.jl ? "career" : "squad";
  SVM = "Game loaded.";
  render();
}
async function doLoad(k) {
  try {
    const raw = localStorage.getItem("bfo_d_" + k);
    if (!raw) throw 0;
    load(await unpack(raw));
  } catch (e) {
    SVM = "That save could not be loaded.";
    render();
  }
}
function svFileName() {
  const m = G.t[G.me];
  return "boleiro-" + m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-season-" + G.season + ".boleiro";
}
async function svDownload() {
  if (!G || busy) return;
  try {
    const t = await pack(svSnap()), b = new Blob([t], { type: "text/plain" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u;
    a.download = svFileName();
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(u);
    }, 1e3);
    SVM = "Save file downloaded (" + svFileName() + "). Keep it safe and use Load from file to bring it back.";
  } catch (e) {
    SVM = "Could not create the file.";
  }
  render();
}
async function svFromFile(f) {
  if (!f) return;
  try {
    const t = await f.text();
    load(await unpack(t));
  } catch (e) {
    SVM = "That file is not a valid Boleiro save.";
    render();
  }
}
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t && t.id == "svf") {
    const f = t.files && t.files[0];
    t.value = "";
    svFromFile(f);
  }
});
async function svAct(a, k) {
  if (a == "dl") return svDownload();
  if (a == "file") {
    const i = $("#svf");
    if (i) i.click();
    return;
  }
  if (a == "save") return doSave(k);
  if (a == "load") return doLoad(k);
  if (a == "del") {
    try {
      localStorage.removeItem("bfo_d_" + k);
      localStorage.removeItem("bfo_m_" + k);
    } catch (e) {
    }
    SVM = `Deleted ${k == "auto" ? "the autosave" : "slot " + k}.`;
    return render();
  }
  if (a == "exp") {
    if (!G || busy) return;
    XP = await pack(svSnap());
    SVM = "Save code ready below. Copy it somewhere safe.";
    return render();
  }
  if (a == "copy") {
    const t = $("#svx");
    if (t) {
      t.select();
      try {
        navigator.clipboard.writeText(t.value);
        document.execCommand("copy");
      } catch (e) {
      }
    }
    return;
  }
  if (a == "imp") {
    try {
      load(await unpack(($("#svi") || {}).value || ""));
    } catch (e) {
      SVM = "That doesn't look like a valid save code.";
      render();
    }
  }
}
