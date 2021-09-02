const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Movie = new Schema({
    username: {
    type: String,
    required: true
    },
    movie_description: String,
    movie_price: String,
});

module.exports = mongoose.model('Movie', Movie)

