const redis = require('redis');

var state = {
    db: null
}

exports.create = function (opts, done) {
    if (!state.db) {
        state.db = redis.createClient(opts)
        done(null);
    } else {
        var error = 'Client Already Created'
        done(error)
    }
}

exports.get = function (key, done) {
    state.db.get(key, (err, data) => {
        if (data) {
            done(null, data);
        } else {
            done("Not found", null);
        }
    })
}

exports.set = function (key, data, opts=null) {
    if (!opts) {
        state.db.set(key, data, redis.print);
    } else {
        state.db.set(key, data, opts.option, opts.value);
    }
}