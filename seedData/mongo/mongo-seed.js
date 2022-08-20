use movies;

db.createCollection('movies');
db.createCollection('users');
db.createCollection('directors');

db.movies.insertMany([
    {
        _id: ObjectId('6293196ff04c1332bdae9490'),
        title: 'Casino Royale',
        year: 2006,
        description: 'After earning 00 status and a licence to kill, secret agent James Bond sets out on his first mission as 007. Bond must defeat a private banker funding terrorists in a high-stakes game of poker at Casino Royale, Montenegro.',
        genre: {
            name: 'Action',
            description: 'Fast-paced, fighting, and of course, action is included in these films.',
        },
        director: ObjectId('6293196ff04c1332bdae9501'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9491'),
        title: 'Quantum of Solace',
        year: 2008,
        description: 'James Bond descends into mystery as he tries to stop a mysterious organisation from eliminating a country\'s most valuable resource.',
        genre: {
            name: 'Action',
            description: 'Fast-paced, fighting, and of course, action is included in these films.',
        },
        director: ObjectId('6293196ff04c1332bdae9502'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9492'),
        title: 'Skyfall',
        year: 2012,
        description: 'James Bond\'s loyalty to M is tested when her past comes back to haunt her. When MI6 comes under attack, 007 must track down and destroy the threat, no matter how personal the cost.',
        genre: {
            name: 'Action',
            description: 'Fast-paced, fighting, and of course, action is included in these films.',
        },
        director: ObjectId('6293196ff04c1332bdae949e'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9493'),
        title: 'Interstellar',
        year: 2014,
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genre: {
            name: 'Sci-Fi',
            description: 'Science Fiction - its fantasy without the magic, and sometimes aliens or the future.',
        },
        director: ObjectId('6293196ff04c1332bdae9500'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9494'),
        title: 'Inception',
        year: 2010,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        genre: {
            name: 'Sci-Fi',
            description: 'Science Fiction - its fantasy without the magic, and sometimes aliens or the future.',
        },
        director: ObjectId('6293196ff04c1332bdae9500'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9495'),
        title: 'Batman Begins',
        year: 2005,
        description: 'After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.',
        genre: {
            name: 'Action',
            description: 'Fast-paced, fighting, and of course, action is included in these films.',
        },
        director: ObjectId('6293196ff04c1332bdae9500'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9496'),
        title: 'Signs',
        year: 2002,
        description: 'A widowed former reverend living with his children and brother on a Pennsylvania farm finds mysterious crop circles in their fields, which suggests something more frightening to come.',
        genre: {
            name: 'Sci-Fi',
            description: 'Science Fiction - its fantasy without the magic, and sometimes aliens or the future.',
        },
        director: ObjectId('6293196ff04c1332bdae949f'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9497'),
        title: 'The Village',
        year: 2004,
        description: 'A series of events tests the beliefs of a small isolated countryside village.',
        genre: {
            name: 'Thriller',
            description: 'The \'keep you on the edge of your seat\' mood and anticipation centric storylines are found here.',
        },
        director: ObjectId('6293196ff04c1332bdae949f'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9503'),
        title: 'Devil',
        year: 2010,
        description: 'A group of people are trapped in an elevator and the Devil is mysteriously amongst them.',
        genre: {
            name: 'Horror',
            description: 'Jump scares, murder, chases, and all other scary stuff to give you the heebie-jeebies.',
        },
        director: ObjectId('6293196ff04c1332bdae949f'),
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9498'),
        title: 'The Sixth Sense',
        year: 1999,
        description: 'A frightened, withdrawn Philadelphia boy who communicates with spirits seeks the help of a disheartened child psychologist.',
        genre: {
            name: 'Thriller',
            description: 'The \'keep you on the edge of your seat\' mood and anticipation centric storylines are found here.',
        },
        director: ObjectId('6293196ff04c1332bdae949f'),
    },
]);

db.users.insertMany([
    {
        _id: ObjectId('6293196ff04c1332bdae9499'),
        username: 'Bentley',
        password: 'Password1',
        birthdate: new Date('1991-01-01'),
        favorites: [
            ObjectId('6293196ff04c1332bdae9491'),
            ObjectId('6293196ff04c1332bdae9492'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae949a'),
        username: 'Elyssa',
        password: 'TestPassword1',
        birthdate: new Date('1992-02-02'),
        favorites: [
            ObjectId('6293196ff04c1332bdae9493'),
            ObjectId('6293196ff04c1332bdae9494'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae949b'),
        username: 'Collin',
        password: 'OtherTestPassword1',
        birthdate: new Date('1993-03-03'),
        favorites: [
            ObjectId('6293196ff04c1332bdae9494'),
            ObjectId('6293196ff04c1332bdae9495'),
            ObjectId('6293196ff04c1332bdae9503'),
            ObjectId('6293196ff04c1332bdae9498'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae949c'),
        username: 'Breanna',
        password: 'OtherTestPassword2',
        birthdate: new Date('1994-04-04'),
        favorites: [],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae949d'),
        username: 'Pip',
        password: 'OtherTestPassword3',
        birthdate: new Date('1995-05-05'),
        favorites: [],
    },
]);

db.directors.insertMany([
    {
        _id: ObjectId('6293196ff04c1332bdae949e'),
        name: 'Sam Mendez',
        birthdate: new Date('1965-08-01'),
        bio: 'Known for 1917, which was edited to look like it was taken in a single shot',
        movies: [
            ObjectId('6293196ff04c1332bdae9492'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae949f'),
        name: 'M. Night Shyamalan',
        birthdate: new Date('1970-09-06'),
        bio: 'His major films include the science fiction thriller Signs (2002), the psychological thriller The Village (2004), the fantasy thriller Lady in the Water (2006), The Happening (2008), The Last Airbender (2010), After Earth (2013), and the horror films The Visit (2015) and Split (2016).',
        movies: [
            ObjectId('6293196ff04c1332bdae9496'),
            ObjectId('6293196ff04c1332bdae9497'),
            ObjectId('6293196ff04c1332bdae9503'),
            ObjectId('6293196ff04c1332bdae9498'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9500'),
        name: 'Christopher Nolan',
        birthdate: new Date('1970-07-30'),
        bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan has, over the course of 15 years of filmmaking, gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
        movies: [
            ObjectId('6293196ff04c1332bdae9493'),
            ObjectId('6293196ff04c1332bdae9494'),
            ObjectId('6293196ff04c1332bdae9495'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9501'),
        name: 'Martin Campbell',
        birthdate: new Date('1943-08-24'),
        bio: 'Considered one of the U.K.\'s top directors by the mid-\'80s, he directed the highly praised British telefilm, Reilly: Ace of Spies (1983). For his work on Edge of Darkness (1985), a five-hour BBC miniseries about nuclear contamination in England that depicted murder and high-ranking corruption, he won six BAFTA awards.',
        movies: [
            ObjectId('6293196ff04c1332bdae9490'),
        ],
    },
    {
        _id: ObjectId('6293196ff04c1332bdae9502'),
        name: 'Marc Forster',
        birthdate: new Date('1969-11-30'),
        bio: 'Marc Forster is a German-born filmmaker and screenwriter. He is best known for directing the films Monster\'s Ball(2001), Finding Neverland(2004), Stay(2005), Stranger than Fiction(2006), The Kite Runner(2007), Quantum of Solace(2008), and World War Z(2013).',
        movies: [
            ObjectId('6293196ff04c1332bdae9491'),
        ],
    },
]);
