const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 8000;
const mongoose = require('mongoose');
const {movie, user, director} = require('./models');

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true });

// File stream to append to log
const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
const logTemplate = ':date[iso] :method :url :status :res[content-length] - :response-time ms';

function authorizeUser(req, res, next) {
    // TODO: Impletement
    // Denial of Authorization is a 404, not a redirect.
    next();
}

// Run before Each request handler
app.use(morgan(logTemplate, { stream: logStream }));

app.use(bodyParser.json());

// These need bodyParser to have already  run when being called
const passport = require('passport');

// bring in login endpoint
require('./auth')(app);
require('./passport');

app.use(authorizeUser);

// Static files served from the /public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: `${__dirname}/public` });
});

app.get('/documentation', (req, res) => {
    res.sendFile('documentation.html', { root: `${__dirname}/public` });
});

app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    movie.find()
        .populate('director')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
});

app.get('/movies/title/:title', (req, res) => {
    movie.findOne({title: req.params.title})
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send(`Could not find movie with title ${req.params.title}`);
            }
        }).catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send('One or more URL parameters were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                res.status(500).send(err);
            }
        });
});

app.get('/directors', (req, res) => {
    director.find()
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        });
});

app.get('/directors/:name', (req, res) => {
    director.findOne({name: req.params.name})
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send(`Could not find director ${req.params.name}`);
            }
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        });
});

app.get('/genres', (req, res) => {
    movie.distinct('genre')
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        });
});

app.get('/movies/genre/:genre', (req, res) => {
    movie.find({ 'genre.name': req.params.genre })
        .then((result) => {
            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).send(`Cannot find any movies with genre ${req.params.genre}`);
            } else {
                res.status(200).send(result);
            }
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        });
});

app.get('/users', (req, res) => {
    user.find()
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        });
});

app.get('/users/:username', (req, res) => {
    user.findOne({username: req.params.username})
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send(`Could not find user with username: ${req.params.username}`);
            }
        }).catch((err) => {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
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
app.put('/users/:username', (req, res) => {
    // Use URL param to find username, and body to update it
    // This enables a user to change their username
    user.findOneAndUpdate({ username: req.params.username },
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthdate: req.body.birthdate,
                favorites: req.body.favorites,
            },
        },
        {
            // Return the post-update object
            new: true,
        })
        .then((result) => {
            if (!result) {
                res.status(404).send(`Could not find user ${req.params.username}`);
            } else {
                res.status(200).send(result);
            }
        }).catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send('One or more keys were of an invalid type');
            } else {
                console.log('\n\n\nERROR:\n');
                console.log(err);
                res.status(500).send(err);
            }
        });
});

app.post('/users', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;

    if (!username || !email) {
        res.status(400).send('Both username and email required');
    }

    user.findOne({
        $or: [
            {username: req.body.username},
            {email: req.body.email},
        ],
    }).then((result) => {
        if (result) {
            res.status(400).send(`user with username "${username}" or email "${email}" already exists`);
        } else {
            user.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthdate: req.body.birthdate,
                favorites: req.body.favorites,
            }).then((newResult) => {
                res.status(201).send(newResult);
            });
        }
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send('One or more keys were an invalid type');
        } else {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        }
    });
});

app.delete('/users/:id', (req, res) => {
    user.deleteOne({
        _id: req.params.id,
    }).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send('One or more URL parameters were of an invalid type');
        } else {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        }
    });
});

app.post('/users/:username/favorites/:favorite', (req, res) => {
    const username = req.params.username;
    const favorite = req.params.favorite;

    user.findOneAndUpdate({
        username: username,
    }, {
        $addToSet: {
            favorites: favorite,
        },
    }, {
        new: true,
    }).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send('One or more URL parameters were of an invalid type');
        } else {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
        }
    });

});

app.delete('/users/:username/favorites/:favorite', (req, res) => {
    const username = req.params.username;
    const favorite = req.params.favorite;

    user.findOneAndUpdate({
        username: username,
    }, {
        $pull: {
            favorites: favorite,
        },
    }, {
        new: true,
    }).then((result) => {
        if (!result) {
            res.status(404).send(`Could not find user with username ${username}`);
        } else {
            res.status(200).send(result);
        }
    }).catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send('One or more URL parameters were of an invalid type');
        } else {
            console.log('\n\n\nERROR:\n');
            console.log(err);
            res.status(500).send(err);
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

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
