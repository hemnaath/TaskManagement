const mongoose = require('mongoose');
const user = require('./userModel');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, require: true, unique: true },
  projectMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: user }],
  status: { type: String, require:true },
  effortEstimation: { type: Number, require:true },
});

const project = mongoose.model('Project', projectSchema);

module.exports = project;
