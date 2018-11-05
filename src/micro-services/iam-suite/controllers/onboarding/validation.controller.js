const user = require('../../models/user.model');

exports.get = function (req, res) {
    
    let email = req.query.email;
    user.get(email, (err, data) => {
        if (data) {
            res.status(200).send({
                message: 'success'
            })
        } else {
            res.status(404).send({
                error: 'user does not exist'
            });
        }
    });
}