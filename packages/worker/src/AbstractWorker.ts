export type WorkerOptions = {
  /** Number of requests or tokens for API or GraphQL requests accordingly */
  reservedQuota?: number;

  /** Enable debug mode */
  debug?: boolean;

  accessToken: string;
}

export abstract class AbstractWorker {
  constructor(private options: WorkerOptions) {}

  public abstract start(): Promise<void>;

  public abstract stop(): Promise<void>;
}
