const express = require('express');
const app = express();
const morgan = require('morgan');
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
