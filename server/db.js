
const mongoose = require('mongoose');
require('dotenv').config();

const connectToDb = async (callback) => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Successfully connected to the DB!');
        callback();
    } catch(err) {
        console.log('Error connecting to the DB: ', err);
    }
};

module.exports = { connectToDb };