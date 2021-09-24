module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/setupTest.js"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/*.spec.js"],
};
