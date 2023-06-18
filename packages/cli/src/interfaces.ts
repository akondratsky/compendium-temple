export interface IWorkerVersionManager {
  getIsLatestInstalled(): Promise<boolean>;
  getLatestVersion(): Promise<string>;
}

export interface IWorkerAutoUpdater {
  update(): Promise<void>;
}

export interface IWorkRunner {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface ICli {
  start(): void;
}
