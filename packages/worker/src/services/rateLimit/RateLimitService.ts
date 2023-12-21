import { singleton } from 'tsyringe';


export interface IRateLimitService {
  getIsLimitReached(): Promise<boolean>;
}

/**
 * Service ensures that 
 */
@singleton()
export class RateLimitService implements IRateLimitService {
  public async getIsLimitReached(): Promise<boolean> {
    // TODO getIsLimitReached
    // throw new Error('not implemented');
    return false;
  }
}
