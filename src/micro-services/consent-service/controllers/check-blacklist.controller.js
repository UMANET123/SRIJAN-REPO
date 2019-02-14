const {checkBlacklist} = require('../models/blacklist.model');

module.exports = (req, res) => {
    //  check app is blacklisted
    checkBlacklist(req.params, (status, response) => {
        return res.status(status).send(response);
    });
}