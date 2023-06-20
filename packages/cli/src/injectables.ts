/** injectables */
export const Injectable = {
  Logger: Symbol.for('Logger'),
  WorkerVersionManager: Symbol.for('WorkerVersionManager'),
  WorkerAutoUpdater: Symbol.for('WorkerAutoUpdater'),
  WorkRunner: Symbol.for('WorkRunner'),
  Cli: Symbol.for('Cli'),
} as const;
