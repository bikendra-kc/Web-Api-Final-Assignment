const express = require("express");
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Listening on port ${PORT}`);
});
const db = require('./db');
db.connect();
app.post(
    "/auth/signup",
    passport.authenticate('local-signup', { session: false }),
    (req, res, next) => {
    // sign up
    res.json({
    user: req.user,
    });
    }
    );

    app.post(
        "/auth/login",
        passport.authenticate('local-login', { session: false }),
        (req, res, next) => {
        // login
        res.json({
        user: req.user,
        });
        }
        );

        app.post(
            "/auth/login",
            passport.authenticate('local-login', { session: false }),
            (req, res, next) => {
            // login
            jwt.sign({user: req.user}, 'secretKey', {expiresIn: '1h'}, (err, token) => {
            if(err) {
                return res.json({
                message: "Failed to login",
                token: null,
            });
            }
            res.json({
            token
            });
            })
            }
            );

            app.get(
                "/user/protected",
                passport.authenticate("jwt", { session: false }),
                (req, res, next) => {
                res.json({user: req.user});
                }
                );