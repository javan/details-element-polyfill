const config = {
  browsers: ["ChromeHeadless"],
  frameworks: ["qunit"],
  files: ["test/dist/index.js"],

  client: {
    clearContext: false,
    qunit: {
      showUI: true
    }
  },

  singleRun: true,
  autoWatch: false,

  captureTimeout: 180000,
  browserDisconnectTimeout: 180000,
  browserDisconnectTolerance: 3,
  browserNoActivityTimeout: 300000,
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome_latest: sauce("chrome", 71),
    sl_chrome_42: sauce("chrome", 42),
    sl_ff_latest: sauce("firefox", 64),
    sl_ff_43: sauce("firefox", 43),
    sl_safari_latest: sauce("safari", 12.0, "macOS 10.13"),
    sl_safari_11: sauce("safari", 11.0, "macOS 10.12"),
    sl_safari_10: sauce("safari", 10.1, "macOS 10.12"),
    sl_edge_latest: sauce("microsoftedge", 18.17763, "Windows 10"),
    sl_edge_17: sauce("microsoftedge", 17.17134, "Windows 10"),
    sl_edge_16: sauce("microsoftedge", 16.16299, "Windows 10"),
    sl_edge_15: sauce("microsoftedge", 15.15063, "Windows 10"),
    sl_ie_11: sauce("internet explorer", 11, "Windows 8.1"),
    sl_ie_10: sauce("internet explorer", 10, "Windows 8"),
  }

  config.browsers = Object.keys(config.customLaunchers)
  config.reporters = ["dots", "saucelabs"]

  config.sauceLabs = {
    testName: "Details Element Polyfill",
    retryLimit: 3,
    build: buildId(),
  }

  function sauce(browserName, version, platform) {
    const options = {
      base: "SauceLabs",
      browserName: browserName.toString(),
      version: version.toString(),
    }
    if (platform) {
      options.platform = platform.toString()
    }
    return options
  }

  function buildId() {
    const { TRAVIS_BUILD_NUMBER, TRAVIS_BUILD_ID } = process.env
    return TRAVIS_BUILD_NUMBER && TRAVIS_BUILD_ID
      ? `TRAVIS #${TRAVIS_BUILD_NUMBER} (${TRAVIS_BUILD_ID})`
      : ""
  }
}

module.exports = function(karmaConfig) {
  karmaConfig.set(config)
}
