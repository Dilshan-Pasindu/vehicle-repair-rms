'use strict';

/**
 * Jest configuration for VSRMS Backend
 * Focuses on Node.js environment and commonJS module support.
 */
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
  ],
  // Ensure we don't pick up mobile tests
  modulePathIgnorePatterns: ['<rootDir>/../vsrms-mobile/'],
};
