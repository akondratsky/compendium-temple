import { execSync } from 'child_process';

export const getLatestVersion = (packageName: string) => {
  const npmViewString = execSync(`npm view ${packageName} --json --registry=http://localhost:4873/`).toString();
  const npmView = JSON.parse(npmViewString);
  return npmView['dist-tags'].latest;
};
