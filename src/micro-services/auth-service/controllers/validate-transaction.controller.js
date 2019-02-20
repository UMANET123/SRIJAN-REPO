const {validateTransaction} = require('../models/transaction.model');

module.exports = (req, res) => {
    //  invoke validate transaction model
    validateTransaction(req.params, (status, response) => {
        res.status(status).send(response);
    });
    
}