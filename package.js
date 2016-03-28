Package.describe({
  name: "angular-meteor-auth",
  summary: "Angular-Meteor authentication module",
  version: "1.0.0",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: null
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('ecmascript');
  api.use('reactive-var');
  api.use('accounts-base');
  api.use('angular-meteor-data@1.3.9');
  api.use('angular:angular@1.4.8', 'client');

  // Files to load in Client only.
  api.add_files([
    'angular-meteor-auth.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('mongo@1.1.1');
  api.use('sanjo:jasmine@0.19.0');
  api.use('angular:angular-mocks@1.4.7');
  api.use('angular-meteor-auth');
  api.use('ecmascript');

  /* TODO: Modify to match angular-meteor-data@0.3.0-beta.1 modules
  // Load local version of angular-meteor, so modifications would be available
  api.addFiles([
    '../angular-meteor/packages/angular-meteor-data/modules/router.js',
    '../angular-meteor/packages/angular-meteor-data/modules/utils.js',
    '../angular-meteor/packages/angular-meteor-data/modules/mixer.js',
    '../angular-meteor/packages/angular-meteor-data/modules/scope.js',
    '../angular-meteor/packages/angular-meteor-data/modules/view-model.js',
    '../angular-meteor/packages/angular-meteor-data/modules/core.js',
    '../angular-meteor/packages/angular-meteor-data/modules/reactive.js',
    '../angular-meteor/packages/angular-meteor-data/angular-meteor.js'
  ], 'client');
  */

  api.addFiles([
    'tests/mocks.js',
    'tests/integration/auth.spec.js'
  ], 'client');
});
