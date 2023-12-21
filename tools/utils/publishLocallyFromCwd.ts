import { execSync } from 'node:child_process';
import { getPackageJson } from './getPackageJson';

/**
 * Publishes package from current working directory
 */
export const publishLocallyFromCwd = async () => {
  const packageJson = await getPackageJson();

  try {
    execSync(`npm publish --registry=http://localhost:4873/`);
    console.log(`Package ${packageJson.name}@${packageJson.version} is published.`);
  } catch (e: unknown) {
    console.log(String(e));
    process.exit(1);
  }

  return packageJson;
}