const {getConsentList} = require('../models/consent.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    let {limit, page, appname, order} = req.query;
    getConsentList(subscriber_id, limit, page, appname,order, (status, response) => {
        return res.status(status).send(response);
    });
};