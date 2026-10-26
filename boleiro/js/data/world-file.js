// Loading a world file
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

async function loadWorldFile(f) {
  try {
    WMSG = "Reading " + f.name + " ...";
    render();
    const u8 = new Uint8Array(await f.arrayBuffer());
    let text;
    if (u8[0] == 31 && u8[1] == 139) {
      const st = new Blob([u8]).stream().pipeThrough(new DecompressionStream("gzip"));
      text = await new Response(st).text();
    } else text = new TextDecoder().decode(u8);
    const w = JSON.parse(text), er = valWorld(w);
    if (er.length) WMSG = er.join(" ");
    else {
      WS = w;
      WSEL = defSel(w);
      XW = "";
      WMSG = "";
    }
  } catch (e) {
    WMSG = "Could not read that file: " + e.message;
  }
  render();
}
function calTV(l) {
  const ts = l.ids.map((i) => G.t[i]), aw = ts.reduce((a, t) => a + wbill(t), 0) / ts.length, ot = ts.reduce((a, t) => a + gate(t, t.exp).rev * l.rounds / 2 + spn(t), 0) / ts.length, need = (aw / 0.6 - ot) * l.n;
  if (need > l.tv) l.tv = Math.round(need * 10) / 10;
}
function wAct(a) {
  WMSG = "";
  if (a == "tpl") {
    XW = JSON.stringify(WORLD, null, 1);
    return render();
  }
  if (a == "def") {
    WS = WORLD;
    WSEL = ["cos:1", "cos:2"];
    XW = "";
    return render();
  }
  if (a == "fw" && FW) {
    WS = FW;
    WSEL = defSel(FW);
    XW = "";
    return render();
  }
  if (a == "load") {
    try {
      const w = JSON.parse(($("#wj") || {}).value || ""), er = valWorld(w);
      if (er.length) WMSG = er.join(" ");
      else {
        WS = w;
        WSEL = defSel(w);
        XW = "";
      }
    } catch (e) {
      WMSG = "That isn't valid JSON.";
    }
    render();
  }
}
