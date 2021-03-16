module.exports = {
    "roots": [
      "./HubToDT/tests"
    ],
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "testMatch": [
      "**/tests/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    }
  }