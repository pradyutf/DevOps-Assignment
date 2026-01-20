/**
 * Jest Configuration
 * 
 * Jest is a JavaScript testing framework.
 * We use it to run our tests automatically in CI.
 */

module.exports = {
  // ts-jest lets Jest understand TypeScript
  preset: 'ts-jest',
  
  // We're testing Node.js code, not browser code
  testEnvironment: 'node',
  
  // Look for tests in src folder
  roots: ['<rootDir>/src'],
  
  // Find files ending in .test.ts
  testMatch: ['**/*.test.ts'],
  
  // Generate coverage report
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',  // Exclude server startup file
  ],
  
  // Minimum 50% coverage (reasonable threshold)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  
  verbose: true,
};
