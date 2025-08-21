import http from 'http';
import { readData, writeData } from './data.js';
import { randomUUID } from 'crypto';
import url from 'url';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = './public';

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

function serveStatic(res, filePath) {
  try {
    const data = readFileSync(filePath);
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html'
      : ext === '.css' ? 'text/css'
      : ext === '.js' ? 'application/javascript'
      : 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch (err) { reject(err); }
    });
  });
}

function buildTree() {
  const data = readData();
  const map = new Map(data.members.map(m => [m.id, { ...m, children: [] }]));
  for (const rel of data.relations) {
    const parent = map.get(rel.parentId);
    const child = map.get(rel.childId);
    if (parent && child) parent.children.push(child);
  }
  const childIds = new Set(data.relations.map(r => r.childId));
  return Array.from(map.values()).filter(m => !childIds.has(m.id));
}

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url, true);
  if (req.method === 'GET' && pathname.startsWith('/api/')) {
    // API routes under /api
    if (pathname === '/api/members') {
      const data = readData();
      sendJSON(res, 200, data.members);
    } else if (pathname === '/api/tree') {
      sendJSON(res, 200, buildTree());
    } else {
      sendJSON(res, 404, { error: 'Not found' });
    }
  } else if (req.method === 'POST' && pathname === '/api/members') {
    try {
      const body = await parseBody(req);
      const data = readData();
      const member = { id: randomUUID(), name: body.name, birthYear: body.birthYear };
      data.members.push(member);
      writeData(data);
      sendJSON(res, 201, member);
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON' });
    }
  } else if (req.method === 'POST' && pathname === '/api/relations') {
    try {
      const body = await parseBody(req);
      const data = readData();
      data.relations.push({ parentId: body.parentId, childId: body.childId });
      writeData(data);
      sendJSON(res, 201, { status: 'ok' });
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON' });
    }
  } else if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
  } else {
    // serve static files
    const filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);
    if (existsSync(filePath)) {
      serveStatic(res, filePath);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
