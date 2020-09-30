module.exports = {
    "roots": [
        "<rootDir>/__tests__"
    ],
    "testEnvironment": "node",
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testPathIgnorePatterns": [
        "<rootDir>/__tests__/__mocks__"
    ],
    "testResultsProcessor": "jest-sonar-reporter",
    "collectCoverage": true
}