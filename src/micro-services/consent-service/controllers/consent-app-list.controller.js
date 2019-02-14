const {getConsentList} = require('../models/consent.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    if ( !subscriber_id ) return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
    getConsentList(subscriber_id, (status, response) => {
        res.status(status).send(response);
    });
};