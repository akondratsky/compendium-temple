import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { PackageJson } from 'nx/src/utils/package-json';
import { validateOrExit } from './validateOrExit';

/**
 * Reads file package.json from CWD
 */
export const getPackageJson = async (): Promise<PackageJson> => {
  validateOrExit(
    existsSync('package.json'),
    'Could not find package.json',
  );

  return JSON.parse(
    await readFile('package.json', 'utf-8')
  ) as PackageJson;
};
