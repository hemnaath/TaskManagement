const mongoose = require('mongoose');
const user = require('./userModel');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, require: true, unique: true },
  projectMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: user }],
  status: { type: String, require:true },
  timeline: { type: Date, require:true },
  effortEstimation: { type: Number, require:true },
  effortSpent: { type: Number, require:true },
  completionDate: { type: Date, require:true },
});

const project = mongoose.model('Project', projectSchema);

module.exports = project;
