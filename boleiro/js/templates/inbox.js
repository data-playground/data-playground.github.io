// HTML templates: inbox
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function inboxHTML(me) {
  const R = inboxItems(me), n = R.filter((x) => x.w).length;
  return `<div class="card"><div class="ch"><b>Inbox</b><span class="mut">${n ? n + " need attention" : "Nothing urgent"} · ${R.length} message${R.length == 1 ? "" : "s"}</span></div>${R.length ? R.map((x) => `<button class="msg${x.w ? " w" : ""}" data-v="${x.v}"><span class="dt"></span><span><small>${x.from}</small><span class="t">${x.t}</span></span></button>`).join("") : '<span class="mut">No messages.</span>'}<p class="mut" style="margin:10px 0 0;font-size:12.5px">Messages are built from your current situation: offers for your players, your assistant's advice and the latest transfer news. Click one to go to the page it is about.</p></div>`;
}
