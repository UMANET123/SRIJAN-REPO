const bypassModel = require('../../models/bypass.model');
setTimeout(() => {
    bypassModel.generateMockData();
}, 500)

exports.post = function (req, res) {
    let id = req.body.client_id;
    let scope = req.body.scope;

    if (id.length == 0) {
        return res.status(400).send({
            error: 'id not present'
        });
    }

    if (/^\d+$/.test(id)) {
        return res.status(400).send({
            error: 'id invalid'
        });
    }


    bypassModel.get(id, ((err, data) => {
        console.log(id);
        console.log(data);
        console.log(scope);
        if (data) {

            data = JSON.parse(data);
            if (data.indexOf(scope) != -1) {
                return res.status(200).send({
                    bypass: 'active'
                });
            } else {
                return res.status(404).send({
                    bypass: 'inactive'
                });
            }
        } else {
            return res.status(404).send({
                bypass: 'inactive'
            });
        }
    }))

    // return res.status(404).send({
    //     bypass: 'inactive'
    // });
}