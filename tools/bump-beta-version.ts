import { getCommandContext, updatePackageBetaVersion } from './utils';

(async () => {
  const { project } = getCommandContext();
  process.chdir(project.data.root);
  await updatePackageBetaVersion()
})();
