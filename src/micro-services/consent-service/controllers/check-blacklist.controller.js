const {checkBlacklist} = require('../models/identity.model');

module.exports = (req, res) => {
    //  check app is blacklisted
    checkBlacklist(req.params, (status, response) => {
        return res.status(status).send(response);
    });
}