const mongoose = require('mongoose');
const user = require('./userModel');
const team = require('./teamModel');
const project = require('./projectModel');

const taskSchema = new mongoose.Schema({
    task_number:{type:String},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref:user, required:true},
    team_id:{type: mongoose.Schema.Types.ObjectId, ref:team, default:null},
    project_id:{type: mongoose.Schema.Types.ObjectId, ref:project, required:true},
    task_type:{type:String, required:true},
    reference_task_id:{type: mongoose.Schema.Types.ObjectId, ref:'task', default:null},
    task_title:{type: String, required:true},
    status:{type:String, required:true},
    priority:{type:String, required:true},
    effort_estimation:{type:Number, required:true},
    description:{type:String, require:true}
});

const task = mongoose.model('task', taskSchema);

module.exports = task;