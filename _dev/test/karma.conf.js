module.exports = function(config) {
  'use strict';

  config.set({
    autoWatch: false,
    basePath: '../',
    frameworks: [
      'jasmine'
    ],

    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/spec/**/*.js'
    ],
    exclude: [
      'dist',
      'test/spec/controllers/*.e2e.js'
    ],

    // Web Server Port (Cloud9 only)
//     port: process.env.PORT,
//     hostname: process.env.IP || '0.0.0.0',
//     runnerPort: 0,

    browsers: [
      'Chrome',
      'Firefox',
      'Safari'
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-jasmine'
    ],
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,

    // URL root prevent conflicts with the site root
    urlRoot: '_karma_'
  });
};
