module.exports = {
  "roots": [
    "<rootDir>/__tests__",
    
    "<rootDir>/src"
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
    "<rootDir>/__tests__/__mocks__"
  ],
  "testResultsProcessor": "jest-sonar-reporter",
  "setupFiles": ["./jest.setup.js"],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.+(ts|tsx)",
    "!src/components/**/*",
    "!src/types/**/*",
    "!src/auth/**/*",
    "!src/reducers/store.ts"
  ],
  "globals": {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    },
    
    "document": {
      location: {
        protocol: "http:",
        host: "localhost:3000"
      }
    }
  }
}