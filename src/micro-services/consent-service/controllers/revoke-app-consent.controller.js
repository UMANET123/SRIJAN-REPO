const {revokeSingleConsent} = require('../models/revoke.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    let {app_id, developer_id} = req.body;
    // reject request for absense of any above elements
    if ( !subscriber_id || !app_id || !developer_id) return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
     revokeSingleConsent({subscriber_id, app_id, developer_id}, (status, response)=> {
        return res.status(status).send(response);
     }); 

}