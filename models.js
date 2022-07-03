const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.ObjectId;
const bcrypt = require('bcrypt');

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
