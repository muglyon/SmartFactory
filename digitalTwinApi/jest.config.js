module.exports = {
  "roots": [
    "<rootDir>/__tests__"
  ],
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "moduleNameMapper": {
    "\\.(css|less)$": "<rootDir>/__tests__/__mocks__/styleMock.ts"
  },
  "testPathIgnorePatterns": [
    "<rootDir>/__tests__/assets"
  ],
  "testResultsProcessor": "jest-sonar-reporter",
  "collectCoverage": true
}