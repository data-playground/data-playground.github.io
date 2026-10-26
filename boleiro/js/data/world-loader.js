// Decodes the embedded world file
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

let FW = null;
async function loadFW() {
  try {
    const bin = Uint8Array.from(atob(FWB), (c) => c.charCodeAt(0)), st = new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip")), w = JSON.parse(await new Response(st).text());
    if (valWorld(w).length) return;
    FW = w;
    if (!G && WS === WORLD && WSEL.join() == "cos:1,cos:2") {
      WS = w;
      WSEL = defSel(w);
      render();
    }
  } catch (e) {
  }
}
