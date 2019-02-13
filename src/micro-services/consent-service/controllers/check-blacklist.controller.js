const {checkBlacklist} = require('../models/identity.model');

module.exports = (req, res) => {
    let {subscriber_id, app_id} = req.params;
    if ( !subscriber_id || !app_id ) {
        return res.status(400).send({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          });
    }
    checkBlacklist(req.body, (status, response) => {
        res.status(status).send(response);
    });
}