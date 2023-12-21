import { execSync } from 'child_process';

import clipboard from 'clipboardy-ts';
import { validateOrExit, publishLocallyFromCwd, getCommandContext } from './utils';


type PublicLocalArgs = {
  autoInstall: boolean;
  global: boolean;
};

(async () => {
  const { project, options } = getCommandContext<PublicLocalArgs>();

  const outputPath = project.data?.targets?.['build']?.options?.outputPath;
  validateOrExit(
    !!outputPath,
    `Could not find "build.options.outputPath" of project "${project.name}". Is project.json configured  correctly?`,
  );

  process.chdir(outputPath);

  const { name: packageName } = await publishLocallyFromCwd();

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
})();
