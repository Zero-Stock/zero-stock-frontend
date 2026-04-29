import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLocalIp = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (interfaces) {
      for (const net of interfaces) {
        if ((net.family === 'IPv4' || net.family === 4) && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return '127.0.0.1';
};

const stripPaths = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const blocksToRemove = new Set(['paths', 'operations', '$defs', 'webhooks']);

  const blocks = [];
  let currentBlock = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!currentBlock) {
      const match = line.match(/^export\s+(?:interface|type)\s+(\$?\w+)/);
      if (match) {
        currentBlock = { name: match[1], start: i, depth: 0 };
      }
    }

    if (currentBlock) {
      for (const char of line) {
        if (char === '{') currentBlock.depth++;
        if (char === '}') currentBlock.depth--;
      }

      if (currentBlock.depth === 0) {
        blocks.push({
          name: currentBlock.name,
          start: currentBlock.start,
          end: i,
        });
        currentBlock = null;
      }
    }
  }

  const linesToRemove = new Set();
  for (const block of blocks) {
    if (blocksToRemove.has(block.name)) {
      for (let i = block.start; i <= block.end; i++) {
        linesToRemove.add(i);
      }
    }
  }

  const result = lines.filter((_, i) => !linesToRemove.has(i));
  const cleaned = result.join('\n').replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(filePath, cleaned);
};

const generateEnumConstants = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const enumTypes = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(
      /^\s{8}([A-Z]\w+): ("[^"]+"(?:\s*\|\s*"[^"]+")*);$/,
    );
    if (match) {
      const name = match[1];
      const valuesStr = match[2];
      const values =
        valuesStr.match(/"([^"]+)"/g)?.map((value) => value.slice(1, -1)) || [];

      if (values.length >= 2) {
        enumTypes.push({ name, values });
      }
    }
  }

  if (enumTypes.length === 0) {
    return;
  }

  const constDeclarations = enumTypes.map(({ name, values }) => {
    const entries = values.map((value) => {
      const key = value.toUpperCase().replace(/[/-]/g, '_');
      return `  ${key}: "${value}"`;
    });
    return `export const ${name} = {\n${entries.join(',\n')},\n} as const;`;
  });

  const newContent = `${content}\n${constDeclarations.join('\n\n')}\n`;
  fs.writeFileSync(filePath, newContent);
};

const localIp = getLocalIp();
const apiPort = process.env.OPENAPI_PORT ?? process.env.PORT ?? '3000';
const openApiPath = (process.env.OPENAPI_PATH ?? 'openapi').replace(/^\/+/, '');
const openApiUrl =
  process.env.OPENAPI_URL ?? `http://${localIp}:${apiPort}/${openApiPath}.json`;
const outputPath = path.resolve(__dirname, '../src/shared/types/schema.ts');
const command = `npx --yes openapi-typescript "${openApiUrl}" -o "${outputPath}" --root-types --root-types-no-schema-prefix`;

try {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  execSync(command, { stdio: 'inherit' });
  stripPaths(outputPath);
  generateEnumConstants(outputPath);
} catch {
  process.exit(1);
}
