describe('angular-meteor.auth', function() {
  beforeEach(angular.mock.module('angular-meteor'));
  beforeEach(angular.mock.module('angular-meteor.auth'));

  var Accounts = Package['accounts-base'].Accounts;
  var $rootScope;
  var $auth;

  beforeEach(angular.mock.inject(function(_$rootScope_, _$auth_) {
    $rootScope = _$rootScope_;
    $auth = _$auth_;
  }));

  describe('$$Auth', function() {
    afterEach(function(done) {
      Accounts.logout(done);
    });

    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUserId).toBeDefined();
      expect(scope.isLoggingIn).toBeDefined();
      expect(scope.$awaitUser).toEqual(jasmine.any(Function));
    });

    describe('currentUser', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.currentUser).toEqual(null);

        var login = Accounts.login('dummy_user');

        login.onEnd(function() {
          expect(scope.currentUser).toEqual({ username: 'dummy_user' });
          done();
        });
      });
    });

    describe('currentUserId', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.currentUserId).toEqual(null);

        var login = Accounts.login('dummy_user');

        login.onEnd(function() {
          expect(scope.currentUserId).toEqual(Accounts.userId());
          done();
        });
      })
    });

    describe('isLoggingIn', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.isLoggingIn).toBe(false);

        Accounts.login('dummy_user', function() {
          expect(scope.isLoggingIn).toBe(true);

          Accounts.logout(function() {
            expect(scope.isLoggingIn).toBe(false);
            done();
          });
        });
      });
    });

    describe('$awaitUser()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
        spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should return a promise and reject it once user is not logged in', function(done) {
        scope.$awaitUser().catch(function(err) {
          expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
          expect(err).toEqual('AUTH_REQUIRED');
          done();
        });

        scope.$$deferredDigest();
      });

      it('should return a promise and resolve it once a valid user is logged in', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(true);

          scope.$awaitUser(spy).then(function(user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(user.username).toEqual('tempUser');
            done();
          });
        });

        login.onEnd(function() {;
          scope.$$deferredDigest();
        });
      });

      it('should return a promise and reject it once an invalid user is logged in', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('FORBIDDEN');
            done();
          });
        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });

      it('should return a custom validation error if validation method returns a string', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue('NOT_ALLOWED');

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });
        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });

      it('should return a custom validation error if validation method returns an error', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var err = Error();
          var spy = jasmine.createSpy().and.returnValue(err);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual(err);
            done();
          });

        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });

      it('should not autorun once stopped', function(done) {
        var autorun = Tracker.autorun;
        Tracker.autorun = done.fail;

        var promise = scope.$awaitUser();
        Tracker.autorun = autorun;

        promise.stop();
        setTimeout(done);
      });

      it('should not cancel subscriptions once user has logged in', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(true);

          scope.$awaitUser(spy).then(function() {
            scope.subscribe('dummy', angular.noop, done);
          });

        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });

      it('should keep waiting for user once the outer computation has been stopped', function(done) {
        login();

        function login() {
          var login = Accounts.login('tempUser');

          login.onStart(function() {
            awaitUser();
          });

          login.onEnd(function() {
            scope.$$deferredDigest();
          });
        }

        function awaitUser() {
          var c = Tracker.autorun(function(c) {
            Tracker.onInvalidate(function() {
              c.stop();
            });

            scope.$awaitUser().then(done);
          });

          c.invalidate();
        }
      });
    });

    describe('$waitForUser()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
        spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call $awaitUser() and ignore validation function', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);
          scope.$waitForUser(spy).then(done);
        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });

      it('should call $awaitUser() and ignore error', function(done) {
        scope.$waitForUser()
          .then(angular.noop, done.fail)
          .catch(done.fail)
          .finally(done);

        scope.$$deferredDigest();
      });
    });

    describe('$requireUser()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
        spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call $awaitUser() and ignore validation function', function(done) {
        var login = Accounts.login('tempUser');

        login.onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);
          scope.$waitForUser(spy).then(done);
        });

        login.onEnd(function() {
          scope.$$deferredDigest();
        });
      });
    });

    describe('$requireValidUser()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
        spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call $awaitUser() as is', function() {
        var handler = spyOn(scope, '$awaitUser').and.returnValue('result');

        scope.$requireValidUser(1, 2, 3);
        expect(handler).toHaveBeenCalled();
        expect(handler.calls.mostRecent().args).toEqual([1, 2, 3]);
        expect(handler.calls.mostRecent().returnValue).toEqual('result');
      });
    });
  });

  describe('$auth', function() {
    ['$waitForUser', '$requireUser', '$requireValidUser', '$awaitUser']
    .forEach(function(methodName) {
      var stripped = methodName.substr(1);

      describe(stripped, function() {
        it('should call $$Auth.' + methodName + '() with $rootScope as context', function() {
          var handler = spyOn($rootScope, methodName).and.returnValue('result');

          $auth[stripped](1, 2, 3);
          expect(handler).toHaveBeenCalled();
          expect(handler.calls.mostRecent().args).toEqual([1, 2, 3]);
          expect(handler.calls.mostRecent().returnValue).toEqual('result');
        });
      });
    });
  });
});