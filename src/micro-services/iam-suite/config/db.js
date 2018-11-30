const redis = require("redis");
const async = require("async");

var state = {
  db: null
};

exports.create = function (opts, done) {
  if (!state.db) {
    state.db = redis.createClient(opts);
    done(null);
  } else {
    var error = "Client Already Created";
    done(error);
  }
};

exports.get = function (key, done) {
  state.db.get(key, (err, data) => {
    if (data) {
      done(null, data);
    } else {
      done("Not found", null);
    }
  });
};

exports.set = function (key, data, opts = null) {
  if (!opts) {
    state.db.set(key, data);
  } else {
    state.db.set(key, data, opts.option, opts.value);
  }
};

exports.sadd = function (key, data) {
  state.db.sadd(key, data);
}

exports.srem = function (key, data) {
  state.db.srem(key, data);
}

exports.getAllClients = function (done) {
  state.db.smembers("clientid", (err, keys) => {
    if (keys) {
      let payload = [];
      async.each(
        keys,
        (key, cb) => {
          state.db.get(key, (err, data) => {
            payload.push({
              client_id: key,
              scopes: JSON.parse(data)
            });
            cb();
          });
        },
        err => {
          if (err) {
            console.log(err);
            done(err, null);
          } else {
            done(null, payload);
          }
        }
      );
    } else {
      done("Not found", null);
    }
  });
};

exports.remove = function (key) {
  state.db.del(key);
};

exports.update = function (key, data, opts = null) {
  if (!opts) {
    state.db.set(key, data);
  } else {
    state.db.set(key, data, opts.option, opts.value);
  }
};