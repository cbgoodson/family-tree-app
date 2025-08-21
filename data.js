import { readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data.json';

export function readData() {
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
