module.exports = function (req, res, next) {
    if (req.method != "POST") {
        return res.status(405).send({
            error: "Method not allowed"
        });
    }
    next();
}