import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const API = 'http://localhost:3000/api';

// reset data file
writeFileSync('data.json', JSON.stringify({ members: [], relations: [] }, null, 2));

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

test('family tree API flow', async () => {
  const server = spawn('node', ['server.js']);
  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => process.stderr.write(d));
  await delay(500);

  let res = await fetch(`${API}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Parent', birthYear: 1980 })
  });
  const parent = await res.json();

  res = await fetch(`${API}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Child', birthYear: 2010 })
  });
  const child = await res.json();

  await fetch(`${API}/relations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parentId: parent.id, childId: child.id })
  });

  res = await fetch(`${API}/tree`);
  const tree = await res.json();

  assert.strictEqual(tree[0].id, parent.id);
  assert.strictEqual(tree[0].children[0].id, child.id);

  server.kill();
});
