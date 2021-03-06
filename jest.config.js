module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "setupFiles": ["./src/setupTests.ts"],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "dist"
  ]
};
