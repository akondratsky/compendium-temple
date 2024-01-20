import { singleton } from 'tsyringe';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

@singleton()
export class TimeService {
  constructor() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  /** Returns difference with current moment in milliseconds */
  public getTimeDifferenceInMilliseconds(timestamp: number): number {
    const resetTimeUtc = dayjs(timestamp);
    const currentTime = dayjs();
    return resetTimeUtc.diff(currentTime, 'millisecond');
  }

  public utcDate(date: string): Date {
    return dayjs(date).toDate();
  }

  public async waitUntil(timestamp: number): Promise<void> {
    const waitTime = this.getTimeDifferenceInMilliseconds(timestamp);
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}
