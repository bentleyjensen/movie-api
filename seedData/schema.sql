CREATE TABLE genres(
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL,
    description varchar(1000)
);

CREATE TABLE directors(
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL,
    bio varchar(1000),
    birthdate date,
    deathdate date
);

CREATE TABLE movies(
    id serial PRIMARY KEY,
    title varchar(50) NOT NULL,
    release_year integer,
    description varchar(1000),
    director_id integer NOT NULL,
    genre_id integer NOT NULL,
    image_url varchar(300),
    featured boolean,
    CONSTRAINT genre_key FOREIGN KEY (genre_id)
        REFERENCES genres (id),
    CONSTRAINT director_key FOREIGN KEY (director_id)
        REFERENCES directors (id)
);

CREATE TABLE users(
    id serial PRIMARY KEY,
    username varchar(50)  NOT NULL,
    password varchar(255)  NOT NULL,
    email varchar(255)  NOT NULL,
    birthdate date
);

CREATE TABLE favorites(
    id serial PRIMARY KEY,
    user_id integer,
    movie_id integer,
    CONSTRAINT user_key FOREIGN KEY (user_id)
        REFERENCES users (id),
    CONSTRAINT movie_key FOREIGN KEY (movie_id)
        REFERENCES movies (id)
);

-- Insert genres
INSERT INTO genres(name, description)
VALUES ('Short','Not too long!');

INSERT INTO genres(name, description)
VALUES ('Adventure','Follow a memorable character on an unbelievable journey');

INSERT INTO genres(name, description)
VALUES ('Action','Fast-paced, fighting, and of course, action is included in these films.');

INSERT INTO genres(name, description)
VALUES ('Romance','These movies follow people in love - or about to be.');

INSERT INTO genres(name, description)
VALUES ('Thriller','The ''keep you on the edge of your seat'' mood and anticipation centric storylines are found here.');

INSERT INTO genres(name, description)
VALUES ('Comedy','The best movies to watch with buddies or when you feel down and need a laugh');

INSERT INTO genres(name, description)
VALUES ('Sci-Fi','Science Fiction - it''s fantasy without the magic, and sometimes aliens or the future.');

INSERT INTO genres(name, description)
VALUES ('Horror','Jump scares, murder, chases, and all other scary stuff to give you the heebie-jeebies.');


-- Insert directors
-- Some bios taken in full or part from imdb.com
INSERT INTO directors(name, bio, birthdate)
VALUES ('Sam Mendez','Known for 1917, which was edited to look like it was taken in a single shot','1965-08-01');

INSERT INTO directors(name, bio, birthdate)
VALUES ('M. Night Shyamalan','His major films include the science fiction thriller Signs (2002), the psychological thriller The Village (2004), the fantasy thriller Lady in the Water (2006), The Happening (2008), The Last Airbender (2010), After Earth (2013), and the horror films The Visit (2015) and Split (2016).','1970-09-06');

INSERT INTO directors(name, bio, birthdate)
VALUES ('Christopher Nolan','Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan has, over the course of 15 years of filmmaking, gone from low-budget independent films to working on some of the biggest blockbusters ever made.','1970-07-30');

INSERT INTO directors(name, bio, birthdate)
VALUES ('Martin Campbell','Considered one of the U.K.''s top directors by the mid-''80s, he directed the highly praised British telefilm, Reilly: Ace of Spies (1983). For his work on Edge of Darkness (1985), a five-hour BBC miniseries about nuclear contamination in England that depicted murder and high-ranking corruption, he won six BAFTA awards.','1943-08-24');

INSERT INTO directors(name, bio, birthdate)
VALUES ('Marc Forster','Marc Forster is a German-born filmmaker and screenwriter. He is best known for directing the films Monster''s Ball (2001), Finding Neverland (2004), Stay (2005), Stranger than Fiction (2006), The Kite Runner (2007), Quantum of Solace (2008), and World War Z (2013).','1969-11-30');


-- Insert movies
-- Descriptions were entirely taken from imdb.com
INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Casino Royale',2006,'After earning 00 status and a licence to kill, secret agent James Bond sets out on his first mission as 007. Bond must defeat a private banker funding terrorists in a high-stakes game of poker at Casino Royale, Montenegro.',4,3,'./Casino_Royale.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Quantum of Solace',2008,'James Bond descends into mystery as he tries to stop a mysterious organisation from eliminating a country''s most valuable resource.',5,3,'./QuantumOfSolace.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Skyfall',2012,'James Bond''s loyalty to M is tested when her past comes back to haunt her. When MI6 comes under attack, 007 must track down and destroy the threat, no matter how personal the cost.',1,3,'./Skyfall.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Interstellar',2014,'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',3,7,'./.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Inception',2010,'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',3,7,'./Inception.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Batman Begins',2005,'After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.',3,3,'./BatmanBegins.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Signs',2002,'A widowed former reverend living with his children and brother on a Pennsylvania farm finds mysterious crop circles in their fields, which suggests something more frightening to come.',2,7,'./Signs.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('The Village',2004,'A series of events tests the beliefs of a small isolated countryside village.',2,5,'./TheVillage.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('Devil',2010,'A group of people are trapped in an elevator and the Devil is mysteriously amongst them.',2,8,'./Devil.jpg',false);

INSERT INTO movies(title, release_year, description, director_id, genre_id, image_url, featured)
VALUES ('The Sixth Sense',1999,'A frightened, withdrawn Philadelphia boy who communicates with spirits seeks the help of a disheartened child psychologist.',2,5,'./TheSixthSense.jpg',false);


-- Insert users
INSERT INTO users(username, password, email, birthdate)
VALUES ('Bentley','TestPassword123','Bentley@bentley.com','1990-01-01');

INSERT INTO users(username, password, email, birthdate)
VALUES ('Elyssa','ThisIsNotMy Password','elyssa@elyssa.com','1992-02-02');

INSERT INTO users(username, password, email, birthdate)
VALUES ('Sterling','Password!1','sterling@sterling.com','1993-03-03');

-- Insert favorites

INSERT INTO favorites(user_id, movie_id)
VALUES (1,2);

INSERT INTO favorites(user_id, movie_id)
VALUES (2,4);

INSERT INTO favorites(user_id, movie_id)
VALUES (2,2);

INSERT INTO favorites(user_id, movie_id)
VALUES (3,4);
