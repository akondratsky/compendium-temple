import axios from 'axios';
import * as matchers from 'jest-extended';

expect.extend(matchers);

const validateEnv = (variables: string[]) => variables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`${variable} env variable is not set`);
  }
});

validateEnv([
  'SERVER_AUTH_TOKEN_HASH_SALT',
  'E2E_GITHUB_TOKEN',
  'E2E_GITHUB_USER_ID',
]);

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.headers.common.Authorization = `Bearer ${process.env.E2E_GITHUB_TOKEN}`;