import { execSync } from 'child_process';
import devkit from '@nx/devkit';
import clipboard from 'clipboardy-ts';
import fs from 'fs';
import { validateOrExit } from './utils';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const [, , projectName] = process.argv;
const graph = devkit.readCachedProjectGraph();
const project = graph.nodes[projectName];

validateOrExit(
  !!project,
 `Could not find project "${projectName}" in the workspace. Is the project.json configured correctly?`,
);

const outputPath = project.data?.targets?.['build']?.options?.outputPath;
validateOrExit(
  !!outputPath,
  `Could not find "build.options.outputPath" of project "${projectName}". Is project.json configured  correctly?`,
);

process.chdir(outputPath);

validateOrExit(
  fs.existsSync('package.json'),
  'Could not find package.json',
);

const { name: packageName } = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

try {
  execSync(`npm publish --registry=http://localhost:4873/`);
} catch (e: any) {
  console.log(String(e));
}
console.log('Package published.');

const installCommand = `npm i -g ${packageName} --registry=http://localhost:4873/`;
try {
  clipboard.writeSync(installCommand);
} catch (e) {
  console.log(String(e));
}

console.log(`Command is copied into clipboard: ${installCommand}`)