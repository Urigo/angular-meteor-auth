describe('angular-meteor.auth', function() {
  beforeEach(angular.mock.module('angular-meteor'));
  beforeEach(angular.mock.module('angular-meteor.auth'));

  var Accounts = Package['accounts-base'].Accounts;
  var $rootScope;
  var $q;
  var $auth;

  beforeEach(angular.mock.inject(function(_$rootScope_, _$q_, _$auth_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
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

        Accounts.login('dummy_user').onEnd(function() {
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

        Accounts.login('dummy_user').onEnd(function() {
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

        scope.$$afterFlush('$$throttledDigest');
      });

      it('should return a promise and resolve it once a valid user is logged in', function(done) {
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(true);

          scope.$awaitUser(spy).then(function(user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(user.username).toEqual('tempUser');
            done();
          });
        }).onEnd(function() {;
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a promise and reject it once an invalid user is logged in', function(done) {
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('FORBIDDEN');
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method returns a string', function(done) {
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue('NOT_ALLOWED');

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method returns an error', function(done) {
        Accounts.login('tempUser').onStart(function() {
          var err = Error();
          var spy = jasmine.createSpy().and.returnValue(err);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual(err);
            done();
          });

        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should succeed if validation method asynchronously returns true', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue($q.resolve(true));

          scope.$awaitUser(spy).then(function() {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method asynchronously resolves to a string', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue($q.resolve('NOT_ALLOWED'));

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method asynchronously resolves to an error', function(done) {
        Accounts.login('tempUser', function() {
          var err = Error();
          var spy = jasmine.createSpy().and.returnValue($q.resolve(err));

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual(err);
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method asynchronously rejects to a string', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue($q.reject('NOT_ALLOWED'));

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should return a custom validation error if validation method asynchronously rejects to an error', function(done) {
        Accounts.login('tempUser', function() {
          var err = Error();
          var spy = jasmine.createSpy().and.returnValue($q.reject(err));

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual(err);
            done();
          });
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should not fulfill promise once auto computation has been stopped', function() {
        var promise = scope.$awaitUser();
        expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
        promise.stop();
      });

      it('should not cancel subscriptions once user has logged in', function(done) {
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(true);

          scope.$awaitUser(spy).then(function() {
            scope.subscribe('dummy', angular.noop, done);
          });

        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
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
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);
          scope.$waitForUser(spy).then(done);
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
        });
      });

      it('should call $awaitUser() and ignore error', function(done) {
        scope.$waitForUser()
          .then(angular.noop, done.fail)
          .catch(done.fail)
          .finally(done);

        scope.$$afterFlush('$$throttledDigest');
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
        Accounts.login('tempUser').onStart(function() {
          var spy = jasmine.createSpy().and.returnValue(false);
          scope.$waitForUser(spy).then(done);
        }).onEnd(function() {
          scope.$$afterFlush('$$throttledDigest');
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
