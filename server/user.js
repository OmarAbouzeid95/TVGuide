
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    watchList: {
        type: Array,
        required: true
    },
    reviews: {
        type: Array,
        required: true
    }
});


const User = model('User', userSchema);

module.exports = User;