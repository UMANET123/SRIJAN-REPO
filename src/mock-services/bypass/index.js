const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5556;

app.use(bodyParser.json());

mockAPIid = [
    "1234598329kadhfa",
    "haksdha3284942",
    "nmasdk239829842",
    "093284092jlajdlahcb",
    "lajdas0938204823ksajhd"
];

app.get('/status/:id', (req, res) => {
    let id = req.params.id;
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

    if (mockAPIid.indexOf(id) != -1) {
        return res.status(200).send({
            bypass: 'active'
        });
    }
    return res.status(404).send({
        bypass: 'inactive'
    });
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

module.exports = app;