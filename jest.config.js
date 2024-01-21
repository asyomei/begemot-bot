/** @type {import("jest").Config} */
module.exports = {
  logHeapUsage: true,
  setupFilesAfterEnv: ["jest-extended/all"],
  moduleNameMapper: {
    "#(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "\\.(t|j)s$": "@swc/jest"
  },
}
