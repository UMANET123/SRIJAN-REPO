const {getConsentList} = require('../models/consent.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    let {limit, page, appname} = req.query;
    getConsentList(subscriber_id, limit, page, appname, (status, response) => {
        res.status(status).send(response);
    });
};