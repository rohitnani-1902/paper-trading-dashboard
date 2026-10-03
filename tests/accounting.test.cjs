const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements={};const document={getElementById(id){return elements[id]||(elements[id]={value:id==='asset'?'NOVA':id==='qty'?'10':'',textContent:'',innerHTML:''})}};
let exported;document.createElement=()=>({click(){}});const context={document,Blob,URL:{createObjectURL(blob){exported=blob;return "blob:test"},revokeObjectURL(){}},setTimeout:fn=>fn()};vm.createContext(context);vm.runInContext(script+';globalThis.snapshot=()=>JSON.stringify({cash,positions});',context);
function state(){return JSON.parse(context.snapshot())}
function trade(q,side='buy'){document.getElementById("qty").value=String(q);context.order(side)}
for(const q of ['','1.5',0,-1,'Infinity','NaN','1e20']){const before=context.snapshot();trade(q);assert.equal(context.snapshot(),before,'invalid '+q)}
trade(10);assert.equal(state().cash,23716);assert.equal(state().positions.NOVA.qty,10);
const before=context.snapshot();trade(11,'sell');assert.equal(context.snapshot(),before);
trade(1000);assert.equal(context.snapshot(),before);
trade(4,'sell');assert.equal(state().cash,24229.6);assert.equal(state().positions.NOVA.qty,6);
trade(6,'sell');assert.equal(state().cash,25000);assert.equal(Object.keys(state().positions).length,0);
elements.asset.value='GRID';
for(let i=0;i<100;i++){trade(1);trade(1,'sell')}
assert.equal(state().cash,25000,'no cash drift');
trade(2);trade(3);assert.equal(state().positions.GRID.qty,5);assert.ok(Math.abs(state().positions.GRID.cost-74.15)<1e-10);
elements.reset.onclick();assert.equal(state().cash,25000);assert.equal(Object.keys(state().positions).length,0);
console.log('Passed: invalid quantities, oversell, insufficient cash, partial/full sells, repeated round trips, average cost and reset.');

(async()=>{elements.export.onclick();const text=await exported.text();assert.ok(text.startsWith('Account reset to $25,000.00 simulated cash.'));console.log('Journal export content passed.');})();
