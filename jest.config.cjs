const fs = require("fs");
const path = require("path");

// Create fs wrapper with fileExists method for Vue compiler
// Vue's compiler expects fs.fileExists to be a function that returns a boolean
const fsWithFileExists = Object.create(fs);
fsWithFileExists.fileExists = function (filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};
fsWithFileExists.readFile = function (filePath, encoding) {
  try {
    return fs.readFileSync(filePath, encoding || "utf-8");
  } catch {
    return null;
  }
};

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
        fs: fsWithFileExists,
      },
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lucide-vue-next$": "<rootDir>/src/__mocks__/lucide-vue-next.ts",
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
