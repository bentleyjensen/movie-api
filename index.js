require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const {movie, user, director} = require('./models');
const { check, validationResult } = require('express-validator');

// local for testing
// mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true });

// Production
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// File stream to append to log
const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
const logTemplate = ':date[iso] :method :url :status :res[content-length] - :response-time ms';
// Run before Each request handler
app.use(morgan(logTemplate, { stream: logStream }));

app.use(bodyParser.json());

app.use(cors({
    origin: '*',
}));
// const allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://calm-atoll-49801.herokuapp.com/'];
// app.use(cors({
//     origin: (origin, callback) => {
//         console.log(`Request received from origin: ${origin}`);
//         if (!origin || allowedOrigins.indexOf(origin) >= 0) {
//             callback(null, true);
//         } else {
//             const message = `The CORS Policy for this application does not allow access from origin ${origin}`;
//             return callback(new Error(message), false);
//         }
//     },
// }));

// These need bodyParser to have already run when being called
const passport = require('passport');

// bring in login endpoint
require('./auth')(app);
require('./passport');

// Static files served from the /public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile('index.html', { root: `${__dirname}/public` });
});

app.get('/documentation', (req, res) => {
    return res.sendFile('documentation.html', { root: `${__dirname}/public` });
});

app.get('/movies', (req, res) => {
    movie.find()
        .populate('director')
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).send(err);
        });
});

app.get('/movies/title/:title', (req, res) => {
    movie.findOne({title: req.params.title})
        .then((result) => {
            if (result) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send(`Could not find movie with title ${req.params.title}`);
            }
        }).catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send('One or more URL parameters were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            }
        });
});

app.get('/directors', (req, res) => {
    director.find()
        .then((result) => {
            return res.status(200).send(result);
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            return res.status(500).send(err);
        });
});

app.get('/directors/:name', (req, res) => {
    director.findOne({name: req.params.name}).populate('movies')
        .then((result) => {
            if (result) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send(`Could not find director ${req.params.name}`);
            }
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            return res.status(500).send(err);
        });
});

app.get('/genres', (req, res) => {
    movie.distinct('genre')
        .then((result) => {
            return res.status(200).send(result);
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            return res.status(500).send(err);
        });
});

app.get('/movies/genre/:genre', (req, res) => {
    movie.find({ 'genre.name': req.params.genre }).populate('director')
        .then((result) => {
            if (!result || (Array.isArray(result) && result.length === 0)) {
                return res.status(404).send(`Cannot find any movies with genre ${req.params.genre}`);
            } else {
                return res.status(200).send(result);
            }
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            return res.status(500).send(err);
        });
});

app.get('/user/:username', 
    [
        passport.authenticate('jwt', { session: false }),
        check('username', 'Username must be 8-63 characters').isString().isLength({ min: 8, max: 63 }),
        check('username', 'Username must only contain letters, numbers, underscore and dash').isAlphanumeric('en-US', { ignore: '_-' }),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }

        //                          Compare URL        to        JWT
        if (!req.user.username || req.params.username !== req.user.username) {
            return res.status(403).send('URL Parameter and authorized user mismatch');
        }
        user.findOne({ username: req.user.username }, {
            // Hide password in result object
            password: 0,
        })
            .then((result) => {
                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(404).send(`Could not find user with username: ${req.user.username}`);
                }
            }).catch((err) => {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            });
    });

// Expects a full user object:
// {
//    username: ...,
//    password: ...,
//    email: ...,
//    birthdate: ...,
//    favorites: ...,
// }
app.put('/user/:username',
    [
        passport.authenticate('jwt', { session: false }),
        check('username', 'Username must be 8-63 characters').isString().isLength({ min: 8, max: 63 }),
        check('username', 'Username must only contain letters, numbers, underscore and dash').isAlphanumeric('en-US', { ignore: '_-' }),
        check('email', 'Email must be valid').isEmail(),
        check('password', 'Password must be 8 characters and contain an uppercase letter, lowercase letter, a number, and a symbol').isStrongPassword(),
        check('birthdate', 'Birthdate must be a valid date').isISO8601(),
        check('favorites.*', 'Favorites must be MongoID').isMongoId(),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }

        //                          Compare URL        to        JWT
        if (!req.user.username || req.params.username !== req.user.username) {
            return res.status(403).send('URL Parameter and authorized user mismatch');
        }
        const hashedPass = user.hashPassword(req.body.password);
        // Use URL param to find username, and body to update it
        // This enables a user to change their username
        user.findOneAndUpdate({ username: req.params.username },
            {
                $set: {
                    username: req.body.username,
                    password: hashedPass,
                    email: req.body.email,
                    birthdate: req.body.birthdate,
                    favorites: req.body.favorites,
                },
            },
            {
                // Return the post-update object
                new: true,
                // Hide password in result
                projection: { password: 0 },
            })
            .then((result) => {
                if (!result) {
                    // With JWT auth, this should never happen, but leave it here just in case
                    return res.status(404).send(`Could not find user ${req.params.username}`);
                } else {
                    return res.status(200).send(result);
                }
            }).catch((err) => {
                if (err.name === 'CastError') {
                    return res.status(400).send('One or more keys were of an invalid type and could not be coerced to the correct type.');
                } else {
                    console.log('\n\n\nERROR:\n');
                    console.log(err);
                    return res.status(500).send(err);
                }
            });
    });

// No Auth needed to create a new user
app.post('/user/register',
    [
        check('username', 'Username must be 8-63 characters').isString().isLength({ min: 8, max: 63 }),
        check('username', 'Username must only contain letters, numbers, underscore and dash').isAlphanumeric('en-US', { ignore: '_-' }),
        check('email', 'Email must be valid').isEmail(),
        check('password', 'Password must be 8 characters and contain an uppercase letter, a lowercase letter, a number, and a symbol').isStrongPassword(),
        check('birthdate', 'Birthdate must be a valid ISO 8601 date').isISO8601(),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }
        const username = req.body.username.toLowerCase();
        const email = req.body.email;

        // bcrypt doesn't throw errors on an empty string, so check plain req and we will hash the password later
        if (!username || !email || !req.body.password) {
            return res.status(400).send('Missing paramter(s) username, email, or password');
        }

        // Now that we know we have a password, let's hash it
        const hashedPass = user.hashPassword(req.body.password);

        // Verify username is not taken and email is not used
        user.findOne({
            $or: [
                { username: username },
                { email: email },
            ],
        }).then((result) => {
            if (result) {
                return res.status(400).send(`user with username "${username}" or email "${email}" already exists`);
            } else {
                user.create({
                    username: username,
                    password: hashedPass,
                    email: req.body.email,
                    birthdate: req.body.birthdate,
                    favorites: [],
                }).then((newResult) => {
                // So, create() doesn't suport projections, and
                // for some reason using `delete newResult.password` doesn't appear to work
                    newResult.password = undefined;
                    delete newResult.password;
                    console.log('User post-delete newResult.password:');
                    console.log(newResult);
                    return res.status(201).send(newResult);
                });
            }
        }).catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send('One or more keys were of an invalid type and could not be coerced to the correct type.');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            }
        });
    });

app.delete('/user/:id',
    [
        passport.authenticate('jwt', { session: false }),
        check('id', 'ID must be valid Mongo ID').isMongoId(),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }

        // Compare URL to JWT
        if (!req.user._id || req.params.id !== req.user._id.toString()) {
            return res.status(403).send('URL Parameter and authorized user mismatch');
        }
        user.deleteOne({
            _id: req.params.id,
        }).then((result) => {
            return res.status(200).send(result);
        }).catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send('One or more URL parameters were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            }
        });
    });

app.post('/user/:username/favorites/:favorite', 
    [
        passport.authenticate('jwt', { session: false }),
        check('username', 'Invalid Username').isString().isAlphanumeric('en-US', { ignore: '_-' }),
        check('favorite', 'Favorite is not valid MongoID').isMongoId(),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }

        // Compare URL to JWT
        if (!req.params.username || req.params.username !== req.user.username) {
            return res.status(403).send('URL Parameter and authorized user mismatch');
        }

        const username = req.params.username;
        const favorite = req.params.favorite;

        user.findOneAndUpdate({
            username: username,
        }, {
            $addToSet: {
                favorites: favorite,
            },
        },
        {
            // Return the post-update object
            new: true,
            // Hide password in result
            projection: { password: 0 },
        }).then((result) => {
            return res.status(200).send(result);
        }).catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send('One or more URL parameters were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            }
        });

    });

app.delete('/user/:username/favorites/:favorite', 
    [
        passport.authenticate('jwt', { session: false }),
        check('username', 'Invalid Username').isString().isAlphanumeric('en-US', { ignore: '_-' }),
        check('favorite', 'Favorite is not valid MongoID').isMongoId(),
    ],
    (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() });
        }

        // Compare URL to JWT
        if (!req.params.username || req.params.username !== req.user.username) {
            return res.status(403).send('URL Parameter and authorized user mismatch');
        }

        const username = req.params.username;
        const favorite = req.params.favorite;

        user.findOneAndUpdate({
            username: username,
        }, {
            $pull: {
                favorites: favorite,
            },
        },
        {
            // Return the post-update object
            new: true,
            // Hide password in result
            projection: { password: 0 },
        }).then((result) => {
            if (!result) {
                return res.status(404).send(`Could not find user with username ${username}`);
            } else {
                return res.status(200).send(result);
            }
        }).catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).send('One or more URL parameters were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                return res.status(500).send(err);
            }
        });
    });


// Master Error Handler
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(err);
    logStream.write(`${timestamp} Error: ${err.message}\n`);
    logStream.write(`${timestamp} Error stack trace: ${err.stack}\n`);
    logStream.write(`${timestamp} Error Request: ${JSON.stringify(req)}\n`);
    res.status(500).send('server error occurred');
    next();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on ${port}`);
});
