// Light/dark/system theme switch
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

let THM = "system";
try {
  THM = localStorage.getItem("bf_theme") || "system";
} catch (e) {
}
function thmAp() {
  const d = document.documentElement;
  if (THM == "system") d.removeAttribute("data-theme");
  else d.setAttribute("data-theme", THM);
  document.querySelectorAll(".thm button").forEach((b) => b.classList.toggle("on", b.dataset.th == THM));
}
document.addEventListener("click", (e) => {
  const b = e.target.closest && e.target.closest(".thm button");
  if (!b) return;
  THM = b.dataset.th;
  try {
    localStorage.setItem("bf_theme", THM);
  } catch (x) {
  }
  thmAp();
});
thmAp();
