import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';

const registryUrl = new URL('../../heir-content-map.yml', import.meta.url);
const source = await readFile(registryUrl, 'utf8');
const registry = parse(source);
const publication = JSON.parse(await readFile(new URL('../src/data/publication.json', import.meta.url), 'utf8'));
const links = {};
if (registry.links.length !== 13) throw new Error('Expected all 13 original HEIR relationships.');
for (const entry of registry.links) {
  if (links[entry.id]) throw new Error(`Duplicate link ID: ${entry.id}`);
  const external = entry.destination.kind === 'external';
  const href = external ? entry.destination.url : publication.internalTargets[entry.id] || null;
  if (href && !external && !href.startsWith('/')) throw new Error(`Invalid internal route: ${entry.id}`);
  links[entry.id] = {
    status: href ? 'published' : 'pending',
    href,
    newTab: external && entry.destination.new_tab === true,
  };
}
await mkdir(new URL('../src/generated/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/generated/heir-links.json', import.meta.url), JSON.stringify({
  version: registry.version,
  project: registry.project,
  registrySha256: createHash('sha256').update(source).digest('hex'),
  links,
}, null, 2) + '\n');
console.log(`Synchronized ${Object.keys(links).length} permanent IDs; pending targets remain plain text.`);
