export default {
  testEnvironment: "node",
  transform: {},
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
