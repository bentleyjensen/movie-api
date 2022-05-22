const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { dir } = require('console');
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
        password: 'RandomPassword1!',
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
