export interface IWorkerVersionManager {
  /** Check if latest version of worker is installed in CLI */
  getIsLatestInstalled(): Promise<boolean>;

  /** Gets latest version of worker published */
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
