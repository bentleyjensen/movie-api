const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const port = 8000;

const movies = [
    {
        title: 'Casino Royale',
        year: 2006,
        rating: 'PG-13',
        genres: ['Action', 'Adventure', 'thriller'],
        director: 'Martin Campbell',
        stars: ['Daniel Craig', 'Eva Green', 'Judy Dench'],
        series: '007',
    },
    {
        title: 'Quantum Of Solace',
        year: 2008,
        rating: 'PG-13',
        genres: ['Action', 'Adventure', 'thriller'],
        director: 'Marc Forster',
        stars: ['Daniel Craig', 'Olga Kurylenko', 'Mathieu Amalric'],
        series: '007',
    },
    {
        title: 'Skyfall',
        year: 2012,
        rating: 'PG-13',
        genres: ['Action', 'Adventure', 'thriller'],
        director: 'Sam Mendez',
        stars: ['Daniel Craig', 'Javier Bardem', 'Naomie Harris'],
        series: '007',
    },
    {
        title: 'Interstellar',
        year: 2014,
        rating: 'PG-13',
        genres: ['Adventure', 'Drama', 'Sci-Fi'],
        director: 'Christopher Nolan',
        stars: [
            'Matthew McConaughey',
            'Anne Hathaway',
            'Jessica Chastain',
        ],
        series: 'None',
    },

];

const directors = {
    'Sam Mendez': {
        movies: [
            'Skyfall',
            'Spectre',
            'American Beauty',
            '1917',
        ],
        birthday: '1965-08-01',
        occupations: [
            'Director',
            'Producer',
            'Screenwriter',
        ],
    },
    'M. Night Shyamalan': {
        movies: [
            'Lady In The Water',
            'Signs',
            'The Sixth Sense',
            'The Village',
        ],
        birthday: '1970-09-06',
        occupations: [
            'Director',
            'Producer',
            'Screenwriter',
        ],
    },
    'Christopher Nolan': {
        movies: [
            'Interstellar',
            'Tenet',
            'Inception',
            'Batman Begins',
            'The Dark Knight',
            'The Dark Knight Rises',
        ],
        birthday: '1970-07-30',
        occupations: [
            'Director',
            'Producer',
            'Screenwriter',
        ],
    },
};

const genres = {
    'short': {
        movies: [
            'For The Birds',
            'Put that thing back where it came from or so help me',
            'Bao',
            'Soul',
        ],
        // Short flims, short description lol
        description: 'Not too long!',
    },
    'action': {
        movies: [
            'Avengers: Endgame',
            'Furious 7',
            'Skyfall',
        ],
        description: 'Fast-paced, fighting, and of course, action is included in these films.',
    },
    'adventure': {
        movies: [
            'Star Wars Ep. VII: The Force Awakens',
            'The Lion King',
            'The Lord of the Rings: The Fellowship of the Ring',
        ],
        description: 'Follow a memorable character on an unbelievable journey.',
    },
    'romance': {
        movies: [
            'The Notebook',
            'Titanic',
            'Casablanca',
        ],
        description: 'These movies follow people in love - or about to be.',
    },
    'thriller': {
        movies: [
            'Inception',
            'Gravity',
            'The Hunger Games',
        ],
        description: 'The \'keep you on the edge of your seat\' mood and anticipation centric storylines are found here.',
    },
    'comedy': {
        movies: [
            'The Hangover',
            'Ted',
            'Bruce Almighty',
        ],
        description: 'The best movies to watch with buddies or when you feel down and need a laugh',
    },
    'sci-fi': {
        movies: [
            'Back to the Future',
            'E.T.',
            'The Terminator',
            'Enders Game',
            'Ready Player One',
        ],
        description: 'Science Fiction - it\'s fantasy without the magic, and sometimes aliens or the future.',
    },
    'horror': {
        movies: [
            'It',
            'Sinister',
            'The Exorcist',
            'The Silence Of The Lambs',
        ],
        description: 'Jump scares, murder, chases, and all other scary stuff to give you the heebie-jeebies.',
    },
};

const users = {
    'bentley': {
        id: 1,
        password: 'RandomPassword1!',
        favorites: [],
    },
    'elyssa': {
        id: 2,
        password: 'RandomPassword2!',
        favorites: [],
    },
};

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

app.use(authorizeUser);

app.use(bodyParser.json());

// Static files served from the /public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: `${__dirname}/public` });
});

app.get('/documentation', (req, res) => {
    res.sendFile('documentation.html', { root: `${__dirname}/public` });
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/title/:title', (req, res) => {
    const movie = movies.find((movie) => {
        return movie.title == req.params.title;
    });

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send({});
    }
});

app.get('/directors', (req, res) => {
    res.status(200).send(directors);
});

app.get('/directors/:name', (req, res) => {
    const returnObj = {};
    if (req.params.name in directors){
        // Wrap in an object to reflect existence in main obj
        returnObj[req.params.name] = directors[req.params.name];
        res.status(200).send(returnObj);
    } else {
        res.status(404).send({});
    }

});

app.get('/genres', (req, res) => {
    res.status(200).send(genres);
});

app.get('/genres/:genre', (req, res) => {
    const returnObj = {};
    if (req.params.genre in genres) {
        returnObj[req.params.genre] = directors[req.params.genre];
        res.status(200).send(returnObj);
    } else {
        res.status(404).send({});
    }
});

app.post('/users', (req, res) => {
    const username = req.body.username;
    const exists = Object.keys(users).indexOf(username) >= 0;

    if(username && !exists) {
        const newUser = {};
        newUser[username] = {
            id: uuid.v4(),
            password: req.body.password || '',
            favorites: [],
        };

        users[username] = newUser[username];
        res.status(201).send(newUser);
    } else if (username && exists) {
        res.status(400).send(`User with username ${username} already exists`);
    } else if (!username) {
        res.status(400).send('Field \'username\' is missing');
    }
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    // Getting the user object that contains the ID doesn't help us
    // to be able to delete it, so we're going to use Object.keys()
    // to get the actual username, which we can use to delete the
    // property on the main users object
    const userList = Object.keys(users);
    const deleteUser = userList.find((username) => {
        // Access the id for every username and compare
        // When true, sets deleteUser to the _username_ passed in to
        // the callback, not the user[username] object
        return users[username].id == id;
    });

    if(!deleteUser) {
        res.status(404).send(`Could not find user with id ${id}`);
    } else{
        // This line is why we needed to use Object.keys() and
        // Array.find() above
        delete users[deleteUser];

        res.status(200).send(`User with id ${id} was deleted`);
    }
});

app.put('/users/:username/favorites/:favorite', (req, res) => {
    const user = req.params.username;
    const favorite = req.params.favorite;

    if (users[user].favorites.indexOf(favorite) == -1) {
        users[user].favorites.push(favorite);
        res.status(201);
    } else {
        res.status(200);
    }
    res.send(users[user].favorites);

});

app.delete('/users/:username/favorites/:favorite', (req, res) => {
    const user = req.params.username;
    const favorite = req.params.favorite;

    const index = users[user].favorites.indexOf(favorite);

    // Only attempt removal if it is in the list
    if (index >= 0) {
        // Start at {index} and remove 1 element
        users[user].favorites.splice(index, 1);
    }

    // Send current favorites, even if we didn't modify the list
    res.status(200).send(users[user].favorites);
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
