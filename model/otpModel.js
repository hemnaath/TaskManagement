const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp:{type:Number, require:true},
},
{
    timestamps:true
});

const otp = mongoose.model('otp', otpSchema);

module.exports = otp;