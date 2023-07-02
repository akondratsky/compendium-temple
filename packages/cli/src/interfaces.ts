export interface IWorkerVersionManager {
  /** Check if latest version of worker is installed in CLI */
  getIsLatestInstalled(): Promise<boolean>;

  /** Gets latest version of worker published */
  getLatestVersion(): Promise<string>;
}

export interface IConfigurationManager {
  setRegistryUrl(registryUrl?: string): Promise<void>;
  getRegistryUrl(): Promise<string | undefined>;
  setIsDebug(isDebug: boolean): Promise<void>;
  getIsDebug(): Promise<boolean>;
}

export interface IAutoUpdater {
  autoUpdate(): Promise<void>;
}

export interface ICli {
  start(): void;
}
