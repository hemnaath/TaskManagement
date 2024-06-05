const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    ip_address:{type:String, unique:true, default:null},
    user_id:{type: mongoose.Schema.Types.ObjectId, default:null},
},
{
    timestamps:true
});

const ip = mongoose.model('ip', ipSchema);

module.exports = ip;