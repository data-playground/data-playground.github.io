// Player conversations
// Part of Boleiro. Plain script (no modules): everything shares the global scope; index.html lists files in load order.

const pcI = () => G.pc || (G.pc = { open: [], cur: null, cd: {}, log: [], id: 0 });
const moLab = (v) => v >= 75 ? ["Happy", "g"] : v >= 55 ? ["Content", "g"] : v >= 40 ? ["Unsettled", "w"] : v >= 25 ? ["Unhappy", "b"] : ["Furious", "b"];
const PCK = { min: "playing time", sad: "how he is feeling", con: "his contract", lv: "his future", yg: "his development" };
const PCQ = {
  min: { say: "Boss, I am not getting enough minutes. I want to play more.", o: [["Promise him a start", "You will start the next three games.", (p) => ({ mo: 8, pr: { k: "start", n: 3 } })], ["Tell him to earn it", "Work hard in training and you will get your chance.", (p) => ({ mo: p.a <= 23 ? 2 : -1 })], ["Tell him the truth", "Right now, you are not good enough to start.", (p, c) => ({ mo: c.just ? -8 : -3 })]] },
  sad: { say: "I am not happy here. Things have to change.", o: [["Listen to him", "Tell me what is wrong. I want to fix it.", () => ({ mo: 6 })], ["Give him time off", "Take a few days. You will be fresh for the next match.", () => ({ mo: 3, cd: 10 })], ["Remind him of his contract", "You have a contract. Do your job.", () => ({ mo: -5 })]] },
  con: { say: "My contract is running out. What are your plans for me?", o: [["Promise a new deal", "We will sit down soon and talk about a new deal.", () => ({ mo: 5, pr: { k: "con", by: G.round + 10 } })], ["Make him prove himself", "Keep performing and we will talk.", () => ({ mo: -1 })], ["Promise nothing", "I cannot promise anything right now.", () => ({ mo: -6 })]] },
  lv: { say: "I hear other clubs are interested. I would like to leave if the right offer comes.", o: [["Convince him to stay", "We are building something here. I need you.", () => ({ mo: G.bc >= 60 ? 4 : 1 })], ["Open the door", "If the right offer comes, I will not stand in your way.", () => ({ mo: 3 })], ["Slam the door", "You are not going anywhere.", () => ({ mo: -6 })]] },
  yg: { say: "When do I get my chance? I want to show what I can do.", o: [["Be patient", "Your time will come. Keep working.", () => ({ mo: 1 })], ["Promise minutes", "You will play in the next two games.", () => ({ mo: 6, pr: { k: "start", n: 2 } })], ["Be honest", "You are not ready yet.", () => ({ mo: -3 })]] }
};
const PCW = [["Praise him", "You have been playing really well. Keep it up.", (p) => ({ mo: p.fm >= 6.8 ? 5 : 2 })], ["Demand more", "I expect a lot more from you.", (p) => ({ mo: p.fm < 6.3 ? -2 : -4 })], ["Ask how he is feeling", "How are things? Anything on your mind?", () => ({ mo: 1, ask: 1 })]];
const pcAsk = { min: "He wants more minutes.", sad: "He is unhappy and wants things to change.", con: "He is worried about his contract.", lv: "He admits he would listen to offers.", yg: "He wants a chance to show what he can do." };
const pcRx = (d) => d >= 5 ? "He leaves the room smiling." : d >= 1 ? "He appreciates the chat." : d > -2 ? "He nods but gives nothing away." : d > -6 ? "He leaves unhappy." : "He storms out.";
function pcTopic(p, me) {
  if (G.ob.some((o) => o.pid == p.id) && p.mo < 50) return "lv";
  if (p.mo < 30) return "sad";
  const top = [...me.pl].sort((a, b) => b.o - a.o)[9];
  if (p.cy <= 1 && (!top || p.o >= top.o)) return "con";
  const rl = p.role || "depth", ex = (ROLE[rl] || ROLE.depth).x;
  if ((rl == "key" || rl == "starter" || rl == "rotation") && p.ms < ex - 0.15 && p.mo < 55) return "min";
  if ((rl == "prospect" || rl == "youth") && p.a <= 21 && p.ms < 0.25 && p.mo < 50) return "yg";
  return null;
}
const pcCtx = (p, me) => {
  const xi = me.xi.map((i) => me.pl[i]).filter((x) => x && x.pos == p.pos && x !== p);
  return { just: !!xi.length && p.o >= Math.min(...xi.map((x) => x.o)) - 1 };
};
function pcLog(t, s) {
  const pc = pcI();
  pc.log.unshift({ t, s, r: `S${G.season}` });
  pc.log.length = Math.min(pc.log.length, 15);
}
function pcRound() {
  if (G.jl) return;
  const me = G.t[G.me], pc = pcI(), R = G.round;
  me.pl.forEach((p) => {
    const pr = p.pr;
    if (!pr) return;
    const pl = (p.lx || 0) >= 45;
    if (pr.k == "start") {
      if (pl) {
        pr.n--;
        if (pr.n <= 0) {
          p.mo = cl(p.mo + 6, 0, 100);
          p.pr = null;
          pcLog(`${p.n}: you kept your promise to play him. He is delighted.`, 1);
        }
      } else if (!p.inj && !p.sus) {
        p.mo = cl(p.mo - 12, 0, 100);
        p.pr = null;
        pcLog(`${p.n}: you broke your promise to start him. He is furious.`, -1);
      }
    } else if (pr.k == "con") {
      if (p.cy > 1) {
        p.mo = cl(p.mo + 4, 0, 100);
        p.pr = null;
        pcLog(`${p.n}: you kept your promise about a new contract.`, 1);
      } else if (R >= pr.by) {
        p.mo = cl(p.mo - 10, 0, 100);
        p.pr = null;
        pcLog(`${p.n}: you broke your promise about a new contract.`, -1);
      }
    }
  });
  me.pl.forEach((p) => {
    p.lx = 0;
  });
  pc.open = pc.open.filter((o) => {
    if (o.a != null) return false;
    const p = me.pl.find((x) => x.id == o.pid);
    if (!p) return false;
    if (R - o.r > 6) {
      p.mo = cl(p.mo - 3, 0, 100);
      pcLog(`${p.n}: you ignored him and he took it badly.`, -1);
      return false;
    }
    return true;
  });
  if (pc.open.length < 3) {
    const c = me.pl.filter((p) => !p.inj && !(pc.cd[p.id] > R - 5) && !pc.open.some((o) => o.pid == p.id) && !p.pr).map((p) => ({ p, k: pcTopic(p, me) })).filter((x) => x.k && Math.random() < 0.3);
    c.slice(0, 3 - pc.open.length).forEach((x) => {
      pc.open.push({ id: ++pc.id, pid: x.p.id, k: x.k, r: R, a: null, rc: null });
    });
  }
}
function pcApply(p, fx) {
  const me = G.t[G.me], f = rn(0.8, 1.2), d = Math.round((fx.mo || 0) * f * 10) / 10;
  p.mo = cl(p.mo + d, 0, 100);
  if (fx.pr) p.pr = { ...fx.pr };
  if (fx.cd) p.cd = Math.min(100, p.cd + fx.cd);
  pcI().cd[p.id] = G.round;
  return d;
}
function pcAns(id, oi) {
  const pc = pcI(), o = pc.open.find((x) => x.id == id);
  if (!o || o.a != null) return;
  const me = G.t[G.me], p = me.pl.find((x) => x.id == o.pid), op = PCQ[o.k].o[oi];
  if (!p || !op) return;
  const d = pcApply(p, op[2](p, pcCtx(p, me)));
  o.a = oi;
  o.rc = pcRx(d) + (p.pr ? " He will hold you to it." : "");
  pcLog(`${p.n}: ${op[0].toLowerCase()} (${PCK[o.k]}).`, d >= 1 ? 1 : d <= -2 ? -1 : 0);
}
function pcTalk(pid, oi) {
  const pc = pcI(), me = G.t[G.me], p = me.pl.find((x) => x.id == pid);
  if (!p) return;
  if (oi == null) {
    if (pc.cd[p.id] > G.round - 5) return;
    pc.cur = { pid, a: null };
    return;
  }
  const c = pc.cur;
  if (!c || c.pid != pid || c.a != null) return;
  const op = PCW[oi], fx = op[2](p), k = pcTopic(p, me), d = pcApply(p, fx);
  c.a = oi;
  c.rc = pcRx(d) + (fx.ask ? " " + (k ? pcAsk[k] : "He is happy and has no complaints.") : "");
  pcLog(`${p.n}: ${op[0].toLowerCase()}.`, d >= 1 ? 1 : d <= -2 ? -1 : 0);
}
