/**
 * Inspired by @YonatanKra :
 * - https://github.com/YonatanKra/web-components-ui-elements
 * - https://medium.com/walkme-engineering/web-components-test-drive-4ac0103e3599
 *
 * WebComponents need to be tested in-browser (since polyfill/reimplementations
 * of customElements, shadowDOM ... aren't really reliable)
 */
module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      // include each test file as a type=module so that it can `import` other ES modules
      {
        pattern: "./src/**/*.spec.browser.js",
        type: "module"
      },
      // include the vendor files before the specs files
      {
        pattern: "./src/vendor/**/*.js"
      },
      // only serve every files - as a type=module - so that they can be `import`ed as ES modules
      {
        pattern: "./src/**/*.js",
        type: "module",
        included: false
      }
    ],

    // list of files / patterns to exclude
    // exclude test files run by jest
    exclude: ["./src/**/*.test.js"],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // preprocessors: {
    //   "../src/**/*.spec.js": ["webpack"]
    // },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity

    // webpack: {
    //   devtool: "inline-source-map",
    //   mode: "production"
    // }
  });
};
