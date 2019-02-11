const identity = require('../models/identity.model');

module.exports = function (req, res) {
    let address = req.body.address ? req.body.address : req.body.email;
    identity.generateHotp(address, (error, data) => {
        if (error) {
            res.status(500)
                .send({message: error})

        } else {
            res.writeHead(200, {
                'Content-Type': 'application/base64'
            });
            return res.end(data);
        }
    })
}