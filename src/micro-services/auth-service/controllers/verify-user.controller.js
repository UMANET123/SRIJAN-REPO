const identity = require('../models/identity.model');
module.exports = function (req, res) {
    let {phone_no, uuid} = req.body;
    if ((!phone_no && !uuid) || (phone_no && uuid)) return res.status(400).send({status: 'Please enter either phone_no or uuid to validate'});
    
    identity.verifyUser(phone_no, uuid, (status) => {
        return res.send(status);
    });
}