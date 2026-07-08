import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'dist-electron');

const renameIfExists = (fromName, toName) => {
  const fromPath = join(outDir, fromName);
  const toPath = join(outDir, toName);

  if (!existsSync(fromPath)) return;
  if (existsSync(toPath)) rmSync(toPath);
  renameSync(fromPath, toPath);
};

renameIfExists('main.js', 'main.cjs');
renameIfExists('preload.js', 'preload.cjs');
