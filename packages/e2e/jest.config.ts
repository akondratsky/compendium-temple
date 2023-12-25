/* eslint-disable */
export default {
  displayName: 'e2e',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/support/setup.ts'],
  maxWorkers: 1,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e',
};
