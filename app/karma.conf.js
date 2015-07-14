// Karma configuration
// Generated on Fri Nov 14 2014 21:41:28 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'test-main.js',
      {pattern: 'vendor/indexeddb.js', included: false},
      {pattern: 'vendor/angular.js', included: false},
      {pattern: 'vendor/angular-mocks.js', included: false},
      {pattern: 'vendor/jquery-1.8.3.js', included: false},
      {pattern: 'vendor/bootstrap.js', included: false},
      {pattern: 'vendor/domReady.js', included: false},
      
      {pattern: 'scripts/services/services.js',included:false},
      {pattern: 'scripts/services/*Service.js',included:false},
      
      {pattern: 'scripts/services/SOAPClient.js',included:false},
      {pattern: 'scripts/services/SOAPClientXml.js',included:false},
      {pattern: 'scripts/services/SOAPClientParameters.js',included:false},
      
      {pattern: 'scripts/directives/directives.js',included:false},
      {pattern: 'scripts/directives/*.js',included:false},

      {pattern: 'scripts/controller/controllers.js',included:false},
      {pattern: 'scripts/controller/*Controller.js',included:false},

      {pattern: 'scripts/app.js',included:false},
      {pattern: 'scripts/bootstrap.js',included:false},
      {pattern: 'scripts/dictsConstant.js',included:false},
      {pattern: 'scripts/test/*.js',included:false}
    ],
    // list of files to exclude
    exclude: [
      'views/*.html',
      'scripts/main.js',
      'views/**/*.html'
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
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
    browsers: ['IE'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
