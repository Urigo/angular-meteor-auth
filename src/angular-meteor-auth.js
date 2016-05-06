const name = 'angular-meteor.auth';
export default name;

angular.module(name, [
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.core',
  'angular-meteor.view-model',
  'angular-meteor.reactive'
])

/*
  A mixin which provides us with authentication related methods and properties.
  This mixin comes in a seperate package called `angular-meteor-auth`. Note that `accounts-base`
  package needs to be installed in order for this module to work, otherwise an error will be thrown.
 */
.factory('$$Auth', [
  '$Mixer',
  '$log',

function($Mixer, $log) {
  const Accounts = (Package['accounts-base'] || {}).Accounts;

  if (!Accounts) {
    throw Error(
      '`angular-meteor.auth` module requires `accounts-base` package, ' +
      'please run `meteor add accounts-base` before use'
    );
  }

  const ERRORS = {
    REQUIRED: 'AUTH_REQUIRED',
    FORBIDDEN: 'FORBIDDEN'
  };

  function $$Auth(vm = this) {
    // Reset auth properties
    this.autorun(() => {
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
  $$Auth.$awaitUser = function(validate) {
    validate = validate ? this.$bindToContext($Mixer.caller, validate) : () => true;

    if (!_.isFunction(validate)) {
      throw Error('argument 1 must be a function');
    }

    return this.$$autoPromise(({ resolve, reject }, computation) => {
      if (this.getReactively('isLoggingIn')) return;
      // Stop computation once a user has logged in
      computation.stop();

      if (!this.currentUser) return reject(ERRORS.REQUIRED);

      const isValid = validate(this.currentUser);
      // Resolve the promise if validation has passed
      if (isValid === true) return resolve(this.currentUser);

      let error;

      if (_.isString(isValid) || isValid instanceof Error) {
        error = isValid;
      }
      else {
        error = ERRORS.FORBIDDEN;
      }

      return reject(error);
    });
  };

  // API v0.2.0
  // Aliases with small modificatons

  // No validation
  // Silent error
  $$Auth.$waitForUser = function() {
    // Silent error
    return this.$awaitUser().catch((err) => {
      $log.debug(`user login has failed (${err})`);
    });
  };

  // No validation
  $$Auth.$requireUser = function() {
    return this.$awaitUser();
  };

  // Full functionality
  $$Auth.$requireValidUser = function(...args) {
    return this.$awaitUser(...args);
  };

  return $$Auth;
}])

/*
  External service for syntactic sugare.
  Originally created as UI-router's resolve handler.
 */
.service('$auth', [
  '$rootScope',
  '$$Auth',

function($rootScope, $$Auth) {
  // Note that services are initialized once we call them which means that the mixin
  // will be available by then
  _.keys($$Auth).forEach((k) => {
    const stripped = k.substr(1);
    // Not using bind() so it would be testable
    this[stripped] = (...args) => $rootScope[k](...args);
  });
}])

.run([
  '$Mixer',
  '$$Auth',

function($Mixer, $$Auth) {
  $Mixer.mixin($$Auth);
}]);
