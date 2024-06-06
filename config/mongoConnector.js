const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://RS_TECH_DEV:rstechdev@cluster0.4u4yuef.mongodb.net/CRM');
console.log("Database Connected");


module.exports = mongoose;