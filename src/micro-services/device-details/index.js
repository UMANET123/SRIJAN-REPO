const express = require("express");
const redis = require("redis");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();

const client = redis.createClient("redis://devicetac");
client.on("connect", err => {
    fs.createReadStream("./imei.csv")
        .pipe(csv())
        .on("data", d => client.set(d.TAC, JSON.stringify(d)));
});

app.get("/details/:type/:id", (req, res) => {
    let type = req.params.type;
    let id = req.params.id;
    if (id.length != 8) {
        return res.status(400).send({
            error: "Invalid TAC"
        });
    } else if (id.length == 8) {
        if (type == "tac") {
            client.get(id, (err, data) => {
                if (data) {
                    return res.send(data);
                } else {
                    return res.send({
                        message: 'No Data Present'
                    });
                }
            });
        } else {
            return res.status(400).send({
                error: "Type not defined"
            });
        }
    }
});

app.listen(5558, () => {
    console.log(`Running on Port 5558`);
});

module.exports = app;