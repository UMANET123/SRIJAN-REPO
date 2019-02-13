const {createConsent} = require('../models/identity.model');

module.exports = function (req, res) {
    let {subscriber_id, access_token, app_id, developer_id, scopes, appname} = req.body;
    if (!access_token || !subscriber_id || !app_id || !developer_id || !scopes || !appname) {
        return res.status(400).send({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          });
    }
    createConsent(req.body, (status, response) => {
        res.status(status).send(response);
    });
}