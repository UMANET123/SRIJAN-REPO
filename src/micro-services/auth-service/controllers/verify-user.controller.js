const identity = require('../models/identity.model');
module.exports = function (req, res) {
    let {msisdn, subscriber_id} = req.body;
    if ((!msisdn && !subscriber_id) || (msisdn && subscriber_id)) return res.status(400).send({status: 'Please enter either phone_no or uuid to validate'});
    
    identity.verifyUser(msisdn, subscriber_id, (response, status) => {
        console.log();
        let key = Object.keys(response)[0];
        if(key) {
            switch(key){
                case 'uuid': 

                    return res.status(status).send({subscriber_id: response[key]});
                    break;
                case 'phone_no':
                    return res.status(status).send({msisdn: response[key]});
                    break;
            }
        }
        return res.status(status).send(response);
    });
}