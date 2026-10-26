// Drag and drop on the pitch
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

{
  const A0 = $("#app");
  A0.ondragstart = (e) => {
    const el = e.target.closest && e.target.closest("[data-ps],[data-pb],[data-sl],tr.pl[data-p]");
    if (!el) return;
    const d = el.dataset, v = d.ps !== void 0 ? "s" + d.ps : d.pb !== void 0 ? "b" + d.pb : d.sl !== void 0 ? "q" + d.sl : "p" + d.p;
    e.dataTransfer.setData("text/plain", v);
    e.dataTransfer.effectAllowed = "move";
  };
  A0.ondragover = (e) => {
    if (e.target.closest && e.target.closest("[data-ps],[data-sl],.pitch")) e.preventDefault();
  };
  A0.ondrop = (e) => {
    const el = e.target.closest && e.target.closest("[data-ps],[data-sl]"), pt = e.target.closest && e.target.closest(".pitch");
    if (!el && !pt) return;
    e.preventDefault();
    const v = e.dataTransfer.getData("text/plain"), kind = v[0], id = +v.slice(1);
    if (!el) {
      const r = pt.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
      if (busy) {
        if (kind == "s" && G.mt && G.mt.gk == null) {
          G.mt.move(G.mt.hs, id, px, py);
          PS = { k: null, b: null };
          showPz();
        }
      } else if (kind == "q") moveSlot(id, px, py);
      return;
    }
    if (busy) {
      if (!G.mt || G.mt.gk != null || el.dataset.ps === void 0) return;
      const k = +el.dataset.ps;
      if (kind == "s") doSwapPs(id, k);
      else if (kind == "b") doSubPs(id, k);
      PS = { k: null, b: null };
      showPz();
    } else if (el.dataset.sl !== void 0) {
      const me = G.t[G.me], k = +el.dataset.sl;
      if (kind == "q") {
        if (id != k) {
          const t = me.xi[id];
          me.xi[id] = me.xi[k];
          me.xi[k] = t;
        }
        SEL = -1;
        render();
      } else if (kind == "p") placeAt(id, k);
    }
  };
}
