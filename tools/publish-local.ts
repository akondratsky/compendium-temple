import { execSync } from 'child_process';
import devkit from '@nx/devkit';
import clipboard from 'clipboardy-ts';
import { validateOrExit } from './utils';
import minimist, { ParsedArgs } from 'minimist';
import { publishLocallyFromCwd } from './utils/publishLocallyFromCwd';

type PublicLocalArgs = ParsedArgs & {
  autoInstall: boolean;
  global: boolean;
};

const options = minimist(process.argv.slice(2)) as PublicLocalArgs;

const [projectName, ...restArgs] = options._;

validateOrExit(
  restArgs.length === 0,
  `Unknown arguments: ${restArgs.join(' ')}`
)

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

const { name: packageName } = publishLocallyFromCwd();

const installCommand = `npm i ${options.global ? '-g ' : ''}${packageName} --registry=http://localhost:4873/`;

try {
  if (options.autoInstall) {
    console.log('Installing package...')
    execSync(installCommand);
    console.log('Package installed.');
  } else {
    clipboard.writeSync(installCommand);
    console.log(`Command is copied into clipboard: ${installCommand}`)
  }
} catch (e) {
  console.log(String(e));
}

