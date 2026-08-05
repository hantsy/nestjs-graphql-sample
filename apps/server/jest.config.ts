import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '.*(stub.ts)$'],
  testEnvironment: 'node',
  preset: 'ts-jest',
};

export default config;
