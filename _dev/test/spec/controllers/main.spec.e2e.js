'use strict';
/* jshint ignore:start */
// Need to do this first be of article link test later on
describe('Random article fetch (Explore) function', function() {
  beforeEach(function() {
    browser.addMockModule('mockHttp', function() {
        angular.module('mockHttp', ['wikiApp', 'ngMockE2E'])
          .run(function($httpBackend) {
              $httpBackend.whenGET(/\.html$/).passThrough();

              $httpBackend.whenJSONP('https://en.wikipedia.org/w/api.php?&action=query&callback=JSON_CALLBACK&format=json&list=random&rnlimit=10&rnnamespace=0')
                .respond({"batchcomplete":"","continue":{"rncontinue":"0.231549646475|0.231551401273|36707088|0","continue":"-||"},"query":{"random":[{"id":19016578,"ns":0,"title":"Przegaliny Du\u017ce"},{"id":35665976,"ns":0,"title":"Legacy High School (Vancouver, Washington)"},{"id":1697068,"ns":0,"title":"Jacqueline Aguilera"},{"id":1626908,"ns":0,"title":"Disposable email address"},{"id":2679328,"ns":0,"title":"Make a Jazz Noise Here"},{"id":496662,"ns":0,"title":"List of rulers of Bithynia"},{"id":48862070,"ns":0,"title":"Merry Legs"},{"id":17452837,"ns":0,"title":"Claude Wilson"},{"id":6612961,"ns":0,"title":"1st Vermont Cavalry"},{"id":144678,"ns":0,"title":"Bundespr\u00e4sident"}]}});

              $httpBackend.whenJSONP(/https:\/\/en.wikipedia.org\/w\/api.php\?&action=opensearch&callback=JSON_CALLBACK&format=json&limit=1&namespace=0&search=\w+/)
                .respond(["Random",["Random title"],["Random description"],["Random link"]]);
          });
    });

    browser.get('http://localhost:8080');
  });


  it('should display a single random article', function() {
    element(by.id('explore')).click();

    var title = element.all(by.repeater('item in main.results').row(0).column('item.title')).getText();
 
    expect(element.all(by.repeater('item in main.results')).count()).toEqual(1);
    expect(title).toEqual(['Random title']);
  });
});


describe('Auto suggestion function', function() {
  var inputNode, chbxNode;

  beforeEach(function() {
    browser.addMockModule('mockHttp', function() {
      angular.module('mockHttp', ['wikiApp', 'ngMockE2E'])
        .run(function($httpBackend) {
          $httpBackend.whenGET(/\.html$/).passThrough();

          $httpBackend.whenJSONP('https://en.wikipedia.org/w/api.php?&action=opensearch&callback=JSON_CALLBACK&format=json&namespace=0&search=t')
            .respond(["t",["T","Tilde","Taxonomy (biology)","The Bartered Bride","Twitter","The White Stripes","Tyrannosaurus","T206 Honus Wagner","Tropic Thunder","Toilet"],["T (named tee /\u02c8ti\u02d0/) is the 20th letter in the modern English alphabet and the ISO basic Latin alphabet.","The tilde (/\u02c8t\u026ald\u0259/; \u02dc or ~) is a grapheme with several uses. The name of the character came into English from Spanish, which in turn came from the Latin titulus, meaning \"title\" or \"superscription\".","Taxonomy (from Ancient Greek: \u03c4\u03ac\u03be\u03b9\u03c2 taxis, \"arrangement\", and -\u03bd\u03bf\u03bc\u03af\u03b1 -nomia, \"method\") is the science of defining groups of biological organisms on the basis of shared characteristics and giving names to those groups.","The Bartered Bride (Czech: Prodan\u00e1 nev\u011bsta, The Sold Bride) is a comic opera in three acts by the Czech composer Bed\u0159ich Smetana, to a libretto by Karel Sabina.","Twitter (/\u02c8tw\u026at\u0259r/) is an online social networking service that enables users to send and read short 140-character messages called \"tweets\".","The White Stripes were an American rock duo, formed in 1997 in Detroit, Michigan. The group consisted of the couple, married at the time, Jack White (songwriter, vocals, guitar, bass and keyboards) and Meg White (drums and occasional vocals).","Tyrannosaurus (/t\u1d7b\u02ccr\u00e6n\u0259\u02c8s\u0254\u02d0r\u0259s/ or /ta\u026a\u02ccr\u00e6n\u0259\u02c8s\u0254\u02d0r\u0259s/, meaning \"tyrant lizard\", from the Ancient Greek tyrannos (\u03c4\u03cd\u03c1\u03b1\u03bd\u03bd\u03bf\u03c2), \"tyrant\", and sauros (\u03c3\u03b1\u1fe6\u03c1\u03bf\u03c2), \"lizard\") is a genus of coelurosaurian theropod dinosaur.","The T206 Honus Wagner baseball card depicts the Pittsburgh Pirates' Honus Wagner, a dead-ball era baseball player who is widely considered to be one of the best players of all time.","Tropic Thunder is a 2008 American action comedy film co-written, produced, directed by, and starring Ben Stiller.","A toilet is a sanitation fixture used for the storing or disposal of human urine and feces. In developed countries, different forms of porcelain flush toilets are common: seats are usually used in the West while squat toilets are common in East Asia."],["https://en.wikipedia.org/wiki/T","https://en.wikipedia.org/wiki/Tilde","https://en.wikipedia.org/wiki/Taxonomy_(biology)","https://en.wikipedia.org/wiki/The_Bartered_Bride","https://en.wikipedia.org/wiki/Twitter","https://en.wikipedia.org/wiki/The_White_Stripes","https://en.wikipedia.org/wiki/Tyrannosaurus","https://en.wikipedia.org/wiki/T206_Honus_Wagner","https://en.wikipedia.org/wiki/Tropic_Thunder","https://en.wikipedia.org/wiki/Toilet"]]);
        });
    });

    browser.get('http://localhost:8080');
    chbxNode = element(by.model('main.checkbox'));
    inputNode = element(by.model('main.asyncSelected'));
  });


  it('should be enabled with "T" as the first item when the "t" key is pressed', function() {

    // Enables the auto-suggest feature
    chbxNode.click();
    inputNode.clear();
    inputNode.sendKeys('t');

    // ui-typeahead is a ul of class='dropdown-menu'
    var dropDownFirst = element.all(by.css('.dropdown-menu li')).first();

    // browser.pause(); -- Needed to find out the exact URL
    expect(dropDownFirst.getText()).toBe('T');
  });

  it('should be disabled', function() {
    inputNode.clear();
    inputNode.sendKeys('t');

    var dropDownExists = element(by.css('.dropdown-menu li')).isPresent();

    expect(dropDownExists).toBe(false);
  });
});


describe('Search function', function() {
  var inputNode, submitBtn;

  beforeEach(function() {

    browser.addMockModule('mockHttp', function() {
      angular.module('mockHttp', ['wikiApp', 'ngMockE2E'])
        .run(function($httpBackend) {
            $httpBackend.whenGET(/\.html$/).passThrough();

            // When submit empty query (also if search returns empty results)
            $httpBackend.whenJSONP('https://en.wikipedia.org/w/api.php?&action=opensearch&callback=JSON_CALLBACK&format=json&limit=25&namespace=0')
              .respond(["",[],[],[]]);

            // Search for 'tea'
            $httpBackend.whenJSONP('https://en.wikipedia.org/w/api.php?&action=opensearch&callback=JSON_CALLBACK&format=json&limit=25&namespace=0&search=tea')
              .respond(["tea",["Tea","Team (Lorde song)","Team America: World Police","Team Fortress 2","Tea production in Sri Lanka","Teardrops on My Guitar","Tears for Fears","Tea processing","Team of Rivals","Teays River","Teaneck, New Jersey","Team Sky","Team LottoNL\u2013Jumbo","Teach the Controversy","Teachers (film)","TEAMS Design","Team SoloMid","Team composition and cohesion in spaceflight missions","Team Umizoomi","Teatro Fox Delicias","Teairra Mar\u00ed","Teaware","TeamTalk","Tea leaf grading","Tea culture"],["Tea is an aromatic beverage commonly prepared by pouring hot or boiling water over cured leaves of the Camellia sinensis, an evergreen shrub native to Asia.","\"Team\" is a song by New Zealand singer Lorde, taken from her debut studio album, Pure Heroine (2013). The song was released on 13 September 2013 as the album's third single in Australia and New Zealand by Universal Music New Zealand, and the second in the United States and the United Kingdom by Lava and Republic Records.","Team America: World Police is a 2004 satirical action comedy film starring puppets produced by Scott Rudin, Matt Stone and Trey Parker, written by Parker, Stone and Pam Brady and directed by Parker, all of whom are also known for the popular animated television series South Park.","Team Fortress 2 is a team-based first-person shooter multiplayer video game developed and published by Valve Corporation.","Tea production is one of the main sources of foreign exchange for Sri Lanka (formerly called Ceylon), and accounts for 2% of GDP, contributing over US $1.5 billion in 2013 to the economy of Sri Lanka.","\"Teardrops on My Guitar\" is a song by American country pop singer-songwriter Taylor Swift. The song was co-written by Swift, alongside Liz Rose and produced by Nathan Chapman with Swift's aid.","Tears for Fears are an English pop/rock band formed in 1981 by Roland Orzabal and Curt Smith. Founded after the dissolution of their first band, the mod-influenced Graduate, they were initially associated with the new wave synthesizer bands of the early 1980s but later branched out into mainstream rock and pop, which led to international chart success.","Tea processing is the method in which the leaves from the tea plant Camellia sinensis are transformed into the dried leaves for brewing tea.","Team of Rivals: The Political Genius of Abraham Lincoln is a 2005 book by Pulitzer Prize-winning American historian Doris Kearns Goodwin, published by Simon & Schuster.","The Teays River /\u02c8te\u026az/ was a major preglacial river that drained much of the present Ohio River watershed, but took a more northerly downstream course.","Teaneck /\u02c8ti\u02d0n\u025bk/ is a township in Bergen County, New Jersey, United States, and a suburb in the New York metropolitan area.","Team Sky (UCI team code: SKY) is a British professional cycling team that competes in the UCI World Tour.","Team LottoNL\u2013Jumbo is a men's professional bicycle racing team, successor of the former Rabobank. The team consists of three sections: ProTeam (the UCI ProTour team), Continental (a talent team racing in the UCI Europe Tour), and Cyclo-cross.","\"Teach the Controversy\" is a campaign, conducted by the Discovery Institute, to promote the peudoscientific principle of intelligent design, a variant of traditional creationism, while attempting to discredit the teaching of evolution in United States public high school science courses.","Teachers is a 1984 satirical dark comedy-drama film starring Nick Nolte, JoBeth Williams, Ralph Macchio, and Judd Hirsch, written by W. R.","TEAMS is a design firm headquartered in Germany founded in 1956 by industrial designer Hans Erich Slany.","Team SoloMid (TSM or simply SoloMid) is an electronic sports organization based in the United States. It was founded in September 2009 by brothers and League of Legends players Andy \"Reginald\" Dinh and Daniel \"Dan Dinh\" Dinh who had previously started the SoloMid.net gaming community website.","Selection, training, cohesion and psychosocial adaptation influence performance and, as such, are relevant factors to consider while preparing for costly, long-duration spaceflight missions in which the performance objectives will be demanding, endurance will be tested and success will be critical.","Team Umizoomi is a computer animated fantasy musical series with an emphasis on preschool mathematical concepts, such as counting, sequences, shapes, patterns, measurements, and comparisons.","Teatro Fox Delicias is a historic building in the city of Ponce, Puerto Rico. Inaugurated in 1931, it originally housed a movie house until 1980, from 1991 to 1998 it house a shopping mall, and stating in 2004 it housed a boutique hotel.","Teairra Mar\u00ed (born Teairra Mar\u00ed Thomas; December 2, 1987) is an American singer-songwriter, dancer, model and actress.","Teaware encompasses a broad international spectrum of equipment used in the brewing and consumption of tea.","TeamTalk is a conferencing system which people use to communicate on the Internet using VoIP and video streaming.","In the tea industry, tea leaf grading is the process of evaluating products based on the quality and condition of the tea leaves themselves.","Tea culture is defined by the way tea is made and consumed, by the way the people interact with tea, and by the aesthetics surrounding tea drinking."],["https://en.wikipedia.org/wiki/Tea","https://en.wikipedia.org/wiki/Team_(Lorde_song)","https://en.wikipedia.org/wiki/Team_America:_World_Police","https://en.wikipedia.org/wiki/Team_Fortress_2","https://en.wikipedia.org/wiki/Tea_production_in_Sri_Lanka","https://en.wikipedia.org/wiki/Teardrops_on_My_Guitar","https://en.wikipedia.org/wiki/Tears_for_Fears","https://en.wikipedia.org/wiki/Tea_processing","https://en.wikipedia.org/wiki/Team_of_Rivals","https://en.wikipedia.org/wiki/Teays_River","https://en.wikipedia.org/wiki/Teaneck,_New_Jersey","https://en.wikipedia.org/wiki/Team_Sky","https://en.wikipedia.org/wiki/Team_LottoNL%E2%80%93Jumbo","https://en.wikipedia.org/wiki/Teach_the_Controversy","https://en.wikipedia.org/wiki/Teachers_(film)","https://en.wikipedia.org/wiki/TEAMS_Design","https://en.wikipedia.org/wiki/Team_SoloMid","https://en.wikipedia.org/wiki/Team_composition_and_cohesion_in_spaceflight_missions","https://en.wikipedia.org/wiki/Team_Umizoomi","https://en.wikipedia.org/wiki/Teatro_Fox_Delicias","https://en.wikipedia.org/wiki/Teairra_Mar%C3%AD","https://en.wikipedia.org/wiki/Teaware","https://en.wikipedia.org/wiki/TeamTalk","https://en.wikipedia.org/wiki/Tea_leaf_grading","https://en.wikipedia.org/wiki/Tea_culture"]]);
        });
    });

    browser.get('http://localhost:8080');
    inputNode = element(by.model('main.asyncSelected'));
    inputNode.clear();
    submitBtn = element(by.id('submit'));
  });


  it('should display "No results" when submitting an empty query', function() {
    inputNode.sendKeys('');
    submitBtn.click();
    expect(element(by.className('indicator')).isPresent()).toBe(true);
  });

  it('should display results for "tea"', function() {
    inputNode.sendKeys('tea');
    submitBtn.click();
    expect(element.all(by.repeater('item in main.results')).count()).toEqual(25);
  });


  describe('Article result', function() {
    it('should jump to the article source when clicked', function() {
      browser.ignoreSynchronization = true;
      inputNode.sendKeys('tea');
      submitBtn.click();
      element.all(by.repeater('item in main.results').row(0)).click();

      expect(browser.getCurrentUrl()).toBe('https://en.wikipedia.org/wiki/Tea');
    });
  });
});
/* jshint ignore:end */

