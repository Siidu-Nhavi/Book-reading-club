const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/BookNest")
  .then(() => console.log('Connected to local MongoDB!'))
  .catch(err => console.error('Connection error:', err));
module.exports = mongoose;