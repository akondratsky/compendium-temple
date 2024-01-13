import { writeFile } from 'node:fs/promises';
import { getNewBetaVersion } from './getNewBetaVersion';
import { getPackageJson } from './getPackageJson';

/**
 * Updates version in `package.json` to the new beta version
 */
export const updatePackageBetaVersion = async () => {
  const packageJson = await getPackageJson();
  packageJson.version = await getNewBetaVersion(packageJson);
  await writeFile('package.json', JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log(`${packageJson.name} updated to ${packageJson.version}`);
};
