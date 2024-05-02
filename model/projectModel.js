const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    project_name:{type:String, require:true},
    created_by:{type: mongoose.Schema.Types.ObjectId, require:true},
    org_id:{type:mongoose.Schema.Types.ObjectId, require:true},
},
{
    timestamps:true
});

const project = mongoose.model('project', projectSchema);

module.exports = project;