export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    "Controller/**/*.js",
    "!Control/**/*.test.js",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
  testMatch: [
    "**/test/**/*.test.js",
  ],
  verbose: true,
};
