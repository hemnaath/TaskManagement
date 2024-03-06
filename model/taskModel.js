const mongoose = require('mongoose');
const user = require('./userModel');
const team = require('./teamModel');
const project = require('./projectModel');

const taskSchema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref:user, required:true},
    team_id:{type: mongoose.Schema.Types.ObjectId, ref:team, required:true},
    project_id:{type: mongoose.Schema.Types.ObjectId, ref:project, required:true},
    task_type:{type:String, required:true},
    reference_task_id:{type: mongoose.Schema.Types.ObjectId, ref:'task'},
    dependencies:{type: mongoose.Schema.Types.ObjectId, ref:'task'},
    task_title:{type: String, required:true},
    status:{type:String, required:true},
    priority:{type:String, required:true},
    timeline:{type:Date, required:true},
    effort_estimation:{type:Number, required:true},
    effort_spent:{type:Number, required:true},
    completion_date:{type:Date, required:true},
    SDLC_stage:{type:String, required:true},
    release_version:{type:Number, require:true}
});

const task = mongoose.model('task', taskSchema);

module.exports = task;