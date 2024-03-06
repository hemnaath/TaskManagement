const mongoose = require('mongoose');
const user = require('./userModel');
const task = require('./taskModel');

const commentSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:user, require:true},
    task_id:{type:mongoose.Schema.Types.ObjectId, ref:task, require:true},
    comment:{type:String, require:true}
});

const comment = mongoose.model('comment', commentSchema);

module.exports = comment;