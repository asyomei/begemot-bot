/** @type {import("jest").Config} */
module.exports = {
  logHeapUsage: true,
  moduleNameMapper: {
    "#(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "\\.(t|j)s$": "@swc/jest"
  },
}
