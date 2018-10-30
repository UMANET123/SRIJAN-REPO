//Handler for Login
exports.get = function (req, res) {
    var data = {
        client_id: req.query.client_id,
        scope: req.query.scope,
        state: req.query.state,
        redirect_uri: req.query.redirect_uri,
        appName: req.query.app,
        appProducts: req.query.appProducts
    };

    var result = req.query.status ?
        "Login failed. Please check your email/password and try again" :
        undefined;
    res.render("demo/login", {
        result: result,
        data: data
    });
};