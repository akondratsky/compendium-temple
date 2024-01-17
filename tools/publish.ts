import minimist, { ParsedArgs } from 'minimist';
import devkit from '@nx/devkit';
import { execSync } from 'child_process';
import { validateOrExit } from './utils';
import { getPackageJson } from './utils/getPackageJson';

(async () => {
  const options = minimist(process.argv.slice(2)) as ParsedArgs;
  const [ projectName, ...restArgs ] = options._;
  
  validateOrExit(
    restArgs.length === 0,
    `Unknown arguments: ${restArgs.join(' ')}`
  );

  const graph = devkit.readCachedProjectGraph();
  const project = graph.nodes[projectName];

  validateOrExit(
    !!project,
    `Could not find project "${projectName}" in the workspace. Is the project.json configured correctly?`,
  );

  const outputPath = project.data?.targets?.['build']?.options?.outputPath;

  validateOrExit(
    !!outputPath,
    `Could not find "build.options.outputPath" of project "${project.name}". Is the project.json configured correctly?`,
  );

  process.chdir(outputPath);

  const packageJson = await getPackageJson();
  const versionRegex = /^\d+\.\d+\.\d+(-beta\.\d+)?$/;
  
  validateOrExit(
    versionRegex.test(packageJson.version),
    `Version "${packageJson.version}" of package "${packageJson.name}" is not valid.`
  );

  const [ , beta ] = packageJson.version.split('-');
  const tag = beta ? 'beta' : 'latest';

  try {
    execSync(`npm publish --access public --tag ${tag}`);
    console.log(`Package ${packageJson.name}@${packageJson.version} is published with tag ${tag}`);
  } catch (e: unknown) {
    console.log(String(e));
    process.exit(1);
  }
})();
