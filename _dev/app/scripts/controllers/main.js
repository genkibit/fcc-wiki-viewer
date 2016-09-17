/**
 * @ngdoc function
 * @name weatherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wikiApp
 */
angular.module('wikiApp')

.controller('MainCtrl', ['$http', '$log', 'wikiSvc', function ($http, $log, wikiSvc) {
  'use strict';
  
  var vm = this;

  // For toggling auto suggest feature
  vm.checkbox = false;

  // Handler for auto suggest
  vm.reqMenuItems = function(val) {
    if (vm.checkbox) {
      return wikiSvc.getMenuItems(val)
        .then(function(res) {
          return res.data[1].map(function(item) {
            return item;
          });
        }, function(err) {
          vm.error = true;
          $log.error(err);
        });
    }
  };

  // Handler for making a search request when user clicks submit
  vm.reqWikis = function() {
    wikiSvc.getWikis(vm.asyncSelected, 25)
      .then(function(res) {
        if (!res.length) {
          vm.noResults = true;
        }
        else {
          vm.noResults = false;
        }
        vm.results = res;
      }, function(err) {
        vm.error = true;
        $log.error(err);
      });
  };

  // Handler for generating a random article
  vm.reqRandom = function() {
    return wikiSvc.getRandom()
      .then(function(res) {
        vm.results = res;
      }, function(err) {
        vm.error = true;
        $log.error(err);
      });
  };

}]);
