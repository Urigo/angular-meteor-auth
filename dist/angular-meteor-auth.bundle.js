//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Accounts = Package['accounts-base'].Accounts;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"angular-meteor-auth":{"dist":{"angular-meteor-auth.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/angular-meteor-auth/dist/angular-meteor-auth.js                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _typeof2 = require('babel-runtime/helpers/typeof');                                                        //
                                                                                                               //
var _typeof3 = _interopRequireDefault(_typeof2);                                                               //
                                                                                                               //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }              //
                                                                                                               //
/*! angular-meteor-auth v1.0.2 */                                                                              //
(function () {                                                                                                 // 2
	function webpackUniversalModuleDefinition(root, factory) {                                                    // 2
		if ((typeof exports === 'undefined' ? 'undefined' : (0, _typeof3['default'])(exports)) === 'object' && (typeof module === 'undefined' ? 'undefined' : (0, _typeof3['default'])(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === 'undefined' ? 'undefined' : (0, _typeof3['default'])(exports)) === 'object') exports["angularMeteorAuth"] = factory();else root["angularMeteorAuth"] = factory();
	}                                                                                                             //
                                                                                                               //
	return webpackUniversalModuleDefinition;                                                                      //
})()(this, function () {                                                                                       //
	return (/******/function (modules) {                                                                          // 12
			// webpackBootstrap                                                                                         //
			/******/ // The module cache                                                                                //
			/******/var installedModules = {};                                                                          //
                                                                                                               //
			/******/ // The require function                                                                            //
			/******/function __webpack_require__(moduleId) {                                                            //
                                                                                                               //
				/******/ // Check if module is in cache                                                                    //
				/******/if (installedModules[moduleId])                                                                    //
					/******/return installedModules[moduleId].exports;                                                        //
                                                                                                               //
				/******/ // Create a new module (and put it into the cache)                                                //
				/******/var module = installedModules[moduleId] = {                                                        //
					/******/exports: {},                                                                                      //
					/******/id: moduleId,                                                                                     //
					/******/loaded: false                                                                                     //
					/******/ };                                                                                               //
                                                                                                               //
				/******/ // Execute the module function                                                                    //
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);               //
                                                                                                               //
				/******/ // Flag the module as loaded                                                                      //
				/******/module.loaded = true;                                                                              //
                                                                                                               //
				/******/ // Return the exports of the module                                                               //
				/******/return module.exports;                                                                             //
				/******/                                                                                                   //
			}                                                                                                           //
                                                                                                               //
			/******/ // expose the modules object (__webpack_modules__)                                                 //
			/******/__webpack_require__.m = modules;                                                                    //
                                                                                                               //
			/******/ // expose the module cache                                                                         //
			/******/__webpack_require__.c = installedModules;                                                           //
                                                                                                               //
			/******/ // __webpack_public_path__                                                                         //
			/******/__webpack_require__.p = "";                                                                         //
                                                                                                               //
			/******/ // Load entry module and return exports                                                            //
			/******/return __webpack_require__(0);                                                                      //
			/******/                                                                                                    //
		}(                                                                                                           //
		/************************************************************************/                                   //
		/******/[                                                                                                    //
		/* 0 */                                                                                                      //
		/***/function (module, exports) {                                                                            //
                                                                                                               //
			'use strict';                                                                                               // 58
                                                                                                               //
			Object.defineProperty(exports, "__esModule", {                                                              // 60
				value: true                                                                                                // 61
			});                                                                                                         //
			var name = 'angular-meteor.auth';                                                                           // 63
			exports['default'] = name;                                                                                  // 64
                                                                                                               //
			angular.module(name, ['angular-meteor.mixer', 'angular-meteor.core', 'angular-meteor.view-model', 'angular-meteor.reactive'])
                                                                                                               //
			/*                                                                                                          //
     A mixin which provides us with authentication related methods and properties.                             //
     This mixin comes in a seperate package called `angular-meteor-auth`. Note that `accounts-base`            //
     package needs to be installed in order for this module to work, otherwise an error will be thrown.        //
    */                                                                                                         //
			.factory('$$Auth', ['$Mixer', function ($Mixer) {                                                           //
				var Accounts = (Package['accounts-base'] || {}).Accounts;                                                  // 75
                                                                                                               //
				if (!Accounts) {                                                                                           // 77
					throw Error('`angular-meteor.auth` module requires `accounts-base` package, ' + 'please run `meteor add accounts-base` before use');
				}                                                                                                          //
                                                                                                               //
				var errors = {                                                                                             // 81
					required: 'AUTH_REQUIRED',                                                                                // 82
					forbidden: 'FORBIDDEN'                                                                                    // 83
				};                                                                                                         //
                                                                                                               //
				function $$Auth() {                                                                                        // 86
					var vm = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];                       // 87
                                                                                                               //
					// reset auth properties                                                                                  //
					this.autorun(function () {                                                                                // 86
						vm.currentUser = Accounts.user();                                                                        // 91
						vm.currentUserId = Accounts.userId();                                                                    // 92
						vm.isLoggingIn = Accounts.loggingIn();                                                                   // 93
					});                                                                                                       //
				}                                                                                                          //
                                                                                                               //
				// Waits for user to finish the login process. Gets an optional validation function which                  //
				// will validate if the current user is valid or not. Returns a promise which will be rejected             //
				// once login has failed or user is not valid, otherwise it will be resolved with the current              //
				// user                                                                                                    //
				$$Auth.$awaitUser = function (validate) {                                                                  // 74
					var _this = this;                                                                                         // 102
                                                                                                               //
					validate = validate ? this.$bindToContext($Mixer.caller, validate) : function () {                        // 104
						return true;                                                                                             // 105
					};                                                                                                        //
                                                                                                               //
					if (!_.isFunction(validate)) {                                                                            // 108
						throw Error('argument 1 must be a function');                                                            // 109
					}                                                                                                         //
                                                                                                               //
					var deferred = this.$$defer();                                                                            // 112
                                                                                                               //
					// Note the promise is being fulfilled in the next event loop to avoid                                    //
					// nested computations, otherwise the outer computation will cancel the                                   //
					// inner one once the scope has been destroyed which will lead to subscription                            //
					// failures. Happens mainly after resolving a route.                                                      //
					var computation = this.autorun(function (computation) {                                                   // 101
						if (_this.getReactively('isLoggingIn')) return;                                                          // 119
						// Stop computation once a user has logged in                                                            //
						computation.stop();                                                                                      // 118
                                                                                                               //
						if (!_this.currentUser) return _this.$$afterFlush(deferred.reject, errors.required);                     // 123
                                                                                                               //
						var isValid = validate(_this.currentUser);                                                               // 125
						// Resolve the promise if validation has passed                                                          //
						if (isValid === true) return _this.$$afterFlush(deferred.resolve, _this.currentUser);                    // 118
                                                                                                               //
						var error = void 0;                                                                                      // 129
                                                                                                               //
						if (_.isString(isValid) || isValid instanceof Error) {                                                   // 131
							error = isValid;                                                                                        // 132
						} else {                                                                                                 //
							error = errors.forbidden;                                                                               // 134
						}                                                                                                        //
                                                                                                               //
						return _this.$$afterFlush(deferred.reject, error);                                                       // 137
					});                                                                                                       //
                                                                                                               //
					var promise = deferred.promise;                                                                           // 140
					promise.stop = computation.stop.bind(computation);                                                        // 141
					return promise;                                                                                           // 142
				};                                                                                                         //
                                                                                                               //
				// Calls a function with the provided args after flush                                                     //
				$$Auth.$$afterFlush = function (fn) {                                                                      // 74
					var _fn;                                                                                                  // 147
                                                                                                               //
					if (_.isString(fn)) {                                                                                     // 149
						fn = this[fn];                                                                                           // 150
					}                                                                                                         //
                                                                                                               //
					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];                                                                        // 154
					}                                                                                                         //
                                                                                                               //
					return Tracker.afterFlush((_fn = fn).bind.apply(_fn, [this].concat(args)));                               // 157
				};                                                                                                         //
                                                                                                               //
				// API v0.2.0                                                                                              //
				// Aliases with small modificatons                                                                         //
                                                                                                               //
				// No validation                                                                                           //
				// Silent error                                                                                            //
				$$Auth.$waitForUser = function () {                                                                        // 74
					// Silent error                                                                                           //
					return this.$awaitUser()['catch']();                                                                      // 167
				};                                                                                                         //
                                                                                                               //
				// No validation                                                                                           //
				$$Auth.$requireUser = function () {                                                                        // 74
					return this.$awaitUser();                                                                                 // 172
				};                                                                                                         //
                                                                                                               //
				// Full functionality                                                                                      //
				$$Auth.$requireValidUser = function () {                                                                   // 74
					return this.$awaitUser.apply(this, arguments);                                                            // 177
				};                                                                                                         //
                                                                                                               //
				return $$Auth;                                                                                             // 180
			}])                                                                                                         //
                                                                                                               //
			/*                                                                                                          //
     External service for syntactic sugare.                                                                    //
     Originally created as UI-router's resolve handler.                                                        //
    */                                                                                                         //
			.service('$auth', ['$rootScope', '$$Auth', function ($rootScope, $$Auth) {                                  //
				var _this2 = this;                                                                                         // 188
                                                                                                               //
				// Note that services are initialized once we call them which means that the mixin                         //
				// will be available by then                                                                               //
				_.keys($$Auth).forEach(function (k) {                                                                      // 187
					var stripped = k.substr(1);                                                                               // 193
					// Not using bind() so it would be testable                                                               //
					_this2[stripped] = function () {                                                                          // 192
						return $rootScope[k].apply($rootScope, arguments);                                                       // 196
					};                                                                                                        //
				});                                                                                                        //
			}]).run(['$Mixer', '$$Auth', function ($Mixer, $$Auth) {                                                    //
				$Mixer.mixin($$Auth);                                                                                      // 200
			}]);                                                                                                        //
			module.exports = exports['default'];                                                                        // 202
                                                                                                               //
			/***/                                                                                                       //
		}                                                                                                            //
		/******/])                                                                                                   //
	);                                                                                                            //
});                                                                                                            //
;                                                                                                              // 207
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/angular-meteor-auth/dist/angular-meteor-auth.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['angular-meteor-auth'] = {};

})();
