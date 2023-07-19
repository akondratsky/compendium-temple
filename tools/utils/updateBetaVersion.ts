import type { PackageJson } from 'nx/src/utils/package-json';
import getLatestVersion from '@badisi/latest-version';
import { validateOrExit } from './validateOrExit';
import { LOCAL_REGISTRY_URL } from './constants';

const validateVersion = (version: string) =>   validateOrExit(
  /^\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version),
  `Incorrect version: ${version}. Expected format: x.x.x or x.x.x-beta.x`
);

export const updateBetaVersion = async ({ version, name }: PackageJson) => {
  validateVersion(version);
  
  const { latest } = await getLatestVersion(name, {
    registryUrl: LOCAL_REGISTRY_URL,
  });

  if (!latest) {
    return `${version}-beta.1`;
  }

  validateVersion(latest);

  const [base, suffix] = latest.split('-');

  if (suffix) {
    const [, betaVersion] = suffix.split('.')
    return `${base}-beta.${+betaVersion + 1}`;
  }

  return `${base}-beta.1`;
};
