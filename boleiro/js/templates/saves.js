// HTML templates: save/load page
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

function savesHTML() {
  const rows = SLOTS.map((k) => {
    const m = svMeta(k);
    return `<div class="slotc"><b>${k == "auto" ? "Autosave" : "Slot " + k}</b><div class="mut" style="margin:4px 0 10px;min-height:2.6em">${m ? `${m.l}<br>${new Date(m.t).toLocaleString()}` : "empty"}</div><div class="row" style="margin:0">${G && k != "auto" ? `<button class="sm" data-sv="save" data-s="${k}">Save here</button>` : ""}<button class="sm" data-sv="load" data-s="${k}" ${m ? "" : "disabled"}>Load</button><button class="sm" data-sv="del" data-s="${k}" ${m ? "" : "disabled"}>Delete</button></div></div>`;
  }).join("");
  return `<div class="card"><h3>Save / Load</h3>${SVM ? `<p>${SVM}</p>` : ""}<p class="mut" style="margin:4px 0">The game autosaves after every round. Slots stay in this browser only. To back up a game or move it to another device, download a save file and load it there.</p><div class="svg2">${rows}</div><div class="row" style="margin-top:12px">${G ? `<button class="p" data-sv="dl">Download save file</button>` : ""}<button data-sv="file">Load from file</button><input type="file" id="svf" accept=".boleiro,.txt,text/plain" style="display:none"></div><div class="row" style="margin-top:8px">${G ? `<button class="sm" data-sv="exp">Show save code</button>` : ""}<button class="sm" data-sv="imp">Load pasted code</button></div>${XP && G ? `<textarea id="svx" readonly rows="4" style="width:100%">${XP}</textarea><button data-sv="copy">Select &amp; copy</button>` : ""}<textarea id="svi" rows="3" placeholder="Paste a save code here" style="width:100%;margin-top:8px"></textarea></div>`;
}
