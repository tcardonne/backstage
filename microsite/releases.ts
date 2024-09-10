import fs from 'node:fs';
import path from 'node:path';

const docsDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../docs',
);

export const releases = fs
  .readdirSync(path.resolve(docsDir, 'releases'))
  .filter(doc => doc.match(/^v\d+\.\d+\.\d+\.md$/))
  .map(doc => doc.replace(/\.md$/, ''))
  .sort((a, b) => {
    // Semver sort
    const aVal = a
      .slice(1)
      .split('.')
      .reduce((acc, val) => acc * 1000 + parseInt(val), 0);
    const bVal = b
      .slice(1)
      .split('.')
      .reduce((acc, val) => acc * 1000 + parseInt(val), 0);
    return bVal - aVal;
  });
