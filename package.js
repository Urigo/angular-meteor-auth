Package.describe({
  name: "angular-meteor-auth",
  summary: "Angular-Meteor authentication module",
  version: "1.0.2",
  git: "https://github.com/urigo/angular-meteor-auth.git",
  documentation: null
});

Package.onUse(function(api) {
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
    'dist/angular-meteor-auth.js'
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

  /*
    To load local version of angular-meteor:
      - Clone git@github.com:Urigo/angular-meteor.git into parent dir.
      - Remove `angular-meteor-data` from the dependencies list.
      - Remove the following code block from comment.
  */

  // api.addFiles([
  //   '../angular-meteor/dist/angular-meteor.js'
  // ], 'client');

  api.addFiles([
    'tests/mocks.js',
    'tests/integration/auth.spec.js'
  ], 'client');

  api.addFiles([
    'tests/publish.js'
  ], 'server');
});
