import { TimeService } from './TimeService';
import dayjs from 'dayjs';

describe('TimeService', () => {
  let timeService: TimeService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z').getTime());
    timeService = new TimeService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('getTimeDifferenceInMilliseconds calculates time difference in milliseconds', () => {
    const timestamp = dayjs('2024-01-01T00:01:01Z').valueOf();
    const difference = timeService.getTimeDifferenceInMilliseconds(timestamp);
    expect(difference).toBe(61000); // 1 minute 1 second difference in milliseconds
  });
});