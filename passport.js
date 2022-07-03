const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models');
const passportJWT = require('passport-jwt');
const config = require('getconfig');

const Users = Models.user;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, (username, password, callback) => {
    console.log(`Authenticating ${username} with password ${password}`);
    Users.findOne({username: username}, (err, user) => {
        if (err) {
            console.log('Mongo threw an error');
            console.log(err);
            return callback(err);
        }

        if (!user || !user.validatePassword(password)) {
            console.log('User does not exist');
            return callback(null, false, {message: 'Incorrect username password combination'});
        }

        return callback(null, user);
    });
}));

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
