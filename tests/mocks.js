/*
  Note that meteor's accounts system requires a minimum interval of 10 seconds between the log-ins
  which costs some precious time and may cause unexpected behaviours. The following stubs simulate
  an accounts system and fixes that problem.
 */
Package['accounts-base'] = function() {
  var Accounts = {};

  var vals = {
    user: null,
    userId: null,
    loggingIn: false
  };

  var deps = _.keys(vals).reduce(function(deps, k) {
    deps[k] = new Tracker.Dependency();

    Accounts[k] = function() {
      deps[k].depend();
      return vals[k];
    };

    return deps
  }, {});

  Accounts.login = function(username, onStartCb, onEndCb) {
    const onStartHook = new Hook({
      debugPrintExceptions: 'on login start callback'
    });

    const onEndHook = new Hook({
      debugPrintExceptions: 'on login end callback'
    });

    if (_.isFunction(onStartCb)) onStartHook.register(onStartCb);
    if (_.isFunction(onEndCb)) onEndHook.register(onEndCb);

    setTimeout(function() {
      vals.loggingIn = true;
      deps.loggingIn.changed();

      Tracker.afterFlush(function() {
        onStartHook.each(function(cb) { cb() });

        setTimeout(function() {
          vals.user = { username: username };
          vals.userId = new Mongo.ObjectID();
          vals.loggingIn = false;

          deps.user.changed();
          deps.userId.changed();
          deps.loggingIn.changed();

          Tracker.afterFlush(function() {
            onEndHook.each(function(cb) { cb() });
          });
        });
      })
    });

    return {
      onStart: onStartHook.register.bind(onStartHook),
      onEnd: onEndHook.register.bind(onEndHook)
    };
  };

  Accounts.logout = function(cb) {
    setTimeout(function() {
      vals.user = null;
      vals.userId = null;
      vals.loggingIn = false;

      deps.user.changed();
      deps.userId.changed();
      deps.loggingIn.changed();

      Tracker.afterFlush(cb);
    });
  };

  _.extend(Meteor, Accounts);

  return {
    Accounts: Accounts
  };
}.call(this);