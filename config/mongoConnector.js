const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/taskM2');
console.log("Database Connected");


module.exports = mongoose;