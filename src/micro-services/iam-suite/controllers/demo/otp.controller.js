// Handler for Consent page
/**
 * TODO
 * - Display errors for wrong OTP
 */
exports.get = function (req, res) {
    var data = {
        client_id: req.query.client_id,
        scope: req.query.scope.split(","),
        state: req.query.state,
        redirect_uri: req.query.redirect_uri,
        app: req.query.app
    };
    res.render("demo/otp", {
        data: data
    });
};