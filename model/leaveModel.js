const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    leave_type:{type:String}, 
    applied_on:{type:String}, 
    status:{type:String}, 
    reason:{type:String}, 
    emergency_contact:{type:Number},
    applied_by:{type:mongoose.Schema.Types.ObjectId}
},
{
    timestamps:true
});

const leave = mongoose.model('leave', leaveSchema);

module.exports = leave;