const JWTSecret = require('getconfig').JWTSecret;

const jwt = require('jsonwebtoken');
const passport = require('passport');

// My passport.js
require('./passport');

const generateToken = function(user) {
    return jwt.sign(user, JWTSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256',
    });
};


// Add login endpoint
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error) {
                console.log('Error during authentication');
                console.log('Error: ', error);
                console.log('User: ', user);
                return res.status(400).json({
                    message: 'Could not authenticate',
                    user,
                    error,
                    info,
                });
            } else if (!user) {
                return res.status(400).json({
                    message: 'Could not authenticate',
                    user,
                    error,
                    info,
                });
            }

            req.login(user, {session: false}, (error) => {
                if (error) res.send(error);
                console.log('Generating JWT for user');
                // Reduce information in JWT (no password hashes)
                // Passport.js JWTStrategy pulls full user via db for use in router endpoints
                const strippedUser = {
                    username: user.username,
                    _id: user._id,
                };
                const token = generateToken(strippedUser.toJSON());

                return res.json({
                    token,
                });
            });
        })(req, res);
    });
};
