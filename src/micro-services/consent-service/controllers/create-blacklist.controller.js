const {createBlackList} = require('../models/identity.model');

module.exports = (req, res) => {
    let {subscriber_id, app_id , developer_id} = req.body;
    if ( !subscriber_id || !app_id || ! developer_id) {
        return res.status(400).send({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          });
    }
    createBlackList(req.body, (status, response) => {
        return res.status(status).send(response);
    });
}