// Karma configuration
// Generated on Sun Sep 03 2017 18:58:26 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'commonjs'],


    // list of files / patterns to load in the browser
    files: [
      '__tests__/array-from-polyfill.js',
      '__tests__/array-some-polyfill.js',
      '__tests__/classlist-polyfill.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'js/*.js',
      '__tests__/*.test.js',
      { pattern: '__tests__/images/*.png', watched: false, included: false, served: true },
      { pattern: '__tests__/images/*.jpg', watched: false, included: false, served: true },
      { pattern: '__tests__/images/*.gif', watched: false, included: false, served: true }
    ],
    

    proxies: {
      '/__tests__/images/': '/base/__tests__/images/'
    },

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'js/*.js' : ['commonjs', 'babel'],
      '__tests__/*.test.js' : ['commonjs', 'babel']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


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
    browsers: ['Chrome', 'Firefox', 'IE9', 'IE10'],


    customLaunchers: {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
}
