const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.ObjectId;

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

const directorSchema = Mongoose.Schema({
    name: {type: String, required: true},
    birthdate: Date,
    bio: String,
});

const userSchema = Mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthdate: Date,
    favorites: [{type: ObjectId, ref: 'movie'}],
});

module.exports.movie = Mongoose.model('movie', movieSchema);
module.exports.director = Mongoose.model('director', directorSchema);
module.exports.user = Mongoose.model('user', userSchema);
