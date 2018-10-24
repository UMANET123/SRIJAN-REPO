const identity = require('../models/identity.model');

module.exports = function (req, res) {
    let address = req.body.address;
    let email = req.body.email;
    identity.set(address, (otp)=>{
        res.status(201).send({
            otp: otp, 
            address: address
        })
    })
}