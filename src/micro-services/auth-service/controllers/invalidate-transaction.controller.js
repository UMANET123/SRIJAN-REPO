const {invalidateTransaction} = require('../models/transaction.model');

module.exports = (req, res) => {
    //  invoke validate transaction model
    invalidateTransaction(req.params, req.body, (status, response) => {
        res.status(status).send(response);
    });
    
}