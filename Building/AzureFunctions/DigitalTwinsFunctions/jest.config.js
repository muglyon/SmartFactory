module.exports = {
  "roots": [
    "<rootDir>/__tests__"
  ],
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": [
    "**/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testResultsProcessor": "jest-sonar-reporter",
  "collectCoverage": true,
  "globals": {
    
    "document": {
      location: {
        protocol: "http:",
        host: "localhost:3000"
      }
    }
  }
}