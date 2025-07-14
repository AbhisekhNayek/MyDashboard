export default {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};