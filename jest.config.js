module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "setupFilesAfterEnv": ["jest-extended"]
}