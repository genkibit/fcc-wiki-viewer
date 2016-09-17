/**
 * @ngdoc overview
 * @name svcWiki
 * @description
 * # svcWiki
 * MediaWiki API service module
 */
angular.module('svcWiki', [])

/**
 * @ngdoc factory
 * @name svcWiki.wikiCache
 * @requires $cacheFactory
 * @description
 * ## wikiCache
 * Caches array of random search tearms for explore function
 */
.factory('wikiCache', ['$cacheFactory', function($cacheFactory) {
  'use strict';
  return $cacheFactory({'myData':[]});
}])

/**
 * @ngdoc factory
 * @name svcWiki.wikiSvc
 * @requires$http, $q, wikiCache
 * ## wikiSvc
 * @description
 * Handles API calls to MediaWiki and sends results to the controller
 */
.factory('wikiSvc', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
  'use strict';
  
  var deferred = $q.defer();
  var cache = $cacheFactory({'myData':[]});
  var baseUrl = 'https://en.wikipedia.org/w/api.php?';

  var wikiSvc = {

    // Handler for pop-up autocomplete menu
    getMenuItems: function(val) {
      var _params = {
        action: 'opensearch',
        format: 'json',
        namespace: 0,
        search: val,
        callback: 'JSON_CALLBACK'
      };
      return  $http.jsonp(baseUrl, { params: _params })
        .then(function(res) {
          return res;
        })
        .catch(function(err) {
          var errMsg = 'Error: @wikiSvc.getMenuItems -- ' + err.status;
          deferred.reject(errMsg);
          return deferred.promise;
         
        });
    }, // END -- getMenuItems

    // Gets wiki articles from MediaWiki
    getWikis: function(query, limit) {
      if (query === undefined || query === '') {
        return;
      }

      // Stores results as an array of data objects
      var resData = [];
      var _params = {
        action:'opensearch',
        format:'json',
        namespace: 0,
        search: query,
        limit: limit,
        callback: 'JSON_CALLBACK'
      };
      return $http.jsonp(baseUrl, { params: _params })
        .then(function(res) {
          for (var i = 0; i < res.data[1].length; i++) {
            resData.push({
              title: res.data[1][i],
              snippet: res.data[2][i],
              link: res.data[3][i]
            });
          }
          return resData;
        })
        .catch(function(err) {
          var errMsg = 'Error: @wikiSvc.getWikis -- ' + err.status;
          deferred.reject(errMsg);
          return deferred.promise;
        });
    }, // END -- getWikis

    // Genrates a new array of random articles for caching
    genRandWikiArray: function() {
      var _params = {
        action: 'query',
        format: 'json',
        list: 'random',
        rnlimit: 10,
        rnnamespace: 0,
        callback: 'JSON_CALLBACK'
      };
      return $http.jsonp(baseUrl, { params: _params })
        .then(function(res) {
          var data = res.data.query.random;
          return cache.put('myData', data);
        }, function(err) {
          var errMsg = 'Error: @wikiSvc.genRandWikiArray -- ' + err.status;
          deferred.reject(errMsg);
          return deferred.promise;
        });
    }, // END -- genRandWikiArray

    // Selects the first article in the array generated by genRandWikiArray()
    getRandArticle: function(dataArray) {
      var resData = [];
      var params = {
        action:'opensearch',
        format:'json',
        namespace: 0,
        search: dataArray[0].title,
        limit: 1,
        callback: 'JSON_CALLBACK'
      };
      return $http.jsonp(baseUrl, { params: params })
        .then(function(res) {
          resData.push({
            title: res.data[1][0],
            snippet: res.data[2][0],
            link: res.data[3][0]
          });
          dataArray.shift();
          cache.put('myData', dataArray);
          return resData;
        })
        .catch(function(err) {
            var errMsg = 'Error: @wikiSvc.getRandArticle -- ' + err.status;
            deferred.reject(errMsg);
            return deferred.promise;
        });
    }, // END -- getRandArcticle

    // Gets a random Wiki article
    getRandom: function() {
      if (cache.get('myData') === undefined || cache.get('myData').length === 0) {
        return wikiSvc.genRandWikiArray()
          .then(function(res) {
            return wikiSvc.getRandArticle(res);
          });
      }
      else {
        var data = cache.get('myData');
        return wikiSvc.getRandArticle(data);
      }
    } // END: -- getRandom

  };

  return wikiSvc;
}]);
