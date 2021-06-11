module.exports = {
  rootDir: "./",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*test.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
