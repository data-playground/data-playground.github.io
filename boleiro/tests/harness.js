// Headless test harness: loads every <script src> of index.html in order into a Node vm context (no browser needed),
// then runs a test case in the same scope.   usage: node tests/harness.js index.html tests/cases/<case>.js
const fs=require('fs'),vm=require('vm');
const pathM=require('path');
const html=fs.readFileSync(process.argv[2],'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(x=>x[1]);
if(!srcs.length)throw new Error('no scripts');
let code=srcs.map(f=>fs.readFileSync(pathM.join(pathM.dirname(process.argv[2]),f),'utf8')).join('\n;\n');
const test=fs.readFileSync(process.argv[3],'utf8');
const mk=()=>{const f=function(){};return new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='value'?'':k==='checked'?false:k==='dataset'?{}:k==='files'?[]:k==='classList'?{add(){},remove(){},toggle(){}}:mk(),set:()=>true,apply:()=>mk()})};
const store={};
const ctx={console,setTimeout,clearTimeout,setInterval,clearInterval,Math,JSON,Date,Promise,Uint8Array,Blob,Response,TextDecoder,TextEncoder,DecompressionStream,CompressionStream,atob,btoa,
document:new Proxy({},{get:(t,k)=>k==='querySelector'?()=>mk():k==='querySelectorAll'?()=>[]:k==='body'||k==='documentElement'?mk():mk(),set:()=>true}),
localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},
window:{},navigator:{},requestAnimationFrame:f=>setTimeout(f,0),fetch:()=>Promise.reject(0),alert(){},confirm:()=>true,prompt:()=>null,URL:{createObjectURL:()=>''},matchMedia:()=>({matches:false,addEventListener(){}})};
ctx.window=ctx;ctx.globalThis=ctx;
vm.createContext(ctx);
// run page script and the test in the same scope so top-level let/const are visible
const full=code+"\n;(async()=>{try{\n"+test+"\n}catch(e){console.log('TEST ERROR',e&&e.stack||e);process.exitCode=1}})();";
vm.runInContext(full,ctx,{filename:'page.js'});
