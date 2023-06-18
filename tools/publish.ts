import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

import devkit from '@nx/devkit';
import { validateOrExit } from './utils';
const { readCachedProjectGraph } = devkit;

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version, tag = 'next'] = process.argv;

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
validateOrExit(
  !!version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
);


const graph = readCachedProjectGraph();
const project = graph.nodes[name];

validateOrExit(
  !!project,
 `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = project.data?.targets?.['build']?.options?.outputPath;
validateOrExit(
  !!outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);

process.chdir(outputPath);

// Updating the version in "package.json" before publishing
try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  json.version = version;
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
  console.error(
    chalk.bold.red(`Error reading package.json file from library build output.`)
  );
}

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`);
