const {verifyUser} = require('../models/auth.model');

module.exports = function (req, res) {
    let {msisdn, subscriber_id} = req.body;
    if ((!msisdn && !subscriber_id) || (msisdn && subscriber_id)) return res.status(400).send({status: 'Enter msisdn or uuid needed to validate'});
    
    verifyUser(msisdn, subscriber_id, (response, status) => {
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