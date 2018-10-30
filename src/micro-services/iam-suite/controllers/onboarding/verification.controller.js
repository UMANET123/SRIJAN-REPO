const user = require('../../models/user.model');
const cryptr = require('../../helpers/encryptdecrypt');

/**
 * TODO
 * Maybe move the update logic into the model?
 */
exports.get = function (req, res) {
    let hash = req.params.hash;
    user.getEmailToken(hash, (err, email) => {
        if (email) {
            if (email == cryptr.decrypt(hash)) {
                user.get(email, (err, data) => {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.emailVerify) {
                            return res.status(400).send({
                                message: 'Email has Already been verified'
                            });
                        } else {
                            data.emailVerify = true;
                            user.update(email, JSON.stringify(data))
                            return res.status(200).send({
                                message: "Email Verification Completed"
                            });
                        }

                    } else {
                        return res.status(400).send({
                            message: "User does not exist"
                        });
                    }

                });
            } else {
                return res.status(400).send({
                    message: "Invalid Request"
                });
            }
        } else {
            return res.status(400).send({
                message: "Verification Window Expired"
            });
        }
    });
}