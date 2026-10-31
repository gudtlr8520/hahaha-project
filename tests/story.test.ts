import assert from "node:assert/strict";
import { test } from "node:test";
import { choose, ENDINGS, heal, initialRun, ITEMS, STORY, validRun, type Run } from "../src/lib/story";
import { decodeSave } from "../src/lib/storage";

test("every branch has an existing destination and every ending can actually be reached", () => {
  for (const node of Object.values(STORY)) for (const choice of node.choices) {
    assert.ok(STORY[choice.to], `${node.id} -> ${choice.to}`);
    if (choice.resolve) { assert.ok(STORY[choice.resolve.yes]); assert.ok(STORY[choice.resolve.no]); }
    if (choice.requires) assert.ok(ITEMS[choice.requires]);
  }
  const queue: Run[] = [initialRun()];
  const visited = new Set<string>();
  const reached = new Set<string>();
  while(queue.length) {
    const run = queue.pop()!;
    const fingerprint = JSON.stringify([run.node, run.health, [...run.inventory].sort(), [...run.flags].sort()]);
    if (visited.has(fingerprint)) continue;
    visited.add(fingerprint);
    assert.ok(validRun(run));
    const node = STORY[run.node];
    if (node.ending) { reached.add(node.id); continue; }
    const available = node.choices.filter(c => !c.requires || run.inventory.includes(c.requires));
    assert.ok(available.length, `Soft lock at ${node.id}`);
    node.choices.forEach((_, i) => {const next = choose(run,i); if(next!==run)queue.push(next);});
    const healed = heal(run);
    if(healed!==run)queue.push(healed);
  }
  assert.deepEqual([...reached].sort(), ENDINGS.map(e=>e.id).sort());
});

test("ally survives a deliberate complete path; starting state is not mutated", () => {
  const start = initialRun();
  let run = start;
  for (const i of [0,0,0,0,0,0,0,0,0,0]) run = choose(run,i);
  assert.equal(run.node,"endingTogether");
  assert.equal(run.health,100);
  assert.ok(run.flags.includes("ally"));
  assert.deepEqual(start,initialRun());
});

test("missing items lock branches; bandages are consumed once; fatal damage ends a run", () => {
  const run = {...initialRun(), node:"basement", health:80};
  assert.equal(choose(run,1),run);
  const injured: Run = {...run,inventory:["bandage"]};
  const healed = heal(injured);
  assert.equal(healed.health,100);
  assert.deepEqual(healed.inventory,[]);
  assert.equal(heal(healed),healed);
  assert.equal(choose({...run,health:20},2).node,"endingExhausted");
});

test("browser save validation rejects malformed or incompatible data", () => {
  const save = {version:1,run:initialRun(),manual:null,endings:[],savedAt:new Date().toISOString(),settings:{sound:false,effects:true}};
  assert.ok(decodeSave(JSON.stringify(save)));
  assert.equal(decodeSave("{broken"),null);
  assert.equal(decodeSave(JSON.stringify({...save,version:2})),null);
  assert.equal(decodeSave(JSON.stringify({...save,run:{...initialRun(),node:"missing"}})),null);
  assert.equal(decodeSave(JSON.stringify({...save,run:{...initialRun(),node:"constructor"}})),null);
  assert.equal(decodeSave(JSON.stringify({...save,run:{...initialRun(),health:999}})),null);
  assert.equal(decodeSave(JSON.stringify({...save,run:{...initialRun(),inventory:["__proto__"]}})),null);
});
