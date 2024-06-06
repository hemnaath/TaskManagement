const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://RS-Tech:Insideout%4018!!@cluster0.4u4yuef.mongodb.net/CRM');
console.log("Database Connected");


module.exports = mongoose;