let mockAPIid = [
    "1234598329kadhfa",
    "haksdha3284942",
    "nmasdk239829842",
    "093284092jlajdlahcb",
    "lajdas0938204823ksajhd",
    "W57Oad3NUXvAEdg0OcrAgf4p1w3heJoR",
    "M63LZP7Ge68hCMfeE9czOSQQT9qdttKt",
    "wFE8AN4nN8a6GPety5jjdJzqjUwSH8PH"
];

exports.get = function (req, res) {
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
}