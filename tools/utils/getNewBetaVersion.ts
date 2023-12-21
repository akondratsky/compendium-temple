import type { PackageJson } from 'nx/src/utils/package-json';
import getLatestVersion from '@badisi/latest-version';
import { validateOrExit } from './validateOrExit';

const LOCAL_REGISTRY_URL = 'http://localhost:4873/';

const validateVersion = (version: string) => validateOrExit(
  /^\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version),
  `Incorrect version: ${version}. Expected format: x.x.x or x.x.x-beta.x`
);



/**
 * Takes the latest version and returns new beta version according to the latest version published locally
 * @returns new beta version
 * @example `1.0.0-beta.3`
 */
export const getNewBetaVersion = async ({ version, name }: PackageJson) => {
  validateVersion(version);
  
  const { latest } = await getLatestVersion(name, {
    registryUrl: LOCAL_REGISTRY_URL,
  });

  if (!latest) {
    return `${version.split('-')[0]}-beta.1`;
  }

  validateVersion(latest);

  const [base, suffix] = latest.split('-');

  if (suffix) {
    const [, betaVersion] = suffix.split('.')
    return `${base}-beta.${+betaVersion + 1}`;
  }

  return `${base}-beta.1`;
};
