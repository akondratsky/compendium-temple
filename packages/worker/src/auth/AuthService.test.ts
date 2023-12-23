import { AuthService } from './AuthService';
import { getPassword } from 'keytar';

jest.mock('keytar', () => ({
  getPassword: jest.fn()
}));

const getPasswordMock = jest.mocked(getPassword);

describe('AuthService', () => {
  it.skip('takes access token from the key vault if it is here', async () => {
    // const TEST_TOKEN = 'test_access_token';
    // getPasswordMock.mockReturnValueOnce(Promise.resolve(TEST_TOKEN));
    // const service = new AuthService();
    // await service.authorize();
    // const token = await service.getAccessToken();
    // expect(token).toBe(TEST_TOKEN);
  });
});
