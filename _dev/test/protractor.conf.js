'use strict';

exports.config = {
  directConnect: true,
  specs: ['spec/controllers/main.spec.e2e.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  framework: 'jasmine'
};
