const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/CRM');
console.log("Database Connected");


module.exports = mongoose;