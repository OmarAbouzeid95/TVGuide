
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const movieSchema = Schema({
    movieId: {
        type: Number,
        unique: true,
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    ratingCount: {
        type: Number,
        required: true,
    },
    ratingTotal: {
        type: Number,
        required: true,
    },
    reviews: {
        type: Array,
        required: true,
    }
});

const Movie = model('Movie', movieSchema);

module.exports = Movie;