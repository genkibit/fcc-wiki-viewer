Wikipedia Viewer
===


Synopsis
---
This is one of a series of projects for the front-end program of **[freeCodeCamp](http://www.freecodecamp.com/)**. The goal is to build a **[Wikipedia](https://www.wikipedia.org/)** article aggregator. This application uses **[MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)** and runs on the **[AngularJS framework](https://angularjs.org/)**.

The project rubric is as follows:

+ Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/FreeCodeCamp/full/wGqEga/.
+ Rule #1: Don't look at the example project's code. Figure it out for yourself.
+ Rule #2: Fulfill the below user stories. Use whichever libraries or APIs you need. Give it your own personal style.
+ User Story: I can search Wikipedia entries in a search box and see the resulting Wikipedia entries.
+ User Story: I can click a button to see a random Wikipedia entry.


App Link
---
Access the page **[here](http://genkibit.github.io/fcc-wiki-viewer/)**.

Testing
---
Unit tests were done on OSX 10 with **[Karma](https://karma-runner.github.io/1.0/index.html)** and **[Jasmine](http://jasmine.github.io/)**. E2E tests were run with **[Protractor](http://www.protractortest.org/#/)** installed globally and using the local Chrome driver directly.

1. Make sure you have Chrome, Firefox and Safari applications in the Applications directory and their required karma plugins.
2. Open Terminal and `cd` to the root app directory.
3. Run `grunt test` to run the unit tests.
4. Run `grunt serve`.
5. Open another Terminal window and run  `protractor protractor.conf.js` to run the e2e tests.


Build & development
---
Run `grunt` for building and `grunt serve` for preview.


Attribution
---
+ This project is generated with **[Yeoman AngularJS generator](https://github.com/yeoman/generator-angular)**
version 0.15.1


License
---
Code provided under an **[MIT license](https://github.com/genkibit/fcc-wiki-viewer/blob/gh-pages/LICENSE.md)**


Changelog
---
+ 20160917 -- v1.0.0
  - Initial release.
+ 20170225 -- v1.1.0
  - Added site favicon.
