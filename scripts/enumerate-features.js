import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';

import { walk } from '../utils/index.js';

function main({ dest, dataFrom }) {
  fs.writeFileSync(dest, JSON.stringify(enumerateFeatures(dataFrom)));
}

function enumerateFeatures(dataFrom) {
  const feats = [];

  const walker = dataFrom
    ? walk(
        undefined,
        JSON.parse(
          fs.readFileSync(path.join(process.cwd(), dataFrom), 'utf-8'),
        ),
      )
    : walk();

  for (const { path, compat } of walker) {
    if (compat) {
      feats.push(path);
    }
  }

  return feats;
}

const { argv } = yargs().command(
  '$0 [dest]',
  'Write a JSON-formatted list of feature paths',
  (yargs) => {
    yargs
      .positional('dest', {
        default: '.features.json',
        description: 'File destination',
      })
      .option('data-from', {
        nargs: 1,
        description: 'Require compat data from an alternate path',
      });
  },
);

if (esMain(import.meta)) {
  main(argv);
}

export default enumerateFeatures;
