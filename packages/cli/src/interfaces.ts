export interface IWorkerVersionManager {
  /** Check if latest version of worker is installed in CLI */
  getIsLatestInstalled(): Promise<boolean>;
}

export interface IConfigurationManager {
  setRegistryUrl(registryUrl?: string): void;
  getRegistryUrl(): string | undefined;
}

export interface IAutoUpdater {
  autoUpdate(): Promise<void>;
}

export interface ICli {
  start(): void;
}
