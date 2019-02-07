const {generateTOtp} = require('../models/identity.model');

module.exports = function (req, res) {
    let address = req.body.address ? req.body.address : req.body.email;
    let {app_id, developer_id} = req.body;
    generateTOtp(address, app_id,developer_id , (otp, status)=>{
        res.status(status).send({
            otp: otp, 
            address: address
        });
    });
  
}