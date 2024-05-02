const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment:{type:String, require:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, require:true},
    task_id:{type:mongoose.Schema.Types.ObjectId, require:true},
},
{
    timestamps:true
});

const comment = mongoose.model('comment', commentSchema);

module.exports = comment;