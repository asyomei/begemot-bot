/** @type {import("jest").Config} */
module.exports = {
  logHeapUsage: true,
  transform: {
    "\\.(t|j)s$": "@swc/jest"
  }
}
