const {getSubscriberApps} = require('../models/subscriber.model');
module.exports = (req, res) => {
    let {subscriber_id} = req.params;
    let {appname} = req.query;
    getSubscriberApps(subscriber_id, appname, (status, response)=>{
        return res.status(status).send(response);
    });
}