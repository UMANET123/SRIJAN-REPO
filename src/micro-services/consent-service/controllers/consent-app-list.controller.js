const {getConsentList} = require('../models/consent.model');

module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    let {limit, page, appname, order} = req.query;
    order_types = ['asc','desc']
    if(!order_types.includes(order)){
        return res.status(400).send({
            error_code: 'BadRequest',
            error_message: 'Invalid Parameter'
        })
    }
    getConsentList(subscriber_id, limit, page, appname,order, (status, response) => {
        return res.status(status).send(response);
    });
};