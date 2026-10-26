// Sidebar and filter UI flags
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

let SBC = false, MORE = false, FLT = false;
try {
  SBC = localStorage.getItem("bf_sb") == "1";
} catch (e) {
}
