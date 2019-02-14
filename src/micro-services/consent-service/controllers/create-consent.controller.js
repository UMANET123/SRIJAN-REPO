const {createConsent} = require('../models/consent.model');

module.exports = function (req, res) {
    let {subscriber_id, app_id, developer_id, scopes, appname} = req.body;
    if ( !subscriber_id || !app_id || !developer_id || !scopes || !appname) {
        return res.status(400).send({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          });
    }
    createConsent(req.body, (status, response) => {
        return res.status(status).send(response);
    });
}