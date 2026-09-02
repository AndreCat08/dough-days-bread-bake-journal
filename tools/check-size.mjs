// Enforce the brief's "max 40KB raw source" budget.
// Only the app's raw source counts (src/**). Markdown & images are excluded.
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'src');
const LIMIT = 40 * 1024;
const EXCLUDED_EXT = new Set(['.md', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.mp3', '.mp4']);

let total = 0;
const rows = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (!EXCLUDED_EXT.has(extname(p).toLowerCase())) {
      const size = statSync(p).size;
      total += size;
      rows.push([p, size]);
    }
  }
}
walk(root);

rows.sort((a, b) => b[1] - a[1]);
for (const [p, size] of rows) console.log(`${String(size).padStart(6)}  ${p}`);
console.log('----------------------------------------');
console.log(`total raw source: ${total} bytes (limit ${LIMIT})`);
if (total > LIMIT) {
  console.error(`OVER BUDGET by ${total - LIMIT} bytes`);
  process.exit(1);
}
console.log('within budget');
