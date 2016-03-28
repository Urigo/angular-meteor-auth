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
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Accounts = Package['accounts-base'].Accounts;
var AccountsClient = Package['accounts-base'].AccountsClient;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/angular-meteor-auth/angular-meteor-auth.js                                                    //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
angular.module('angular-meteor.auth', ['angular-meteor.mixer', 'angular-meteor.core', 'angular-meteor.view-model', 'angular-meteor.reactive'])
                                                                                                          //
/*                                                                                                        //
  A mixin which provides us with authentication related methods and properties.                           //
  This mixin comes in a seperate package called `angular-meteor-auth`. Note that `accounts-base`          //
  package needs to be installed in order for this module to work, otherwise an error will be thrown.      //
 */                                                                                                       //
.factory('$$Auth', function () {                                                                          //
  var Accounts = (Package['accounts-base'] || {}).Accounts;                                               // 15
                                                                                                          //
  if (!Accounts) throw Error('`angular-meteor.auth` module requires `accounts-base` package, ' + 'please run `meteor add accounts-base` before use');
                                                                                                          //
  var errors = {                                                                                          // 22
    required: 'AUTH_REQUIRED',                                                                            // 23
    forbidden: 'FORBIDDEN'                                                                                // 24
  };                                                                                                      //
                                                                                                          //
  function $$Auth() {                                                                                     // 27
    var vm = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];                   //
                                                                                                          //
    // reset auth properties                                                                              //
    this.autorun(function () {                                                                            // 29
      vm.currentUser = Accounts.user();                                                                   // 30
      vm.currentUserId = Accounts.userId();                                                               // 31
      vm.isLoggingIn = Accounts.loggingIn();                                                              // 32
    });                                                                                                   //
  }                                                                                                       //
                                                                                                          //
  // Waits for user to finish the login process. Gets an optional validation function which               //
  // will validate if the current user is valid or not. Returns a promise which will be rejected          //
  // once login has failed or user is not valid, otherwise it will be resolved with the current           //
  // user                                                                                                 //
  $$Auth.$awaitUser = function (validate) {                                                               // 40
    var _this = this;                                                                                     //
                                                                                                          //
    validate = validate ? this.$bindToContext(validate) : function () {                                   // 41
      return true;                                                                                        // 41
    };                                                                                                    //
                                                                                                          //
    if (!_.isFunction(validate)) throw Error('argument 1 must be a function');                            // 43
                                                                                                          //
    var deferred = this.$$defer();                                                                        // 46
                                                                                                          //
    var computation = Meteor.autorun(function (computation) {                                             // 48
      if (_this.getReactively('isLoggingIn')) return;                                                     // 49
      // Stop computation once a user has logged in                                                       //
      computation.stop();                                                                                 // 51
                                                                                                          //
      var user = _this.currentUser;                                                                       // 53
      if (!user) return deferred.reject(errors.required);                                                 // 54
                                                                                                          //
      var isValid = validate(user);                                                                       // 56
      // Resolve the promise if validation has passed                                                     //
      if (isValid == true) return deferred.resolve(user);                                                 // 58
                                                                                                          //
      var error = undefined;                                                                              // 60
                                                                                                          //
      if (_.isString(isValid) || isValid instanceof Error) error = isValid;else error = errors.forbidden;
                                                                                                          //
      deferred.reject(error);                                                                             // 67
    });                                                                                                   //
                                                                                                          //
    var promise = deferred.promise;                                                                       // 70
    promise.stop = computation.stop.bind(computation);                                                    // 71
    return promise;                                                                                       // 72
  };                                                                                                      //
                                                                                                          //
  // API v0.2.0                                                                                           //
  // Aliases with small modificatons                                                                      //
                                                                                                          //
  // No validation                                                                                        //
  // Silent error                                                                                         //
  $$Auth.$waitForUser = function () {                                                                     // 80
    // Silent error                                                                                       //
    return this.$awaitUser()['catch']();                                                                  // 82
  };                                                                                                      //
                                                                                                          //
  // No validation                                                                                        //
  $$Auth.$requireUser = function () {                                                                     // 86
    return this.$awaitUser();                                                                             // 87
  };                                                                                                      //
                                                                                                          //
  // Full functionality                                                                                   //
  $$Auth.$requireValidUser = function () {                                                                // 91
    return this.$awaitUser.apply(this, arguments);                                                        // 92
  };                                                                                                      //
                                                                                                          //
  return $$Auth;                                                                                          // 95
})                                                                                                        //
                                                                                                          //
/*                                                                                                        //
  External service for syntactic sugare.                                                                  //
  Originally created as UI-router's resolve handler.                                                      //
 */                                                                                                       //
.service('$auth', ['$rootScope', '$$Auth', function ($rootScope, $$Auth) {                                //
  var _this2 = this;                                                                                      //
                                                                                                          //
  // Note that services are initialized once we call them which means that the mixin                      //
  // will be available by then                                                                            //
  _.keys($$Auth).forEach(function (k) {                                                                   // 110
    var v = $$Auth[k];                                                                                    // 111
    var stripped = k.substr(1);                                                                           // 112
    // Not using bind() so it would be testable                                                           //
    _this2[stripped] = function () {                                                                      // 114
      return $rootScope[k].apply($rootScope, arguments);                                                  //
    };                                                                                                    //
  });                                                                                                     //
}]).run(['$Mixer', '$$Auth', function ($Mixer, $$Auth) {                                                  //
  $Mixer.mixin($$Auth);                                                                                   // 124
}]);                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['angular-meteor-auth'] = {};

})();
