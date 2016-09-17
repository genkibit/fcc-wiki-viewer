'use strict';

describe('Service: wikiSvc', function () {
 
  var rootScope, mkSvc, mkHttp, mkQ, deferred, jsonResAB, jsonResC, jsonResD, reqHandler, mkCache;
  var $scope = {};
  
  beforeEach(module('svcWiki'));
  
  beforeEach(inject(function(_$rootScope_, $http, _$q_, _$httpBackend_, _wikiSvc_, _$cacheFactory_) {
    rootScope = _$rootScope_;
    mkHttp = _$httpBackend_;
    mkQ = _$q_;
    deferred = mkQ.defer();
    mkSvc = _wikiSvc_;
    mkCache = _$cacheFactory_('mkCache');
    
    // Mock code A and B request and response setup
    var mkUrl = 'http://foo/wikisearch/';
    jsonResAB = ["tea",["Tea","Teacher","Tea Party movement","Team Fortress 2","Team America: World Police","Teaneck, New Jersey","Team","Team Madness","Tear down this wall!","Tea culture"],["Tea is an aromatic beverage commonly prepared by pouring hot or boiling water over cured leaves of the Camellia sinensis, an evergreen shrub native to Asia.","A teacher (also called a school teacher) or educator is a person who provides education for students.","The Tea Party movement is an American political movement known for its conservative positions and its role in the Republican Party.","Team Fortress 2 is a team-based first-person shooter multiplayer video game developed and published by Valve Corporation.","Team America: World Police (also known as Team America) is a 2004 American-German live-action puppet satirical adventure action comedy film produced by Scott Rudin, Matt Stone and Trey Parker, written by Parker, Stone and Pam Brady and directed by Parker, all of whom are also known for the popular animated television series South Park.","Teaneck /\u02c8ti\u02d0n\u025bk/ is a township in Bergen County, New Jersey, United States, and a suburb in the New York metropolitan area.","A team is a group of people or other animals linked in a common purpose. Human teams are especially appropriate for conducting tasks that are high in complexity and have many interdependent subtasks.","Team Madness was a professional wrestling heel stable in World Championship Wrestling (WCW) led by Randy Savage, that began in April 1999 and ended three months later in July.","\"Tear down this wall!\" is a line from a speech made by US President Ronald Reagan in West Berlin on June 12, 1987, calling for the leader of the Soviet Union, Mikhail Gorbachev, to open up the barrier which had divided West and East Berlin since 1961.","Tea culture is defined by the way tea is made and consumed, by the way the people interact with tea, and by the aesthetics surrounding tea drinking."],["https://en.wikipedia.org/wiki/Tea","https://en.wikipedia.org/wiki/Teacher","https://en.wikipedia.org/wiki/Tea_Party_movement","https://en.wikipedia.org/wiki/Team_Fortress_2","https://en.wikipedia.org/wiki/Team_America:_World_Police","https://en.wikipedia.org/wiki/Teaneck,_New_Jersey","https://en.wikipedia.org/wiki/Team","https://en.wikipedia.org/wiki/Team_Madness","https://en.wikipedia.org/wiki/Tear_down_this_wall!","https://en.wikipedia.org/wiki/Tea_culture"]];
    reqHandler = mkHttp.when('JSONP', mkUrl, {'search':'tea'}).respond(jsonResAB); 
    
    // Mock code A
    mkSvc.getMenuItems = function(val) {
      var params = { search: val };
      $http.jsonp(mkUrl, params)
        .then(function(res) {
          $scope.res = res;
        }, function(err) {
          $scope.err = err.status;
      });
    }; // END -- Mock code A
    
    // Mock code B
    mkSvc.getWikis = function(query, limit) {
      var resData = [];
      var params = { search: query, limit:limit };
      $http.jsonp(mkUrl, params)
        .then(function(res) {
          for (var i = 0; i < res.data[1].length; i++) {
            resData.push({
              title: res.data[1][i],
              snippet: res.data[2][i],
              link: res.data[3][i]
            });
          }
          $scope.res = resData;
        });
    }; // END -- Mock code B
    
    // Mock code C   
    jsonResC = {"batchcomplete":"","continue":{"rncontinue":"0.932969113054|0.932970741701285|1043|0","continue":"-||"},"query":{"random":[{"id":2923090,"ns":0,"title":"Stromlo High School"},{"id":27367479,"ns":0,"title":"Tom Judson"},{"id":11142054,"ns":0,"title":"Biki\u0107 Do"},{"id":26336735,"ns":0,"title":"Live! (The Charlie Daniels Band album)"},{"id":24156984,"ns":0,"title":"Kyabaggu of Buganda"},{"id":43230191,"ns":0,"title":"Jazz Man Records"},{"id":489894,"ns":0,"title":"Irene Morgan"},{"id":23920975,"ns":0,"title":"Toronto municipal election, 1942"},{"id":19624813,"ns":0,"title":"Canoeing at the 1984 Summer Olympics \u2013 Men's C-2 500 metres"},{"id":58998,"ns":0,"title":"Colemanballs"}]}};
    
    mkSvc.genRandWikiArray = function() {
      $http.jsonp(mkUrl)
        .then(function(res) {
          var data = res.data.query.random;
          return mkCache.put('mkData', data);
        });
    }; // END -- Mock code C
    
    // Mock code D
    jsonResD = ["Stromlo High School",["Stromlo High School"],["Stromlo High School is a high school located in Waramanga, Australian Capital Territory. Stromlo came into being after the merger of Weston creek high school & Holder high school in 1990. in Its postcode is 2611. Stromlo."],["https://en.wikipedia.org/wiki/Stromlo_High_School"]];
    
    mkSvc.getRandArticle = function(cacheArray) {
      var resData = [];
      $http.jsonp(mkUrl)
        .then(function(res) {
          
          resData.push({
            title: res.data[1][0],
            snippet: res.data[2][0],
            link: res.data[3][0]
          });
          
          $scope.res = resData;
          cacheArray.shift();
          return mkCache.put('mkData', cacheArray);

        });
    }; // END -- Mock code D
    
  }));
  
  afterEach(function() {
    mkHttp.verifyNoOutstandingExpectation();
    mkHttp.verifyNoOutstandingRequest();
  });
      
      
  it('should be invoked', function () {
    mkSvc.getMenuItems('tea');
    expect(mkHttp.flush).not.toThrow();
  });
  
  it('shoud return valid JSON data for the search term "tea"', function() {
    mkSvc.getMenuItems('tea');
    mkHttp.flush();
    expect($scope.res.data).toEqual(jsonResAB);
    expect($scope.res.data[0]).toBe('tea');
  });
  
  // Same error handler applies to all mock tests
  it('should throw an error', function () {
    reqHandler.respond(401);
    mkSvc.getMenuItems('tea');
    mkHttp.flush();
    expect($scope.err).toBe(401);
  });
  
  it('should be invoked', function () {
    mkSvc.getWikis('tea', 25);
    expect(mkHttp.flush).not.toThrow();
  });
  
  it('should return default limit of 10 results', function () {
    mkSvc.getWikis('tea');
    mkHttp.flush();
    expect($scope.res.length).toEqual(10);
  });
  
  it('should return only one result with defined parameters', function () {
    reqHandler.respond(["Arevadash",["Arevadasht"],["Arevadasht (Armenian: \u0531\u0580\u0587\u0561\u0564\u0561\u0577\u057f), is a village in the Armavir Province of Armenia."],["https://en.wikipedia.org/wiki/Arevadasht"]]);
    mkSvc.getWikis('Arevadash', 25);    
    mkHttp.flush();    
    expect($scope.res.length).toEqual(1);
    expect($scope.res[0].title).toBeDefined();
    expect($scope.res[0].snippet).toBeDefined();
    expect($scope.res[0].link).toBeDefined();
  });
  
  it('should return cached array with length 10', function () {
    reqHandler.respond(jsonResC);
    mkSvc.genRandWikiArray();
    mkHttp.flush();  
    var cache = mkCache.get('mkData');
    expect(cache.length).toEqual(10);
  });

  it('should return a single object with 3 properties and reduce the cached data array from 10 to 9', function () {
    reqHandler.respond(jsonResC);
    mkSvc.genRandWikiArray();
    mkHttp.flush();
    
    var cache1 = mkCache.get('mkData');
   
    reqHandler.respond(jsonResD);   
    mkSvc.getRandArticle(cache1);
    mkHttp.flush();
    
    var cache2 = mkCache.get('mkData');
    
    expect($scope.res.length).toEqual(1);
    expect($scope.res[0].title).toBe('Stromlo High School');
    expect($scope.res[0].snippet).toBe('Stromlo High School is a high school located in Waramanga, Australian Capital Territory. Stromlo came into being after the merger of Weston creek high school & Holder high school in 1990. in Its postcode is 2611. Stromlo.');
    expect($scope.res[0].link).toBe('https://en.wikipedia.org/wiki/Stromlo_High_School');
    expect(cache2.length).toEqual(9);
  });
  
});
