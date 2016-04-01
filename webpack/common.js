var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var pkg = require('../package.json');

var common = {
  // the entry point for the bundle
  entry: {
    // output              // input
    'dist/angular-meteor-auth': './src/angular-meteor-auth'
  },
  output: {
    // point to root directory so we can avoid using ../../
    path: path.join(__dirname, '../'),
    library: 'angularMeteorAuth',
    libraryTarget: 'umd'
  },
  target: 'web',
  // global variables
  externals: {
    angular: 'angular',
    underscore: {
      root: '_',
      amd: 'underscore',
      commonjs2: 'underscore',
      commonjs: 'underscore'
    },
    Meteor: 'Meteor',
    Package: 'Package',
    Tracker: 'Tracker'
  },
  // global configuration of babel loader
  babel: {
    presets: ['es2015'],
    plugins: ['add-module-exports']
  },
  eslint: {
    quiet: true,
    failOnError: true
  },
  module: {
    preLoaders: [{
      // linting check
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      // use babel on js files
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: [
    // add information about name and version of angular-meteor package
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version)
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'angular-meteor': path.join(__dirname, '../node_modules/angular-meteor/dist/angular-meteor.js'),
    }
  }
};

// merge provided configuration with common things
module.exports = function(config) {
  return _.merge({}, common, config);
};