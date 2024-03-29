const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.ObjectId;
const bcrypt = require('bcrypt');

/**
 * @typedef {string} MongoID
 */

/**
 * @typedef Genre
 * @property {string} name - The genre name
 * @property {string} description - A brief description of the genre
 */


/**
 * @typedef Movie
 * @property {MongoID} _id - Movie ID
 * @property {string} title - The title of the movie
 * @property {number} year - The year the movie was released
 * @property {string} description - A brief description of the movie
 * @property {Genre} genre - Genre of the movie
 * @property {Director} director - The person who directed the movie
 * @property {string[]} actors - Persons who acted in the movie
 */
const movieSchema = Mongoose.Schema({
    title: {type: String, required: true},
    year: {
        type: Number,
        min: 1888,
        max: 3000,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    description: String,
    genre: {
        name: String,
        description: String,
    },
    director: {type: ObjectId, ref: 'director'},
    actors: [String],
});

/**
 * @typedef Director
 * @property {MongoID} _id - The director's ID
 * @property {string} name - The Director's name
 * @property {dateString} birthdate - The director's birthdate
 * @property {string} bio - A brief description of the director's life
 * @property {Movie[] | MongoID[]} movies - movies the director has directed
 */
const directorSchema = Mongoose.Schema({
    name: {type: String, required: true},
    birthdate: Date,
    bio: String,
    movies: [{type: ObjectId, ref: 'movie'}],
});

/**
 * @typedef User
 * @property {MongoID} _id - The user's ID
 * @property {string} username - The user's username
 * @property {string} password - The user's password
 * @property {string} email - The user's email
 * @property {dateString} birthdate - The user's birthdate
 * @property {Movie[]} favorites - The user's favorites
 */
const userSchema = Mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthdate: Date,
    favorites: [{type: ObjectId, ref: 'movie'}],
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// No arrow functions because this is an instance method
// Arrow functions bind `this` to the object instead of the instance
userSchema.methods.validatePassword = function(argPass) {
    // using `this.password` as the argument is making it break, so do it in two lines
    const instancePass = this.password;
    return bcrypt.compareSync(argPass, instancePass);

};

module.exports.movie = Mongoose.model('movie', movieSchema);
module.exports.director = Mongoose.model('director', directorSchema);
module.exports.user = Mongoose.model('user', userSchema);
