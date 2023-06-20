import fs from 'fs';
import { execSync } from 'child_process';
import { validateOrExit } from './validateOrExit';
import { PackageJson } from 'nx/src/utils/package-json';
import { updateBetaVersion } from './updateBetaVersion';

export const publishLocallyFromCwd = async () => {
  validateOrExit(
    fs.existsSync('package.json'),
    'Could not find package.json',
  );
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8')) as PackageJson;

  packageJson.version = await updateBetaVersion(packageJson);

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf-8');

  try {
    execSync(`npm publish --registry=http://localhost:4873/`);
    console.log(`Package ${packageJson.name}@${packageJson.version} is published.`);
  } catch (e: unknown) {
    console.log(String(e));
    process.exit(1);
  }

  return packageJson;
}