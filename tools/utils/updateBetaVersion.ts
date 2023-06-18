import type { PackageJson } from 'nx/src/utils/package-json';
import { getLatestVersion } from './getLatestVersion';
import { validateOrExit } from './validateOrExit';

const validateVersion = (version: string) =>   validateOrExit(
  /^\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version),
  `Incorrect version: ${version}. Expected format: x.x.x or x.x.x-beta.x`
);

export const updateBetaVersion = ({ version, name }: PackageJson) => {
  validateVersion(version);
  
  const latest = getLatestVersion(name);
  validateVersion(latest);

  const [base, suffix] = latest.split('-');

  if (suffix) {
    const [, betaVersion] = suffix.split('.')
    return `${base}-beta.${+betaVersion + 1}`;
  }

  return `${base}-beta.1`;
};
