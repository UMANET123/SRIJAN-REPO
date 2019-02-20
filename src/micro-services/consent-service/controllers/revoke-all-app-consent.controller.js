const {revokeAll} = require('../models/revoke.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.body;
    //  throw bad request for absence of parameter
    if (!subscriber_id) return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
    revokeAll(subscriber_id,(status, response) => {
        return res.status(status).send(response);
    });
    
}