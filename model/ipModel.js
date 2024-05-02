const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    ip_address:{type:String, unique:true},
    user_id:{type: mongoose.Schema.Types.ObjectId},
},
{
    timestamps:true
});

const ip = mongoose.model('ip', ipSchema);

module.exports = ip;