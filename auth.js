const JWTSecret = require('getconfig').JWTSecret;

const jwt = require('jsonwebtoken');
const passport = require('passport');

// My passport.js
require('./passport');

/**
 * @name generateToken
 * @description Create a signed JWT for a user
 * @param {User} user - The user to make a JWT for (Do not send a password in the object, it will be visible)
 * @returns {string} a signed JWT
 */
const generateToken = function(user) {
    return jwt.sign(user, JWTSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256',
    });
};


// Add login endpoint
module.exports = (router) => {
    /**
     * @name POST /login
     * @description Obtain a JWT for use in endpoints that require it
     * @kind function
     * @param {string} username a username to log in
     * @param {string} password plaintext password for the user
     * @returns {object} Object with JWT:
     * @example
     * // example response body
     * {
     *   token: string,
     * }
     */
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
                    email: user.email,
                    _id: user._id,
                };
                const token = generateToken(strippedUser);

                return res.json({
                    token,
                });
            });
        })(req, res);
    });
};
