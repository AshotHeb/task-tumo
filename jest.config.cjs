const fs = require("fs");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "preserve",
        },
      },
    ],
  },
  globals: {
    "vue-jest": {
      compilerOptions: {
        compatConfig: {
          MODE: 3,
        },
        fs: fs,
      },
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,vue}",
    "!src/**/*.d.ts",
    "!src/main.ts",
    "!src/**/*.test.ts",
  ],
  setupFilesAfterEnv: [],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
