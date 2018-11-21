const db = require("../config/db");
const get = function(key, cb) {
  db.get(key, cb);
};

const set = function(key, data) {
  db.set(key, data);
};

const getAll = function(cb) {
  db.getAll(cb);
};

const remove = function(key) {
  db.remove(key);
};

exports.generateMockData = function() {
  let mockAPIid = [
    {
      client_id: "1234598329kadhfa",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "haksdha3284942",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "nmasdk239829842",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "093284092jlajdlahcb",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "lajdas0938204823ksajhd",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "W57Oad3NUXvAEdg0OcrAgf4p1w3heJoR",
      scopes: ["ABC", "BCD"]
    },
    {
      client_id: "M63LZP7Ge68hCMfeE9czOSQQT9qdttKt",
      scopes: ["SUBSCRIBER", "DEVICE", "CONTACT", "LOCATION"]
    },
    {
      client_id: "wFE8AN4nN8a6GPety5jjdJzqjUwSH8PH",
      scopes: ["LOCATION"]
    }
  ];

  mockAPIid.map(data => {
    set(data.client_id, JSON.stringify(data.scopes));
    get;
  });
};

exports.set = set;
exports.get = get;
exports.getAll = getAll;
exports.remove = remove;
