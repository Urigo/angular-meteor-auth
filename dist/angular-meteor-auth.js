/*! angular-meteor-auth v1.1.1 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["angularMeteorAuth"] = factory();
	else
		root["angularMeteorAuth"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var name = 'angular-meteor.auth';
	exports.default = name;


	angular.module(name, ['angular-meteor.mixer', 'angular-meteor.scope', 'angular-meteor.core', 'angular-meteor.view-model', 'angular-meteor.reactive'])

	/*
	  A mixin which provides us with authentication related methods and properties.
	  This mixin comes in a seperate package called `angular-meteor-auth`. Note that `accounts-base`
	  package needs to be installed in order for this module to work, otherwise an error will be thrown.
	 */
	.factory('$$Auth', ['$Mixer', '$log', '$q', function ($Mixer, $log, $q) {
	  var Accounts = (Package['accounts-base'] || {}).Accounts;

	  if (!Accounts) {
	    throw Error('`angular-meteor.auth` module requires `accounts-base` package, ' + 'please run `meteor add accounts-base` before use');
	  }

	  var errors = {
	    required: 'AUTH_REQUIRED',
	    forbidden: 'FORBIDDEN'
	  };

	  function $$Auth() {
	    var vm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

	    // Reset auth properties
	    this.autorun(function () {
	      // Note that we use Meteor and not Accounts since the following methods are
	      // not available in older versions of `accounts-base` meteor package
	      vm.currentUser = Meteor.user();
	      vm.currentUserId = Meteor.userId();
	      vm.isLoggingIn = Meteor.loggingIn();
	    });
	  }

	  // Waits for user to finish the login process. Gets an optional validation function which
	  // will validate if the current user is valid or not. Returns a promise which will be rejected
	  // once login has failed or user is not valid, otherwise it will be resolved with the current
	  // user
	  $$Auth.$awaitUser = function (validate) {
	    var _this = this;

	    validate = validate ? this.$bindToContext($Mixer.caller, validate) : function () {
	      return true;
	    };

	    if (!_.isFunction(validate)) {
	      throw Error('argument 1 must be a function');
	    }

	    var deferred = this.$$defer();

	    // If user is already logged in resolve the promise immediately to prevent an
	    // unnecessary computation
	    if (this.currentUser) {
	      deferred.resolve(this.currentUser);
	      // Keep the schema of the promise consistent
	      deferred.promise.stop = angular.noop;
	      return deferred.promise;
	    }

	    // Note the promise is being fulfilled in the next event loop to avoid
	    // nested computations, otherwise the outer computation will cancel the
	    // inner one once the scope has been destroyed which will lead to subscription
	    // failures. Happens mainly after resolving a route.
	    var computation = this.autorun(function (computation) {
	      if (_this.getReactively('isLoggingIn')) return;
	      // Stop computation once a user has logged in
	      computation.stop();

	      if (!_this.currentUser) return _this.$$afterFlush(deferred.reject, errors.required);

	      $q.when(validate(_this.currentUser)).then(function (isValid) {
	        // Resolve the promise if validation has passed
	        if (isValid === true) {
	          _this.$$afterFlush(deferred.resolve, _this.currentUser);
	        } else {
	          return $q.reject(isValid);
	        }
	      }).catch(function (isValid) {
	        var error = void 0;

	        if (_.isString(isValid) || isValid instanceof Error) {
	          error = isValid;
	        } else {
	          error = errors.forbidden;
	        }

	        _this.$$afterFlush(deferred.reject, error);
	      });
	    });

	    deferred.promise.stop = computation.stop.bind(computation);
	    return deferred.promise;
	  };

	  // Calls a function with the provided args after flush
	  $$Auth.$$afterFlush = function (fn) {
	    var _fn;

	    if (_.isString(fn)) {
	      fn = this[fn];
	    }

	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    return Tracker.afterFlush((_fn = fn).bind.apply(_fn, [this].concat(args)));
	  };

	  // API v0.2.0
	  // Aliases with small modificatons

	  // No validation
	  // Silent error
	  $$Auth.$waitForUser = function () {
	    // Silent error
	    return this.$awaitUser().catch(function (err) {
	      $log.debug('user login has failed (' + err + ')');
	    });
	  };

	  // No validation
	  $$Auth.$requireUser = function () {
	    return this.$awaitUser();
	  };

	  // Full functionality
	  $$Auth.$requireValidUser = function () {
	    return this.$awaitUser.apply(this, arguments);
	  };

	  return $$Auth;
	}])

	/*
	  External service for syntactic sugare.
	  Originally created as UI-router's resolve handler.
	 */
	.service('$auth', ['$rootScope', '$$Auth', function ($rootScope, $$Auth) {
	  var _this2 = this;

	  // Note that services are initialized once we call them which means that the mixin
	  // will be available by then
	  _.keys($$Auth).forEach(function (k) {
	    var stripped = k.substr(1);
	    // Not using bind() so it would be testable
	    _this2[stripped] = function () {
	      return $rootScope[k].apply($rootScope, arguments);
	    };
	  });
	}]).run(['$Mixer', '$$Auth', function ($Mixer, $$Auth) {
	  $Mixer.mixin($$Auth);
	}]);
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;