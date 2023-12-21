import devkit from '@nx/devkit';
import minimist, { ParsedArgs } from 'minimist';
import { validateOrExit } from './validateOrExit';

/**
 * @returns project and options passes as arguments
 */
export const getCommandContext = <T>() => {
  const options = minimist(process.argv.slice(2)) as ParsedArgs & T;

  const [projectName, ...restArgs] = options._;

  validateOrExit(
    restArgs.length === 0,
    `Unknown arguments: ${restArgs.join(' ')}`
  )

  const graph = devkit.readCachedProjectGraph();
  const project = graph.nodes[projectName];

  validateOrExit(
    !!project,
    `Could not find project "${projectName}" in the workspace. Is the project.json configured correctly?`,
  );

  return {
    options,
    project,
  }
};
