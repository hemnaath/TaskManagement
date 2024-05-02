const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence');

const taskSchema = new mongoose.Schema({
    task_title:{type:String, require:true},
    description:{type: String, require:true},
    notes:{type:String, require:true},
    assigned_to:{type:mongoose.Schema.Types.ObjectId, require:true},
    status:{type:String, require:true},
    created_by:{type:mongoose.Schema.Types.ObjectId, require:true},
    priority:{type:String, require:true},
    release_version:{type:String, require:true},
    start_date:{type:Date, require:true},
    effort_estimation:{type:Number, require:true},
    task_type:{type:String, require:true},
    project_id:{type:mongoose.Schema.Types.ObjectId, require:true},
    filename:{type:String},
    filepath:{type:String}
},
{
    timestamps:true
});
taskSchema.plugin(autoIncrement(mongoose), {inc_field:'task_number'});

const task = mongoose.model('task', taskSchema);

module.exports = task;