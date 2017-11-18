// Karma configuration
// Generated on Fri Nov 17 2017 22:07:41 GMT+0100 (CET)

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ["jasmine"],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      "src/**/*.spec.ts"
    ],

    preprocessors: {
      "src/**/*.ts": ["webpack"]
    },

    reporters: ["progress"],

    webpack: {
      resolve: {
        extensions: ['.js', '.ts']
      },
      module: {
        loaders: [
          {test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules/]}
        ]
      },
    },

    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-phantomjs-launcher"
    ],
    // web server port
    // port: 9876,

    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
