const mongoose = require('mongoose');
const user = require('./userModel');
const task = require('./taskModel');

const logSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:user, require:true},
    task_id:{type:mongoose.Schema.Types.ObjectId, ref:task, require:true},
    assigned_user_id:{type:mongoose.Schema.Types.ObjectId, ref:user},
    log:{type:String, require:true},
    is_read:{type:Boolean}
});

const log = mongoose.model('log', logSchema);

module.exports = log;