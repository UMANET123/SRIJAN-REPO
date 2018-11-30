const bypassModel = require("../../models/bypass.model");
setTimeout(() => {
  bypassModel.generateMockData();
}, 500);

exports.status = function(req, res) {
  let id = req.body.client_id;
  let scope = req.body.scope;

  if (id.length == 0) {
    return res.status(400).send({
      error: "id not present"
    });
  }

  bypassModel.get(id, (err, data) => {
    if (data) {
      data = JSON.parse(data);
      if (data.indexOf(scope) != -1) {
        return res.status(200).send({
          bypass: "active"
        });
      } else {
        return res.status(404).send({
          bypass: "inactive"
        });
      }
    } else {
      return res.status(404).send({
        bypass: "inactive"
      });
    }
  });

  // return res.status(404).send({
  //     bypass: 'inactive'
  // });
};

exports.add = function(req, res) {
  const clientId = req.body.client_id;
  const scopes = req.body.scopes;

  if (!clientId || !scopes) {
    return res.status(400).send({
      error: "client_id or scopes missing"
    });
  } else {
    // Check if client_id already whitelisted

    bypassModel.get(clientId, (err, data) => {
      if (data) {
        return res.status(400).send({
          error: "client_id already whitelisted"
        });
      } else {
        bypassModel.set(clientId, JSON.stringify(scopes));
        return res.status(201).send({
          message: "success"
        });
      }
    });
  }
};

exports.getAll = function(req, res) {
  bypassModel.getAll((err, data) => {
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send({
        error: "No data available"
      });
    }
  });
};

exports.delete = function(req, res) {
  const clientId = req.body.client_id;
  if (!clientId) {
    return res.status(400).send({ error: "client_id missing" });
  } else {
    bypassModel.remove(clientId);
    return res.status(200).send({
      message: "success"
    });
  }
};

exports.update = function(req, res) {
  const clientId = req.body.client_id;
  const scopes = req.body.scopes;

  if (!clientId || !scopes) {
    return res.status(400).send({ error: "client_id or scopes missing" });
  } else {
    // Check if client_id already whitelisted

    bypassModel.get(clientId, (err, data) => {
      if (!data) {
        return res.status(400).send({
          error: "client_id not whitelisted"
        });
      } else {
        bypassModel.set(clientId, JSON.stringify(scopes));
        return res.status(201).send({ message: "success" });
      }
    });
  }
};

exports.get = function(req, res) {
  let id = req.params.client_id;

  if (id.length == 0) {
    return res.status(400).send({
      error: "client_id not present"
    });
  }

  bypassModel.get(id, (err, data) => {
    if (data) {
      data = JSON.parse(data);
      let payload = {
        client_id: id,
        scopes: data
      };
      return res.status(200).send(payload);
    } else {
      return res.status(404).send({
        error: "client_id not found"
      });
    }
  });
};
