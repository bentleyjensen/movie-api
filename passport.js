const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models');
const passportJWT = require('passport-jwt');
const config = require('getconfig');

const Users = Models.user;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

/**
 * @name Passport Strategy: LocalStrategy
 * @description Define how to auth a user with username and password
 * @kind constant
 */
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, (username, password, callback) => {
    Users.findOne({username: username.toLowerCase()}, (err, user) => {
        if (err) {
            console.log('Mongo threw an error');
            console.log(err);
            return callback(err);
        }

        if (!user || !user.validatePassword(password)) {
            const errObj = { message: 'Incorrect username password combination' };
            console.log('User does not exist');
            return callback(errObj, false, errObj);
        }

        return callback(null, user);
    });
}));

/**
 * @name Passport Strategy: JWTStrategy
 * @description Define how to auth a user when provided a JWT
 * @kind constant
 */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWTSecret,
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((err) => {
            console.log(err);
        });
}));
