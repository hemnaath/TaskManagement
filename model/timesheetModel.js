const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    date: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId},
    worked_hours: { type: String },
    in_time: { type: String },
    out_time: { type: String }
});
timesheetSchema.index({ date: 1 }, { unique: false });

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;
