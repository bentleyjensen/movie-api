const JWTSecret = require('getconfig').JWTSecret;

const jwt = require('jsonwebtoken');
const passport = require('passport');

// My passport.js
require('./passport');

const generateToken = function(user) {
    return jwt.sign(user, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256',
    });
};


// Add login endpoint
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Could not authenticate',
                    user,
                    error,
                    info,
                });
            }

            req.login(user, {session: false}, (error) => {
                if (error) res.send(error);
                const token = generateToken(user.toJSON());

                return res.json({
                    user,
                    token,
                });
            });
        })(req, res);
    });
};
