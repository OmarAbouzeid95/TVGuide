
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Movie = require('./movie');
const User = require('./user');
const { connectToDb } = require('./db');
const app = express();


app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const port = process.env.PORT || 6900;

connectToDb(() => {
    app.listen(port, () => {
        console.log('Server running on port ' + port);
    });
});

// Searching for email and password
app.post('/signIn', async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({email: email, password: password});
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({error: err});
    }
});

// creating a new user
app.post('/signUp', async (req, res) => {

    const userData = {...req.body, watchlist: [], type: 'user'};
    try {
        const newUser = new User(userData);
        await newUser.save();
        res.status(200).json({result: 'success', user: newUser});
    } catch(err) {
        res.status(500).json({error: err});
    }
});

// Checking if email exists
app.get('/user/:email', async (req, res) => {

    const userEmail = req.params.email;
    try {
        const user = await User.findOne({ email: userEmail });
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

// add to wishlist
app.patch('/user/add-to-watchlist', async (req, res) => {

    const { email, movie } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({email}, {$push: {watchList: movie}}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
});


// remove from wishlist
app.patch('/user/remove-from-watchlist', async (req, res) => {

    const { email, movie } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({email}, {$pull: {watchList: {id: movie.id}}}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
});


// fetching movie reviews from the DB
app.get('/movies/:id', async (req, res) => {

    const movieId = parseInt(req.params.id);
    try {
        const foundMovie = await Movie.findOne({movieId: movieId});
        const result = foundMovie || {};
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({error: err});
    }

});


// adding movie details (rating and reviews)
app.post('/movies', async (req, res) => {
    
    const body = req.body;
    try {
        const newMovieDetail = new Movie(body);
        const addedMovieDetail = await newMovieDetail.save();
        res.status(200).json(addedMovieDetail);
    } catch(err) {
        res.status(500).json({error: err});
    }

});

// deleting movie review
app.patch('/movies', async (req, res) => {

    const { id, email, comment } = req.body;
    try {
        const foundMovie = await Movie.findOne({movieId: id});
        let { reviews } = foundMovie;
        reviews = reviews.filter(review => !(review.email === email && review.comment === comment));
        const updatedMovie = await Movie.findOneAndUpdate({movieId: id}, {$set: {reviews}}, {new: true});
        res.status(200).json(updatedMovie);
    } catch(err) {
        res.status(500).json({error: err});
    }

});

// updating movie details
app.patch('/movies/update', async (req, res) => {

    const { id, updates } = req.body;
    try {
        const updatedMovie = await Movie.findOneAndUpdate({movieId:id}, {$set: updates}, {new: true});
        res.status(200).json(updatedMovie);    
    } catch(err) {
        res.status(500).json({error: err});
    }
});

// deleting user
app.delete('/user/delete', async (req, res) => {

    try {
        const { type } = await User.findOne({email: req.body.email});
        if(type === 'admin') {
            res.status(200).json({denied: 'Can\'t delete an admin account'});
            return;
        }
        const deletedUser = await User.deleteOne({email: req.body.email});
        res.status(200).json(deletedUser);
    } catch(err) {
        res.status(500).json({error: err});
    }
});

// updating user info
app.patch('/user/update', async (req, res) => {

    try{
        const { email, updates } = req.body;
        const updatedUser = await User.findOneAndUpdate({email}, {$set: updates}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json({error: err}); 
    }

});

// adding user reviews
app.patch('/user/add-review', async (req, res) => {

    try{
        const { email, updates } = req.body;
        const updatedUser = await User.findOneAndUpdate({email}, {$push: {reviews: updates}}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json({error: err}); 
    }

});

// deleting user reviews
app.patch('/user/delete-review', async (req, res) => {

    try{
        const { email, updates } = req.body;
        const updatedUser = await User.findOneAndUpdate({email}, {$pull: {reviews: updates}}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json({error: err}); 
    }

});

