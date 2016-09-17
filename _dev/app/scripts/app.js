/**
 * @ngdoc overview
 * @name wikiApp
 * @description
 * # wikiApp
 * Main module of the application
 */
angular

.module('wikiApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.bootstrap',
  'svcWiki'
])

.config(function ($routeProvider) {
  'use strict';
  
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .otherwise({
      redirectTo: '/'
    });
});
