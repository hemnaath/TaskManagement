const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const taskSchema = new mongoose.Schema({
    task_title: { type: String, required: true },
    description: { type: String, default:null },
    notes: { type: String, default:null },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, default:null },
    status: { type: String, enum: ['completed', 'on_hold', 'accepted', 'unassigned'], default:null},
    created_by: { type: mongoose.Schema.Types.ObjectId, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default:null},
    release_version: { type: String, default:null },
    start_date: { type: Date, default:null },
    effort_estimation: { type: Number, default:null },
    task_type: { type: String, enum: ['bug', 'cr'], required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, default:null },
    filepath: { type: String, default:null },
}, {
    timestamps: true
});

taskSchema.plugin(autoIncrement, { inc_field: 'task_number' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;