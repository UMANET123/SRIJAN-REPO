const mobileNumberValidator = require('../helpers/mobile-number.validator');
module.exports = function (req, res, next) {
    if (!req.body.address) {
        return res.status(400).send({
            error: "Address Missing"
        });
    }
    if (!mobileNumberValidator(req.body.address)) {
        return res.status(400).send({
            error: "Address Invalid"
        });
    }
    next();
}